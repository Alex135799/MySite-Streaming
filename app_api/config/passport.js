var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  function(email, password, done) {
    if(email.indexOf("@") > -1){
      User.findOne({ email: email }, function(err, user) {
        if(err) { return done(err); }
        if(!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        if(!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }else{
      User.findOne({ username: email }, function(err, user) {
        if(err) { return done(err); }
        if(!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if(!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  }
));


