'use strict';

var express = require('express');
var router = express.Router();
var sql = require('mssql');
const { poolPromise } = require('../common/mssqlDb.js')



////////////////////////////////
// Config and logger
////////////////////////////////

//http://localhost:3008/api/pInfo/v1/getPInfo
//http://localhost:3008/api/pInfo/v1/getPInfo?customerId=1
module.exports.getPInfo = async function(req, res) {
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
module.exports.createPInfo = async function(req, res) {
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

//http://localhost:3008/api/pInfo/v1/postPInfo
module.exports.postPInfo = function(req, res) {
	console.log(req.body);
	
};