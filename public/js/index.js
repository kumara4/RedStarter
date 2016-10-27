var	express	= require('express');
var	firebase	= require('firebase');
var gcloud = require('google-cloud');

var	app	= express();
var	port	=	process.env.port	||	3000;
app.get('/', function (req,	res) {
    res.send('Hello	World!');
});
app.listen(port, function () {
    console.log('Example	app	listening	on	port'	+	port);
});
