import * as outputObjectBuilder from '../utility/OutputObjectBuilder.js';
import * as auth from '../utility/AuthFunc.js';

// POST http://localhost:3008/api/v1/student
export async function createStudent(req, res) {
    const authStatus = auth.adminAllow(req);

    if (authStatus !== 200) {
        res.sendStatus(authStatus);
        return;
    }

    const { data, status, error } = await req.app.locals.db
        .from('dim_student')
        .insert(req.body)
        .select('student_id, credit_balance');

    if (error) {
        res.status(status).json(outputObjectBuilder.prependStatus(status, error, req.body));
        return;
    }

    const student = { student_id: data[0].student_id };
    Object.assign(student, req.body);
    student.credit_balance = data[0].credit_balance;
    res.status(status).json(outputObjectBuilder.prependStatus(status, null, { student: student }));
}

// GET http://localhost:3008/api/v1/student
// GET http://localhost:3008/api/v1/student/:student_id
export async function readStudents(req, res) {
    const authStatus = auth.adminAllow(req);

    if (authStatus !== 200) {
        res.sendStatus(authStatus);
        return;
    }

    if (req.params.student_id === undefined) {
        const { data, status, error } = await req.app.locals.db
            .from('dim_student')
            .select();

        if (error) {
            res.status(status).json(outputObjectBuilder.prependStatus(status, error, null));
            return;
        }

        res.status(status).json(outputObjectBuilder.prependStatus(status, null, { students: data }));
        return;
    }

    const { data, status, error } = await req.app.locals.db
        .from('dim_student')
        .select()
        .eq('student_id', req.params.student_id);

    if (error) {
        res.status(status).json(outputObjectBuilder.prependStatus(status, error, null));
        return;
    }

    if (data.length === 0) {
        res.status(404).json(outputObjectBuilder.prependStatus(
            404,
            `Student with id ${req.params.student_id} not found`,
            null
        ));
        return;
    }

    res.status(status).json(outputObjectBuilder.prependStatus(status, null, { student: data[0] }));
}

// GET http://localhost:3008/api/v1/student/query
export async function readStudentsBySearch(req, res) {
    const authStatus = auth.adminAllow(req);

    if (authStatus !== 200) {
        res.sendStatus(authStatus);
        return;
    }

    const fields = ['first_name', 'last_name', 'gender', 'address', 'city', 'postal_code', 'email'];
    let query = req.app.locals.db.from('dim_student').select();

    fields.forEach(field => {
        if (req.query[field] === undefined) {
            return;
        }

        query = query.ilike(field, `%${req.query[field]}%`);
    });

    const { data, status, error } = await query;

    if (error) {
        res.status(status).json(outputObjectBuilder.prependStatus(status, error, null));
        return;
    }

    res.status(status).json(outputObjectBuilder.prependStatus(status, null, { students: data }));
}

// GET http://localhost:3008/api/v1/student/:student_id/application
export async function readApplicationsByStudentId(req, res) {
    const authStatus = auth.adminAllow(req);

    if (authStatus !== 200) {
        res.sendStatus(authStatus);
        return;
    }

    const { data, status, error } = await req.app.locals.db
        .from('fct_application')
        .select()
        .eq('student_id', req.params.student_id);

    if (error) {
        res.status(status).json(outputObjectBuilder.prependStatus(status, error, null));
        return;
    }

    res.status(status).json(outputObjectBuilder.prependStatus(status, null, { applications: data }));
}

// PUT http://localhost:3008/api/v1/student/:student_id
export async function updateStudent(req, res) {
    const authStatus = auth.adminAllow(req);

    if (authStatus !== 200) {
        res.sendStatus(authStatus);
        return;
    }

    const { data, status, error } = await req.app.locals.db
        .from('dim_student')
        .update(req.body)
        .eq('student_id', req.params.student_id)
        .select();

    if (error) {
        res.status(status).json(outputObjectBuilder.prependStatus(status, error, req.body));
        return;
    }

    res.status(status).json(outputObjectBuilder.prependStatus(status, null, { student: data[0] }));
}

// DELETE http://localhost:3008/api/v1/student/:student_id
export async function deleteStudent(req, res) {
    const authStatus = auth.adminAllow(req);

    if (authStatus !== 200) {
        res.sendStatus(authStatus);
        return;
    }

    const { status, error } = await req.app.locals.db
        .from('dim_student')
        .delete()
        .eq('student_id', req.params.student_id);

    if (error) {
        res.status(status).json(outputObjectBuilder.prependStatus(status, error, null));
        return;
    }

    res.status(status).json(outputObjectBuilder.prependStatus(
        status,
        null,
        { student: { student_id: req.params.student_id } }
    ));
}
