'use strict';

var express = require('express')
////////////////////////////////
// Config and logger
////////////////////////////////

////////////////////////////////////////////////////////
// Route should be customized by application requirement
////////////////////////////////////////////////////////

var app = express();

app.get('/test',function(req, res){
    //logger.info('============= sample test api call ================');
	console.log("sample test api call");
    res.send('============= sample test api call ================');
});

app.get('/db',function(req, res){
	var result = 'testing result';
	res.json({ 'result': result });
});

var personalInfoRoute = require('./routes/personalInfoRoute')(app);
app.use('/api/personalInfoRoute', personalInfoRoute);

var registrationRoute = require('./routes/registrationRoute')(app);
app.use('/api/registrationRoute', registrationRoute);


/*app.listen(3008, function () {
    console.log('Web server listening on port 3008')
})*/


app.set('port', 3008);
var server = app.listen(app.get('port'), function() {
    logger.info('Node Express server listening on port ' + server.address().port);
});
module.exports = app;