var mongoose = require( 'mongoose' );
var crypto = require( 'crypto' );
var jwt = require( 'jsonwebtoken' );

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  screenname: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  fbid: {
	type: Number,
	required: false
  },
  fbname: {
	type: String,
	required: false
  },
  fbemail: {
	type: String,
	required: false
  },
  preferences: {
	  fbGroupIds: [{type: Number, required: false}],
	  fbGroupNames: [{type: String, required: false}],
  }
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password){
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    screenname: this.screenname,
    fbid: this.fbid,
    fbname: this.fbname,
    fbemail: this.fbemail,
    preferences: this.preferences,
    exp: parseInt(expiry.getTime()/1000),
  }, process.env.JWT_SECRET );
};

mongoose.model('User', userSchema);
