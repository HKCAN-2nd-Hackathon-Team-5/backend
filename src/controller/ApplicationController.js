import constructOutputObject from '../utility/ConstructOutputObject.js';

// POST http://localhost:3008/api/v1/application
export async function create(req, res) {
    try {
        req.body.application.submit_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

        let { data, status, error } = await req.app.locals.db
            .from('dim_form')
            .select('start_date, end_date, early_bird_end_date, early_bird_discount, ig_discount')
            .eq('form_id', req.body.application.form_id);

        if (error) {
            res.status(status).json(constructOutputObject(status, error, req.body));
            return;
        }

        if (data.length === 0) {
            res.status(404).json(constructOutputObject(
                404,
                `Form with id ${req.body.application.form_id} not found`,
                req.body
            ));
            return;
        }

        let currentDate = Date.parse(req.body.application.submit_time.slice(0, 10));

        if (currentDate < Date.parse(data[0].start_date) || currentDate > Date.parse(data[0].end_date)) {
            res.status(400).json(constructOutputObject(
                400,
                `Form with id ${req.body.application.form_id} not opening`,
                req.body
            ));
            return;
        }

        req.body.application.has_early_bird_discount = currentDate <= Date.parse(data[0].early_bird_end_date);
        req.body.application.has_ig_discount = !!req.body.application.ig_username;
        const earlyBirdDiscount = data[0].early_bird_discount;
        const igDiscount = data[0].ig_discount;

        if (req.body.application.course_ids.length === 0) {
            res.status(400).json(constructOutputObject(400, `Empty course_ids`, req.body));
            return;
        }

        ({ data, status, error } = await req.app.locals.db
            .from('dim_course')
            .select('course_id, price, age_min, age_max')
            .in('course_id', req.body.application.course_ids));

        if (error) {
            res.status(status).json(constructOutputObject(status, error, req.body));
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
            res.status(400).json(constructOutputObject(400, error, req.body));
            return;
        }

        ({ data, status, error } = await req.app.locals.db
            .from('dim_student')
            .select('student_id, credit_balance')
            .eq('first_name', req.body.student.first_name)
            .eq('last_name', req.body.student.last_name)
            .eq('dob', req.body.student.dob));

        if (error) {
            res.status(status).json(constructOutputObject(status, error, req.body));
            return;
        }

        const student = {};
        const is_student_exist = data.length > 0;

        if (is_student_exist) {
            student.student_id = data[0].student_id;
            Object.assign(student, req.body.student);
            student.credit_balance = data[0].credit_balance;
            const { first_name, last_name, dob, ...studentData } = req.body.student;

            ({ data, status, error } = await req.app.locals.db
                .from('dim_student')
                .update(studentData)
                .eq('student_id', student.student_id));

            if (error) {
                res.status(status).json(constructOutputObject(status, error, req.body));
                return;
            }
        } else {
            ({ data, status, error } = await req.app.locals.db
                .from('dim_student')
                .insert(req.body.student)
                .select('student_id, credit_balance'));

            if (error) {
                res.status(status).json(constructOutputObject(status, error, req.body));
                return;
            }

            student.student_id = data[0].student_id;
            Object.assign(student, req.body.student);
            student.credit_balance = data[0].credit_balance;
        }

        const { course_ids, ...applicationData } = req.body.application;
        applicationData.student_id = student.student_id;

        if (applicationData.has_early_bird_discount) {
            totalPrice -= earlyBirdDiscount;
        }

        if (applicationData.has_ig_discount) {
            totalPrice -= igDiscount;
        }

        totalPrice = Math.max(totalPrice, 0);

        if (totalPrice > student.credit_balance) {
            applicationData.used_credit = student.credit_balance;
            applicationData.price = totalPrice - student.credit_balance;
        } else {
            applicationData.used_credit = totalPrice;
            applicationData.price = 0;
        }

        ({ data, status, error } = await req.app.locals.db
            .from('fct_application')
            .insert(applicationData)
            .select('application_id'));

        if (error) {
            if (!is_student_exist) {
                await req.app.locals.db
                    .from('dim_student')
                    .delete()
                    .eq('student_id', student.student_id);
            }

            res.status(status).json(constructOutputObject(status, error, req.body));
            return;
        }

        const application = { application_id: data[0].application_id, student_id: student.student_id };
        Object.assign(application, req.body.application);
        application.used_credit = applicationData.used_credit;
        application.price = applicationData.price;
        req.body.student = student;
        req.body.application = application;
        res.status(201).json(constructOutputObject(201, null, req.body));
    } catch (error) {
        res.status(400).json(constructOutputObject(400, error.message, req.body));
    }
}

// GET http://localhost:3008/api/v1/application
export function read(req, res) {
    res.status(200).json({ message: 'Applications read successfully.' });
}

// PUT http://localhost:3008/api/v1/application
export function update(req, res) {
    res.status(200).json({ message: 'Application updated successfully.' });
}

// DELETE http://localhost:3008/api/v1/application
export function remove(req, res) {
    res.status(200).json({ message: 'Application deleted successfully.' });
}
