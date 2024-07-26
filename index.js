'use strict';


////////////////////////////////
// Config and logger
////////////////////////////////
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

////////////////////////////////////////////////////////
// Route should be customized by application requirement
////////////////////////////////////////////////////////
app.use(bodyParser.json());

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

/*
var personalInfoRoute = require('./routes/personalInfoRoute')(app);
app.use('/api/personalInfoRoute', personalInfoRoute);

var registrationRoute = require('./routes/registrationRoute')(app);
app.use('/api/registrationRoute', registrationRoute);

app.listen(3008, function () {
    console.log('Web server listening on port 3008')
})*/


app.set('port', 3008);
var server = app.listen(app.get('port'), function() {
    console.log('Node Express server listening on port ' + server.address().port);
});

module.exports = app;