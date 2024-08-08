import * as outputObjectBuilder from '../utility/OutputObjectBuilder.js';
import * as autoEmailHelper from '../utility/AutoEmailHelper.js';
import * as auth from '../utility/AuthFunc.js';

// POST http://localhost:3008/api/v1/application
export async function createApplication(req, res) {
    try {
        const authStatus = auth.allAllow(req);

        if (authStatus !== 200) {
            res.sendStatus(authStatus);
            return;
        }

        const applicationSuffix = { submit_time: new Date().toISOString().slice(0, 19).replace('T', ' ') };
        let formTitle;

        switch (req.body.application.lang.toLowerCase()) {
            case 'en':
                formTitle = 'title_en';
                break;
            case 'zh-hant':
            case 'zh_hant':
                formTitle = 'title_zh_hant';
                break;
            case 'zh':
                formTitle = 'title_zh';
                break;
        }

        let { data, status, error } = await req.app.locals.db
            .from('dim_form')
            .select(`
                ${formTitle},
                start_date,
                end_date,
                early_bird_end_date,
                early_bird_discount,
                ig_discount,
                return_discount
            `)
            .eq('form_id', req.body.application.form_id)
            .limit(1);

        if (error) {
            res.status(status).json(outputObjectBuilder.prependStatus(status, error, req.body));
            return;
        }

        if (data.length === 0) {
            res.status(404).json(outputObjectBuilder.prependStatus(
                404,
                `Form with id ${req.body.application.form_id} not found`,
                req.body
            ));
            return;
        }

        formTitle = data[0][formTitle];
        let currentDate = Date.parse(applicationSuffix.submit_time.slice(0, 10));

        if (currentDate < Date.parse(data[0].start_date) || currentDate > Date.parse(data[0].end_date)) {
            res.status(400).json(outputObjectBuilder.prependStatus(
                400,
                `Form with id ${req.body.application.form_id} not opening`,
                req.body
            ));
            return;
        }

        applicationSuffix.has_early_bird_discount = currentDate <= Date.parse(data[0].early_bird_end_date);
        applicationSuffix.has_ig_discount = !!req.body.application.ig_username;
        const earlyBirdDiscount = data[0].early_bird_discount;
        const igDiscount = data[0].ig_discount;
        const returnDiscount = data[0].return_discount;

        if (req.body.application.course_ids.length === 0) {
            res.status(400).json(outputObjectBuilder.prependStatus(400, `Empty course_ids`, req.body));
            return;
        }

        ({ data, status, error } = await req.app.locals.db
            .from('dim_course')
            .select('course_id, price, age_min, age_max')
            .in('course_id', req.body.application.course_ids));

        if (error) {
            res.status(status).json(outputObjectBuilder.prependStatus(status, error, req.body));
            return;
        }

        const courseMap = new Map();

        data.forEach(course => {
            courseMap.set(course.course_id, course);
        });

        let totalPrice = 0;
        currentDate = new Date(currentDate);
        const dob = new Date(Date.parse(req.body.student.dob));
        const age =
            dob.getMonth() > currentDate.getMonth()
            || dob.getMonth() === currentDate.getMonth() && dob.getDate() > currentDate.getDate()
                ? currentDate.getFullYear() - dob.getFullYear() - 1
                : currentDate.getFullYear() - dob.getFullYear();
        error = [];

        req.body.application.course_ids.forEach(courseId => {
            if (!courseMap.has(courseId)) {
                error.push({ course_id: courseId, issue: 'Not found' });
                return;
            }

            const course = courseMap.get(courseId);

            if (age < course.age_min || age > course.age_max) {
                error.push({ course_id: courseId, issue: 'Age requirement not met' });
                return;
            }

            totalPrice += course.price;
        });

        if (error.length > 0) {
            res.status(400).json(outputObjectBuilder.prependStatus(400, error, req.body));
            return;
        }

        ({ data, status, error } = await req.app.locals.db
            .from('dim_student')
            .select('student_id, credit_balance, held_credit')
            .eq('first_name', req.body.student.first_name)
            .eq('last_name', req.body.student.last_name)
            .eq('dob', req.body.student.dob)
            .limit(1));

        if (error) {
            res.status(status).json(outputObjectBuilder.prependStatus(status, error, req.body));
            return;
        }

        const student = {};

        if (data.length > 0) {
            student.student_id = data[0].student_id;
            Object.assign(student, req.body.student);
            student.credit_balance = data[0].credit_balance;
            student.held_credit = data[0].held_credit;

            ({ data, status, error } = await req.app.locals.db
                .from('fct_application')
                .select('application_id')
                .eq('student_id', student.student_id)
                .eq('form_id', req.body.application.form_id)
                .limit(1));

            if (error) {
                res.status(status).json(outputObjectBuilder.prependStatus(status, error, req.body));
                return;
            }

            if (data.length > 0) {
                res.status(400).json(outputObjectBuilder.prependStatus(
                    400,
                    `Duplicated application with student_id ${student.student_id} and form_id ${req.body.application.form_id}`,
                    req.body
                ));
                return;
            }

            const { first_name, last_name, dob, ...studentData } = req.body.student;

            ({ data, status, error } = await req.app.locals.db
                .from('dim_student')
                .update(studentData)
                .eq('student_id', student.student_id));

            if (error) {
                res.status(status).json(outputObjectBuilder.prependStatus(status, error, req.body));
                return;
            }

            ({ data, status, error } = await req.app.locals.db
                .from('fct_payment')
                .select('payment_id, fct_application!inner()')
                .eq('fct_application.student_id', student.student_id)
                .eq('payment_status', true)
                .limit(1));

            if (error) {
                res.status(status).json(outputObjectBuilder.prependStatus(status, error, req.body));
                return;
            }

            applicationSuffix.has_return_discount = data.length > 0;
        } else {
            ({ data, status, error } = await req.app.locals.db
                .from('dim_student')
                .insert(req.body.student)
                .select('student_id, credit_balance, held_credit'));

            if (error) {
                res.status(status).json(outputObjectBuilder.prependStatus(status, error, req.body));
                return;
            }

            student.student_id = data[0].student_id;
            Object.assign(student, req.body.student);
            student.credit_balance = data[0].credit_balance;
            student.held_credit = data[0].held_credit;
            applicationSuffix.has_return_discount = false;
        }

        const applicationData = { student_id: student.student_id };
        Object.assign(applicationData, req.body.application);

        if (applicationSuffix.has_early_bird_discount) {
            totalPrice -= earlyBirdDiscount;
        }

        if (applicationSuffix.has_ig_discount) {
            totalPrice -= igDiscount;
        }

        if (applicationSuffix.has_return_discount) {
            totalPrice -= returnDiscount;
        }

        totalPrice = Math.max(totalPrice, 0);

        if (totalPrice > student.credit_balance) {
            applicationSuffix.used_credit = student.credit_balance;
            applicationSuffix.price = totalPrice - student.credit_balance;
        } else {
            applicationSuffix.used_credit = totalPrice;
            applicationSuffix.price = 0;
        }

        ({ status, error } = await req.app.locals.db
            .from('dim_student')
            .update({
                credit_balance: student.credit_balance - applicationSuffix.used_credit,
                held_credit: student.held_credit + applicationSuffix.used_credit
            })
            .eq('student_id', student.student_id));

        if (error) {
            res.status(status).json(outputObjectBuilder.prependStatus(status, error, req.body));
            return;
        }

        Object.assign(applicationData, applicationSuffix);

        ({ data, status, error } = await req.app.locals.db
            .from('fct_application')
            .insert(applicationData)
            .select('application_id'));

        if (error) {
            res.status(status).json(outputObjectBuilder.prependStatus(status, error, req.body));
            return;
        }

        const application = { application_id: data[0].application_id };
        Object.assign(application, applicationData);
        req.body.student = student;
        req.body.application = application;

        autoEmailHelper.sendApplicationConfirm(student, formTitle, (error, info) => {
            if (error) {
                console.error(error);
                return;
            }

            console.log(info.response);
        });

        res.status(201).json(outputObjectBuilder.prependStatus(201, null, req.body));
    } catch (error) {
        res.status(400).json(outputObjectBuilder.prependStatus(400, error.message, req.body));
    }
}

// GET http://localhost:3008/api/v1/application
// GET http://localhost:3008/api/v1/application/:application_id
export async function readApplications(req, res) {
    const authStatus = auth.adminAllow(req);

    if (authStatus !== 200) {
        res.sendStatus(authStatus);
        return;
    }

    let query = req.app.locals.db
        .from('fct_application')
        .select('*, dim_student!inner(*), dim_form!inner(*)');

    if (req.params.application_id !== undefined) {
        query = query
            .eq('application_id', req.params.application_id)
            .limit(1);
    }

    const { data, status, error } = await query;

    if (error) {
        res.status(status).json(outputObjectBuilder.prependStatus(status, error, null));
        return;
    }

    if (req.params.application_id !== undefined && data.length === 0) {
        res.status(404).json(outputObjectBuilder.prependStatus(
            404,
            `Application with id ${req.params.application_id} not found`,
            null
        ));
        return;
    }

    for (let i = 0; i < data.length; i++) {
        //Get payment related information
        let paymentQuery = req.app.locals.db
            .from('fct_payment')
            .select('*')
            .eq('application_id', data[i].application_id);

        let paymentData = {}
        await paymentQuery
            .then((data, status) => {
                if (data.data[0] != undefined) {
                    paymentData = data.data[0];
                }
            }).catch((error) => {
                res.status(paymentStatus).json(outputObjectBuilder.prependStatus(paymentStatus, paymentError, null));
            });

        data[i] = {
            application_id: data[i].application_id,
            student: {
                student_id: data[i].student_id,
                first_name: data[i].dim_student.first_name,
                last_name: data[i].dim_student.last_name,
                gender: data[i].dim_student.gender,
                dob: data[i].dim_student.dob,
                address: data[i].dim_student.address,
                city: data[i].dim_student.city,
                postal_code: data[i].dim_student.postal_code,
                phone_no: data[i].dim_student.phone_no,
                email: data[i].dim_student.email,
                credit_balance: data[i].dim_student.credit_balance,
                held_credit: data[i].dim_student.held_credit
            },
            form: {
                form_id: data[i].form_id,
                title: {
                    en: data[i].dim_form.title_en,
                    zh_Hant: data[i].dim_form.title_zh_hant,
                    zh: data[i].dim_form.title_zh
                },
                desc: {
                    en: data[i].dim_form.desc_en,
                    zh_Hant: data[i].dim_form.desc_zh_hant,
                    zh: data[i].dim_form.desc_zh
                },
                start_date: data[i].dim_form.start_date,
                end_date: data[i].dim_form.end_date,
                courses: data[i].dim_form.courses,
                is_kid_form: data[i].dim_form.is_kid_form,
                early_bird: {
                    end_date: data[i].dim_form.early_bird_end_date,
                    discount: data[i].dim_form.early_bird_discount
                },
                ig_discount: data[i].dim_form.ig_discount,
                return_discount: data[i].dim_form.return_discount,
                add_questions: {
                    q1: {
                        en: data[i].dim_form.add_questions_en_1,
                        zh_Hant: data[i].dim_form.add_questions_zh_hant_1,
                        zh: data[i].dim_form.add_questions_zh_1
                    },
                    q2: {
                        en: data[i].dim_form.add_questions_en_2,
                        zh_Hant: data[i].dim_form.add_questions_zh_hant_2,
                        zh: data[i].dim_form.add_questions_zh_2
                    },
                    q3: {
                        en: data[i].dim_form.add_questions_en_3,
                        zh_Hant: data[i].dim_form.add_questions_zh_hant_3,
                        zh: data[i].dim_form.add_questions_zh_3
                    },
                    q4: {
                        en: data[i].dim_form.add_questions_en_4,
                        zh_Hant: data[i].dim_form.add_questions_zh_hant_4,
                        zh: data[i].dim_form.add_questions_zh_4
                    },
                    q5: {
                        en: data[i].dim_form.add_questions_en_5,
                        zh_Hant: data[i].dim_form.add_questions_zh_hant_5,
                        zh: data[i].dim_form.add_questions_zh_5
                    }
                }
            },
            course_ids: data[i].course_ids,
            lang: data[i].lang,
            special: data[i].special,
            parent_name: data[i].parent_name,
            parent_relation: data[i].parent_relation,
            emergency_name: data[i].emergency_name,
            emergency_relation: data[i].emergency_relation,
            emergency_phone_no: data[i].emergency_phone_no,
            self_leave_name: data[i].self_leave_name,
            self_leave_phone_no: data[i].self_leave_phone_no,
            residency_status: data[i].residency_status,
            residency_origin: data[i].residency_origin,
            residency_stay: data[i].residency_stay,
            ig_username: data[i].ig_username,
            add_answers_1: data[i].add_answers_1,
            add_answers_2: data[i].add_answers_2,
            add_answers_3: data[i].add_answers_3,
            add_answers_4: data[i].add_answers_4,
            add_answers_5: data[i].add_answers_5,
            consent_name: data[i].consent_name,
            consent_phone_no: data[i].consent_phone_no,
            remark: data[i].remark,
            submit_time: data[i].submit_time,
            has_early_bird_discount: data[i].has_early_bird_discount,
            has_ig_discount: data[i].has_ig_discount,
            has_return_discount: data[i].has_return_discount,
            used_credit: data[i].used_credit,
            price: data[i].price,
            payment: paymentData
        }
    }

    if (req.params.application_id !== undefined) {
        res.status(status).json(outputObjectBuilder.prependStatus(status, null, { application: data[0] }));
    } else {
        res.status(status).json(outputObjectBuilder.prependStatus(status, null, { applications: data }));
    }
}

// PUT http://localhost:3008/api/v1/application/:application_id
export async function updateApplication(req, res) {
    const authStatus = auth.adminAllow(req);

    if (authStatus !== 200) {
        res.sendStatus(authStatus);
        return;
    }

    const { data, status, error } = await req.app.locals.db
        .from('fct_application')
        .update(req.body)
        .eq('application_id', req.params.application_id)
        .select();

    if (error) {
        res.status(status).json(outputObjectBuilder.prependStatus(status, error, req.body));
        return;
    }

    res.status(status).json(outputObjectBuilder.prependStatus(status, null, { application: data[0] }));
}
