'use strict';


////////////////////////////////
// Config and logger
////////////////////////////////
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require('mssql');
const { poolPromise } = require('./common/mssqlDb.js')

////////////////////////////////////////////////////////
// Route should be customized by application requirement
////////////////////////////////////////////////////////
app.use(bodyParser.json());

app.get('/testSql', async (req, res) => {
	var query = "SELECT * \
						FROM dim_customer";
						
	try {
		const pool = await poolPromise
		const result = await pool.request()
		    .input('customer_id', sql.Int, req.params.customerId)
			.query(query)      

		res.json(result.recordset)
	} catch (err) {
		res.status(500)
		res.send(err.message)
	}
});

app.get('/testGetString',function(req, res){
    //logger.info('============= sample test api call ================');
	console.log("testGetString api call");
    res.send('============= sample test api call ================');
});

app.get('/testGetJson',function(req, res){
	console.log("testGetJson api call");
	var result = 'testing result';
	res.json({ 'result': result });
});

app.post('/testPostJson',function(req, res){
	const response = req.body.test;	//JSON.stringify(req.body);
	console.log("testPostJson api call with param test: " + response);
	var result = 'testing result' + response;
	res.json({ 'result': result });
});

//Routing for personal information
var personalInfoRoute = require('./routes/personalInfoRoute')(app);
app.use('/api/pInfo', personalInfoRoute);

//Routing for registration
var registrationRoute = require('./routes/registrationRoute')(app);
app.use('/api/registration', registrationRoute);


app.set('port', 3008);
var server = app.listen(app.get('port'), function() {
    console.log('Node Express server listening on port ' + server.address().port);
});

module.exports = app;