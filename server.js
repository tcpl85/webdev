var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public/'));


var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport     = require('passport');


//app.use(session({ secret: process.env.SESSION_SECRET }));
var sessionSecret = 'this is the secret';
if(process.env.SESSION_SECRET)
    sessionSecret = process.env.SESSION_SECRET;

app.use(session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//require ("./test/app.js")(app);
require("./assignment/app.js")(app);


//var ipaddress = process.env.AWS_NODEJS_IP_TEST || '127.0.0.1';
var ipaddress = '127.0.0.1';
var port      = 3000;

if( process.env.AWS_NODEJS_SERVER_PORT)
{
    port = process.env.AWS_NODEJS_SERVER_PORT;
    ipaddress = process.env.AWS_NODEJS_SERVER_IP;
}

//console.log(ipaddress);
//console.log(port);
//console.log(process.env);

app.listen(port, ipaddress);
