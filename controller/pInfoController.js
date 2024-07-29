'use strict';

import express from 'express';
var router = express.Router();
import sql from 'mssql';
import poolPromise from '../common/mssqlDb.js';



////////////////////////////////
// Config and logger
////////////////////////////////

//http://localhost:3008/api/pInfo/v1/getPInfo
//http://localhost:3008/api/pInfo/v1/getPInfo?customerId=1
export async function getPInfo(req, res) {
	console.log(JSON.stringify(req.params) + " " + JSON.stringify(req.query) + " " +JSON.stringify(req.body));
	// query
    var query = "SELECT * \
					FROM dim_customer ";
	
	var customerId = req.query.customerId;
	
	if (customerId!==undefined) {
		query += " WHERE customer_id = @customerId";
	}
	
	try {
		const pool = await poolPromise

		let result = "";
		
		if (customerId!==undefined) {
			result = await pool.request()
			 .input('customerId', sql.Int, customerId)
			 .query(query)  
		} else { 
			result = await pool.request()
			 .query(query)
		}     

		res.json(result.recordset)
	} catch (err) {
		res.status(500)
		res.send(err.message)
	}
};

//http://localhost:3008/api/pInfo/v1/createPInfo
export async function createPInfo(req, res) {
	console.log(JSON.stringify(req.params) + " " + JSON.stringify(req.query) + " " +JSON.stringify(req.body));
	// query
    var query = "INSERT INTO \
	 dim_customer(first_name, last_name, gender, dob, address, postal_code, phone_no, email) VALUES \
				 (@firstName, @lastName, @gender, @dob, @address, @postalCode, @phoneNo, @email)";
	
	var body = req.body;
	
	if (body==undefined) {
		res.status(500)
		res.send('Please input customer info');
		return;
	} else if (body.customerId!=null) {
		res.status(500)
		res.send('User created previously');
		return;
	}
	
	
	try {
		const pool = await poolPromise

		let result = await pool.request()
			 .input('firstName', sql.NVarChar(50), body.firstName)
			 .input('lastName', sql.NVarChar(50), body.lastName)
			 .input('gender', sql.NVarChar(50), body.gender)
			 .input('dob', sql.DateTime, body.dob)
			 .input('address', sql.NVarChar(100), body.address)
			 .input('city', sql.NVarChar(50), body.city)
			 .input('postalCode', sql.VarChar(7), body.postalCode)
			 .input('phoneNo', sql.BigInt, body.phoneNo)
			 .input('email', sql.VarChar(100), body.email)
			 .query(query)
		
		console.log(result);
		
		res.json(result)
	} catch (err) {
		res.status(500)
		res.send(err.message)
	}
};

//http://localhost:3008/api/pInfo/v1/updatePInfo
export async function updatePInfo(req, res) {
	console.log(JSON.stringify(req.params) + " " + JSON.stringify(req.query) + " " +JSON.stringify(req.body));
	// query
    var query = "UPDATE dim_customer SET ";
	var body = req.body;
	
	if (body==undefined) {
		res.status(500)
		res.send('Please input customer info');
		return;
	} else if (body.customerId==null) {
		res.status(500)
		res.send('Unknown user');
		return;
	}
	
	try {
		const pool = await poolPromise

		let result = await pool.request();
		let atleastOneUpdate = false;
		
		result = await result.input('customerId', sql.Int, body.customerId);
		
		if (body.firstName!==undefined) {
			if (atleastOneUpdate) {
				query += ",";
			}
			query += "first_name=@firstName ";
			result = await result.input('firstName', sql.NVarChar(50), body.firstName);
			atleastOneUpdate = true;
		}
		
		if (body.lastName!==undefined) {
			if (atleastOneUpdate) {
				query += ",";
			}
			query += "last_name=@lastName ";
			result = await result.input('lastName', sql.NVarChar(50), body.lastName);
			atleastOneUpdate = true;
		}
		
		if (body.gender!==undefined) {
			if (atleastOneUpdate) {
				query += ",";
			}
			query += "gender=@gender ";
			result = await result.input('gender', sql.NVarChar(50), body.gender);
			atleastOneUpdate = true;
		}
		
		if (body.dob!==undefined) {
			if (atleastOneUpdate) {
				query += ",";
			}
			query += "dob=@dob ";
			result = await result.input('dob', sql.DateTime, body.dob);
			atleastOneUpdate = true;
		}
		
		if (body.address!==undefined) {
			if (atleastOneUpdate) {
				query += ",";
			}
			query += "address=@address ";
			result = await result.input('address', sql.NVarChar(100), body.address);
			atleastOneUpdate = true;
		}
		
		if (body.city!==undefined) {
			if (atleastOneUpdate) {
				query += ",";
			}
			query += "city=@city ";
			result = await result.input('city', sql.NVarChar(50), body.city);
			atleastOneUpdate = true;
		}
		
		if (body.postalCode!==undefined) {
			if (atleastOneUpdate) {
				query += ",";
			}
			query += "postal_code=@postalCode ";
			result = await result.input('postalCode', sql.VarChar(7), body.postalCode);
			atleastOneUpdate = true;
		}
		
		if (body.phoneNo!==undefined) {
			if (atleastOneUpdate) {
				query += ",";
			}
			query += "phone_no=@phoneNo ";
			result = await result.input('phoneNo', sql.BigInt, body.phoneNo);
			atleastOneUpdate = true;
		}
		
		if (body.email!==undefined) {
			if (atleastOneUpdate) {
				query += ",";
			}
			query += "email=@email ";
			result = await result.input('email', sql.VarChar(100), body.email);
			atleastOneUpdate = true;
		}
		
		query += "WHERE customer_id=@customerId ";
		
		result = await result.query(query);
		
		console.log(result);
		
		res.json(result)
	} catch (err) {
		res.status(500)
		res.send(err.message)
	}
};

//http://localhost:3008/api/pInfo/v1/postPInfo
export function postPInfo(req, res) {
	console.log(req.body);
	
};