'use strict';

var express = require('express');
var router = express.Router();
var sql = require('mssql');
const { poolPromise } = require('../common/mssqlDb.js')



////////////////////////////////
// Config and logger
////////////////////////////////

//http://localhost:3008/api/pInfo/v1/getPInfo
//http://localhost:3008/api/pInfo/v1/getPInfo?customer_id=1
module.exports.getPInfo = async function(req, res) {
	console.log(JSON.stringify(req.params) + " " + JSON.stringify(req.query) + " " +JSON.stringify(req.body));
	// query
    var query = "SELECT * \
					FROM dim_customer ";
	
	var customerId = req.query.customer_id;
	
	if (customerId!==undefined) {
		query += " WHERE customer_id = @customer_id";
	}
	
	try {
		const pool = await poolPromise

		let result = "";
		
		if (customerId!==undefined) {
			result = await pool.request()
			 .input('customer_id', sql.Int, customerId)
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

//http://localhost:3008/api/pInfo/v1/postPInfo
module.exports.postPInfo = function(req, res) {
	console.log(req.body);
	
};