'use strict';


////////////////////////////////
// Config and logger
////////////////////////////////
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require('mssql');

// Connect to SQL Server
var config = {
    user: 'cicsadmin',
    password: 'cicsadmin',
    server: 'localhost',
    database: 'cics_database',
    options: {
        trustServerCertificate: true
    }
}
sql.connect(config, err => {
    if (err) {
        throw err;
    }

    console.log("Connected to SQL Server");
});

////////////////////////////////////////////////////////
// Route should be customized by application requirement
////////////////////////////////////////////////////////
app.use(bodyParser.json());

app.get('/testSql', (_, res) => {
    new sql.Request().query("SELECT * FROM dim_customer", (err, result) => {
        if (err) {
            console.error(err);
        } else {
            res.send(result.recordset);
        }
    });
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