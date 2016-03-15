require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uglifyJs = require('uglify-js');
var fs = require('fs');

/*require.config({
  paths: {
    "BigVideo": "bower_components/BigVideo.js/lib/bigvideo",
    "jquery": "bower_components/jquery/jquery",
    "jquery-ui": "bower_components/jquery-ui/ui/jquery-ui",
    "videojs": "bower_components/video.js/video",
    "imagesloaded": "bower_components/imagesloaded/imagesloaded",
    "eventEmitter/EventEmitter": "bower_components/eventEmitter/EventEmitter",
    "eventie/eventie": "bower_components/eventie/eventie"
  },
  shim: {
    "videojs": {exports: 'videojs'}
  }
});*/


//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

//uglify
var appClientFiles = [
  'app_client/app.js',
  'app_client/home/home.controller.js',
  'app_client/common/directives/pageHeader/pageHeader.directive.js'
];
var uglified = uglifyJs.minify(appClientFiles, { compress : false });
fs.writeFile('app_client/lib/mySite.min.js', uglified.code, function (err){
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
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});

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
