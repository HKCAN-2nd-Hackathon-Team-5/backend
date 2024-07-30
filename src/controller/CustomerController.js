import databaseQuery from "../common/DatabaseQuery.js";

const columnName = [ 'first_name', 'last_name', 'gender', 'dob', 'address', 'postal_code', 'phone_no', 'email' ];
export const paramName = [ 'firstName', 'lastName', 'gender', 'dob', 'address', 'postalCode', 'phoneNo', 'email' ];

// POST http://localhost:3008/api/v1/customer/:firstName/:lastName/:gender/:dob/:address/:postalCode/:phoneNo/:email
export function create(req, res) {
    let query = 'INSERT INTO dim_customer (first_name';
    
    for (let i = 1; i < columnName; i++) {
        query += `, ${columnName[i]}`;
    }
    
    query += `) VALUES (${req.params.firstName}`;

    for (let i = 1; i < paramName; i++) {
        query += `, ${req.params[paramName[i]]}`;
    }
    
    query += ')';
    databaseQuery(query, req, res);
}

// GET http://localhost:3008/api/v1/customer
// GET http://localhost:3008/api/v1/customer/:id
export function read(req, res) {
    let query = 'SELECT * FROM dim_customer';
    
    if (req.params.id !== undefined) {
        query += ` WHERE id = ${req.params.id}`;
    }
    
    databaseQuery(query, req, res);
}

// PUT http://localhost:3008/api/v1/customer/:id/data?
export async function update(req, res) {
    let query = 'UPDATE dim_customer';
    let hasUpdate = false;
    
    paramName.forEach((param, index) => {
        if (req.query[param] === undefined) {
            return;
        }

        if (!hasUpdate) {
            query += ` SET ${columnName[index]} = ${req.query[param]}`;
            hasUpdate = true;
        } else {
            query += `, ${columnName[index]} = ${req.query[param]}`;
        }
    });
    
    if (!hasUpdate) {
        return;
    }
    
    query += ` WHERE id = ${req.params.id}`;
    databaseQuery(query, req, res);
}

// DELETE http://localhost:3008/api/v1/customer/:id
export function remove(req, res) {
    databaseQuery(`DELETE FROM dim_customer WHERE id = ${req.params.id}`, req, res);
}
