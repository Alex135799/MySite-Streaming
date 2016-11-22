var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {
  if(!req.body.screenname || !req.body.username || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, { "message": "All fields required" });
    return;
  }
  var user = new User();
  user.username = req.body.username;
  user.screenname = req.body.screenname;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save(function(err) {
    var token;
    if(err) {
      sendJSONresponse(res, 404, err);
    } else {
      token = user.generateJwt();
      sendJSONresponse(res, 200, { "token": token });
    }
  });
};

module.exports.login = function(req, res) {
  if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, { "message": "All fields required" });
    return;
  }
  passport.authenticate('local', function(err, user, info){
    var token;
    if (err) {
      sendJSONresponse(res, 404, err);
      return;
    }
    if (user) {
      token = user.generateJwt();
      sendJSONresponse(res, 200, { "token": token });
    } else {
      sendJSONresponse(res, 401, info);
    }
  })(req, res);
};

module.exports.addfb = function(req, res) {
	if(!req.body.id) {
		sendJSONresponse(res, 400, { "message": "id required" });
		return;
	}else if (!req.body.name){
		sendJSONresponse(res, 400, { "message": "name required" });
		return;
	}else if (!req.body.fbemail){
		sendJSONresponse(res, 400, { "message": "fbemail required" });
		return;
	}else if (!req.body.email){
		sendJSONresponse(res, 400, { "message": "email required" });
		return;
	}
	User.findOne({ email: req.body.email }, function(err, user) {
		var token;
		if (err) {
			sendJSONresponse(res, 404, err);
			return;
		}
		if (user) {
			user.fbid = req.body.id;
			user.fbname = req.body.name;
			user.fbemail = req.body.fbemail;
			//console.log("Saving: "+JSON.stringify(user));
			user.save(function(err) {
				var token;
				if(err) {
					sendJSONresponse(res, 404, err);
				} else {
					token = user.generateJwt();
					sendJSONresponse(res, 200, { "token": token });
				}
			});
		} else {
			sendJSONresponse(res, 401, info);
		}
	})(req, res);
};

module.exports.updatePreferences = function(req, res) {
	if(!req.body.preferences) {
		sendJSONresponse(res, 400, { "message": "preferences required" });
		return;
	}else if (!req.body.email){
		sendJSONresponse(res, 400, { "message": "email required" });
		return;
	}
	User.findOne({ email: req.body.email }, function(err, user) {
		var token;
		if (err) {
			sendJSONresponse(res, 404, err);
			return;
		}
		if (user) {
			user.preferences = req.body.preferences;
			//console.log("Saving: "+JSON.stringify(user));
			user.save(function(err) {
				var token;
				if(err) {
					sendJSONresponse(res, 404, err);
				} else {
					token = user.generateJwt();
					sendJSONresponse(res, 200, { "token": token });
				}
			});
		} else {
			sendJSONresponse(res, 401, info);
		}
	})(req, res);
};
