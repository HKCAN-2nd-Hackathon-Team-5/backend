import databaseQuery from "../common/DatabaseQuery.js";

const columnName = ['first_name', 'last_name', 'gender', 'dob', 'address', 'postal_code', 'phone_no', 'email'];

// POST http://localhost:3008/api/v1/customer
export function create(req, res) {
    if (req.body === undefined) {
        res.status(400).send('Undefined post body.');
        return;
    }

    for (let i = 0; i < columnName.length; i++) {
        if (req.body[columnName[i]] === undefined) {
            res.status(400).send('Invalid post body.');
            return;
        }
    }

    let query = 'INSERT INTO dim_customer (first_name';

    for (let i = 1; i < columnName; i++) {
        query += `, ${columnName[i]}`;
    }

    query += `) VALUES (${req.body.first_name}`;

    for (let i = 1; i < columnName; i++) {
        query += `, ${req.body[columnName[i]]}`;
    }

    query += ')';
    databaseQuery(query, req, res, 'create');
}

// GET http://localhost:3008/api/v1/customer
// GET http://localhost:3008/api/v1/customer/:id
export function read(req, res) {
    let query = 'SELECT * FROM dim_customer';

    if (req.params.id !== undefined) {
        query += ` WHERE id = ${req.params.id}`;
    }

    databaseQuery(query, req, res, 'read');
}

// PUT http://localhost:3008/api/v1/customer/:id
export function update(req, res) {
    let query = 'UPDATE dim_customer';
    let hasUpdate = false;

    columnName.forEach(column => {
        if (req.body[column] === undefined) {
            return;
        }

        if (!hasUpdate) {
            query += ` SET ${column} = `;
            hasUpdate = true;
        } else {
            query += `, ${column} = `;
        }

        query += column === 'dob' ? `DATE '${req.body.dob}'` : req.body[column];
    });

    if (!hasUpdate) {
        return;
    }

    query += ` WHERE id = ${req.params.id}`;
    databaseQuery(query, req, res, 'update');
}

// DELETE http://localhost:3008/api/v1/customer/:id
export function remove(req, res) {
    databaseQuery(`DELETE FROM dim_customer WHERE id = ${req.params.id}`, req, res, 'delete');
}
