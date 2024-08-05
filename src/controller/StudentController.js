import constructOutputObject from '../utility/ConstructOutputObject.js';

// GET http://localhost:3008/api/v1/student
// GET http://localhost:3008/api/v1/student/:student_id
export async function read(req, res) {
    if (req.params.student_id === undefined) {
        const { data, status, error } = await req.app.locals.db
            .from('dim_student')
            .select();

        if (error) {
            res.status(status).json(constructOutputObject(status, error, null));
            return;
        }

        res.status(status).json(constructOutputObject(status, null, { students: data }));
        return;
    }

    const { data, status, error } = await req.app.locals.db
        .from('dim_student')
        .select()
        .eq('student_id', req.params.student_id);

    if (error) {
        res.status(status).json(constructOutputObject(status, error, null));
        return;
    }

    if (data.length === 0) {
        res.status(404).json(constructOutputObject(status, `Student with id ${req.params.student_id} not found`, null));
        return;
    }

    res.status(status).json(constructOutputObject(status, null, { student: data[0] }));
}

// GET http://localhost:3008/api/v1/student/query
export async function readBySearch(req, res) {
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
        res.status(status).json(constructOutputObject(status, error, null));
        return;
    }

    res.status(status).json(constructOutputObject(status, null, { students: data }));
}

// PUT http://localhost:3008/api/v1/student/:student_id
export async function update(req, res) {
    const { data, status, error } = await req.app.locals.db
        .from('dim_student')
        .update(req.body)
        .eq('student_id', req.params.student_id)
        .select();

    if (error) {
        res.status(status).json(constructOutputObject(status, error, null));
        return;
    }

    res.status(status).json(constructOutputObject(status, null, { student: data[0] }));
}

// DELETE http://localhost:3008/api/v1/student/:student_id
export async function remove(req, res) {
    const { status, error } = await req.app.locals.db
        .from('dim_student')
        .delete()
        .eq('student_id', req.params.student_id);

    if (error) {
        res.status(status).json(constructOutputObject(status, error, null));
        return;
    }

    res.status(status).json(constructOutputObject(status, null, { student: { student_id: req.params.student_id } }));
}
