// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 8080;
var EmpSalary = require("./models/EmpSalary")
var Employee = require("./models/Employee")
var Address = require("./models/addressSchema")
var cors = require('cors');
var Accounts = require("./models/Accounts")
var Locations = require("./models/Location")
var Project = require("./models/Projects")
var passport = require('passport');
var EmpProjectMap = require("./models/EmpProjectMap")
var ProjectMonthDetails = require("./models/ProjectMonthDetails")
var flash = require('connect-flash');

// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration
var FileStore = require('session-file-store')(session);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser("well I am james bond ;)")); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 3600000, secure: false, httpOnly: true }
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/')(app, passport, Employee, Address, EmpSalary, Project, Accounts, Locations, Project, EmpProjectMap);
app.listen(port);
console.log('The magic happens on port ' + port);
