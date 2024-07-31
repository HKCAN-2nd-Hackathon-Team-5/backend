import sql from 'mssql';
import databaseQuery from "../common/DatabaseQuery.js";

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

// POST http://localhost:3008/api/v1/customer
export function create(req, res) {
    if (req.body === undefined) {
        res.status(400).send('Undefined Request Body');
        return;
    }

    for (let i = 0; i < columns.length; i++) {
        if (req.body[columns[i].name] === undefined) {
            res.status(400).send('Invalid Request Body');
            return;
        }
    }

    let query = 'INSERT INTO dim_customer (first_name';

    for (let i = 1; i < columns.length; i++) {
        query += `, ${columns[i].name}`;
    }

    query += ') VALUES (@first_name';

    for (let i = 1; i < columns.length; i++) {
        query += `, @${columns[i].name}`;
    }

    query += ')';
    databaseQuery(query, columns, req, res);
}

// GET http://localhost:3008/api/v1/customer
// GET http://localhost:3008/api/v1/customer/:id
export function read(req, res) {
    let query = 'SELECT * FROM dim_customer';

    if (req.params.id !== undefined) {
        query += ` WHERE id = ${req.params.id}`;
    }

    databaseQuery(query, null, req, res);
}

// PUT http://localhost:3008/api/v1/customer/:id
export function update(req, res) {
    if (req.body === undefined) {
        res.status(400).send('Undefined Request Body');
        return;
    }

    let query = 'UPDATE dim_customer';
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

        params.push(column);
    });

    if (params.length === 0) {
        res.status(400).send('Empty Request Body');
        return;
    }

    query += ` WHERE id = ${req.params.id}`;
    databaseQuery(query, params, req, res);
}

// DELETE http://localhost:3008/api/v1/customer/:id
export function remove(req, res) {
    databaseQuery(`DELETE FROM dim_customer WHERE id = ${req.params.id}`, null, req, res);
}
