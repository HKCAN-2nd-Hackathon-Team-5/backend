import sql from 'mssql';
import databaseQuery from "../utility/DatabaseQuery.js";
import * as auth from '../utility/AuthFunc.js';


// GET http://localhost:3008/api/v1/course/:id
export function getAllCourseByFormId(req, res) {
	let status = auth.allAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.params.id == undefined) {
			res.sendStatus(500);
		}
		
		let result = {};
		let query1 = `select * from dim_form f 
						inner join dim_form_course fc on (f.form_id=fc.form_id)
						inner join dim_course c on (c.course_id=fc.course_id) 
						WHERE f.form_id = ${req.params.id}`;
		
		databaseQuery(req.app.locals.db, query1, null, (error, data) => {
			if (error) {
				console.error(error);
				res.sendStatus(500);
				return;
			} else{
				result=data.recordset;
				console.log(result);
			}
			
		res.status(200).send(result);
			
		});/*.then(
			databaseQuery(req.app.locals.db, query, null, (error, data) => {
			if (error) {
				console.error(error);
				res.sendStatus(500);
				return;
			}

			data.recordset.
			
			
		})).catch((error) => {
			// Do something if error 
			console.log("Catch error");
		});*/	
    }
}

/*const columns = [
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

    const params = [];

    for (let i = 0; i < columns.length; i++) {
        if (req.body[columns[i].name] === undefined) {
            res.status(400).send('Invalid Request Body');
            return;
        }

        params.push({ name: columns[i].name, type: columns[i].type, value: req.body[columns[i].name] });
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

    databaseQuery(req.app.locals.db, query, params, (error, data) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
        }

        res.status(201).send(data);
    });
}

// GET http://localhost:3008/api/v1/customer
// GET http://localhost:3008/api/v1/customer/:id
export function read(req, res) {
    let query = 'SELECT * FROM dim_customer';

    if (req.params.id !== undefined) {
        query += ` WHERE id = ${req.params.id}`;
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

// GET http://localhost:3008/api/v1/customer/query
export function readBySearch(req, res) {
    let query = 'SELECT * FROM dim_customer WHERE ';
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

        params.push({ name: column.name, type: column.type, value: req.body[column.name] });
    });

    if (params.length === 0) {
        res.status(400).send('Empty Request Body');
        return;
    }

    query += ` WHERE id = ${req.params.id}`;
    databaseQuery(req.app.locals.db, query, params, (error, data) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
        }

        res.status(200).send(data);
    });
}

// DELETE http://localhost:3008/api/v1/customer/:id
export function remove(req, res) {
    databaseQuery(req.app.locals.db, `DELETE FROM dim_customer WHERE id = ${req.params.id}`, null, (error, data) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
        }

        res.status(200).send(data);
    });
}
*/