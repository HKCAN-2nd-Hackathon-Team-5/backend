import sql from 'mssql';
import databaseQuery from "../utility/DatabaseQuery.js";

const columns = [
    { name: 'first_name', type: sql.NVarChar(50) },
    { name: 'last_name', type: sql.NVarChar(50) },
    { name: 'gender', type: sql.NVarChar(50) },
    { name: 'dob', type: sql.DateTime },
    { name: 'address', type: sql.NVarChar(100) },
    { name: 'city', type: sql.NVarChar(50) },
    { name: 'postal_code', type: sql.Char(6) },
    { name: 'phone_no', type: sql.BigInt },
    { name: 'email', type: sql.VarChar(100) }
]

// POST http://localhost:3008/api/v1/student
export function create(req, res) {
    if (req.body === undefined) {
        res.status(400).send('Undefined Request Body');
        return;
    }

    const params = [];

    for (let i = 0; i < columns.length; i++) {
        if (req.body[columns[i].name] === undefined) {
            res.status(400).send('Invalid Request Body');
            return;
        }

        params.push({ name: columns[i].name, type: columns[i].type, value: req.body[columns[i].name] });
    }

    let query = 'INSERT INTO dim_student (first_name';

    for (let i = 1; i < columns.length; i++) {
        query += `, ${columns[i].name}`;
    }

    query += ') OUTPUT Inserted.student_id VALUES (@first_name';

    for (let i = 1; i < columns.length; i++) {
        query += `, @${columns[i].name}`;
    }

    query += ')';

    databaseQuery(req.app.locals.db, query, params, (error, data) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
        }

        res.status(201).send(data);
    });
}

// GET http://localhost:3008/api/v1/student
// GET http://localhost:3008/api/v1/student/:student_id
export function read(req, res) {
    let query = 'SELECT * FROM dim_student';

    if (req.params.student_id !== undefined) {
        query += ` WHERE student_id = ${req.params.student_id}`;
    }

    databaseQuery(req.app.locals.db, query, null, (error, data) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
        }

        res.status(200).send(data.recordset);
    });
}

// GET http://localhost:3008/api/v1/student/query
export function readBySearch(req, res) {
    let query = 'SELECT * FROM dim_student WHERE ';
    const params = [];

    columns.forEach(column => {
        if (req.query[column.name] === undefined || column.type === sql.DateTime || column.type === sql.BigInt) {
            return;
        }

        if (params.length > 0) {
            query += ' AND ';
        }

        query += `${column.name} LIKE @${column.name}`;
        params.push({ name: column.name, type: column.type, value: '%' + req.query[column.name] + '%' });
    })

    if (params.length === 0) {
        res.status(400).send('Empty Request Query');
        return;
    }

    databaseQuery(req.app.locals.db, query, params, (error, data) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
        }

        res.status(200).send(data.recordset);
    });
}

// PUT http://localhost:3008/api/v1/student/:student_id
export function update(req, res) {
    if (req.body === undefined) {
        res.status(400).send('Undefined Request Body');
        return;
    }

    let query = 'UPDATE dim_student';
    const params = [];

    columns.forEach(column => {
        if (req.body[column.name] === undefined) {
            return;
        }

        if (params.length === 0) {
            query += ` SET ${column.name} = @${column.name}`;
        } else {
            query += `, ${column.name} = @${column.name}`;
        }

        params.push({ name: column.name, type: column.type, value: req.body[column.name] });
    });

    if (params.length === 0) {
        res.status(400).send('Empty Request Body');
        return;
    }

    query += ` WHERE student_id = ${req.params.student_id}`;
    databaseQuery(req.app.locals.db, query, params, (error, data) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
        }

        res.status(200).send(data);
    });
}

// DELETE http://localhost:3008/api/v1/student/:student_id
export function remove(req, res) {
    databaseQuery(
        req.app.locals.db,
        `DELETE FROM dim_student WHERE student_id = ${req.params.student_id}`,
        null,
        (error, data) => {
            if (error) {
                console.error(error);
                res.sendStatus(500);
                return;
            }

            res.status(200).send(data);
        }
    );
}
