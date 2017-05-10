require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uglifyJs = require('uglify-js');
var fs = require('fs');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);
/*var gracenote = require('node-gracenote');
var clientID = "";
var cleintTag = "";
var userId = "";
var api = new Gracenote(clientId,clientTag,userId);
api.register(function(err, uid) {
    if(err){
      console.log(err);
    }else{
      console.log("UID: "+uid)
    }
});
*/

require('./app_api/models/db');
require('./app_api/config/passport');

var routesAPI = require('./app_api/routes/index');
//var users = require('./routes/users');

var app = express();

//session setup
if (app.get('env') === 'development') {
	app.use(session({
		secret: 'superdupers3cre7',
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({
			url: 'mongodb://localhost/mySite'
		})
	}))
}else{
	app.use(session({
		secret: 'superdupers3cre7',
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({
			url: process.env.MONGOLAB_URI
		})
	}))
}
app.listen(8090);
// view engine setup
app.set('view engine', 'jade');

//uglify
var angularFiles = [
  //'public/javascripts/bootstrap-switch.js',
  'public/javascripts/angular-toggle-switch.js',
  'public/javascripts/angular-fullscreen.js',
  'home/common/services/service.bowser.js',
  'home/app.js',
  'home/common/services/service.videoManip.js',
  'home/common/services/service.detectBrowser.js',
  'home/common/services/service.mySiteData.js',
  'home/common/services/service.authentication.js',
  'home/home/home.controller.js',
  'home/auth/login/login.controller.js',
  'home/auth/register/register.controller.js',
  'home/common/directives/pageHeader/pageHeader.directive.js',
  'apps/issue_tracking/controllers/home.js',
  'apps/issue_tracking/app.js',
  'apps/issue_tracking/directives/navbar.directive.js',
];
var uglified = uglifyJs.minify(angularFiles, { compress : false });
fs.writeFile('home/lib/mySite.min.js', uglified.code, function (err){
  if(err) {
    console.log(err);
  } else {
    console.log('Script generated and saved: mySite.min.js');
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'home')));
app.use(express.static(path.join(__dirname, 'apps')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use('/api', routesAPI);
app.use(function(req, res) {
  //if(req.path.includes("issue")){
  if(req.path.search("/issue/")){
    res.sendFile(path.join(__dirname, 'apps', 'issue_tracking', 'index.html'));
  }else{
    res.sendFile(path.join(__dirname, 'home', 'index.html'));
  }
});
app.use(passport.initialize());

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
