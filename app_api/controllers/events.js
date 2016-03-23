var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var getUser = function(req, res, callback) {
  if (req.payload && req.payload._id) {
    User
      .findOne({ _id: req.payload._id })
      .exec(function(err, user){
        if(!user) {
          sendJSONresponse(res, 404, { "message": "User not found" });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return
        }
        callback(req, res, user._id, user.screenname);
      });
  } else {
    sendJSONresponse(res, 404, { "message": "User not found" });
    return;
  }
};

var getListOfEvents = function(req, res, search) {
  searchParam = search ? {author: req.params.author} : {};
  return function(req, res){
    Event.find(searchParam, function(err, results, stats) {
      if(err){
        sendJSONresponse(res, 404, err);
      }
      var events = buildEventList(req, res, results);
      console.log("sending events: "+JSON.stringify(events));
      sendJSONresponse(res, 200, events);
    });
  };
};

var buildEventList = function(req, res, results) {
  var events = [];
  results.forEach(function(doc) {
    var allDay = doc.allDay ? true : false;
    var end = doc.end ? doc.end : false;
    var url = doc.url ? doc.url : false;
    var color = doc.color ? doc.color : false;
    var media = doc.media ? doc.media : false;
    var event = {
      _id: doc._id,
      title: doc.title,
      description: doc.description,
      user_id: doc.user_id,
      user_name: doc.user_name,
      allDay: allDay,
      start: doc.start,
      end: end,
      url: url,
      color: color,
      media: media
    };
    if (!end) {delete event.end}
    if (!url) {delete event.url}
    if (!color) {delete event.color}
    if (!media) {delete event.media}
    events.push(event);
  });
  return events;
};


/* GET list of Events */
module.exports.eventsList = getListOfEvents(false);
module.exports.eventsListByAuth = getListOfEvents("author");

/* GET a event by the id */
module.exports.eventsReadOne = function(req, res) {
  //console.log('---------------------------'+req.params.eventid);
  Event.findById(req.params.eventid, function(err, result) {
    if(err) {sendJSONresponse(res, 404, err);}
    if(result.length === 0) {result = {body: "No such event", title: "Not Found"}}
    console.log("sending event: "+JSON.stringify(result));
    sendJSONresponse(res, 200, result);
  });
};

/* POST a new event */
module.exports.eventsCreate = function(req, res) {
  getAuthor(req, res, function(req, res, userid, username) {
    var allDay = req.body.allDay ? true : false;
    var end = req.body.end ? req.body.end : false;
    var url = req.body.url ? req.body.url : false;
    var color = req.body.color ? req.body.color : false;
    var media = req.body.media ? req.body.media : false;
    var event = {
      title : req.body.title,
      description : req.body.description,
      allDay : allDay,
      author_id : userid,
      author_name : username,
      auth_users : [userid],
      start : req.body.start,
      end : end,
      url : url,
      media : media,
      color : color
    };
    if (!end) {delete event.end}
    if (!url) {delete event.url}
    if (!color) {delete event.color}
    if (!media) {delete event.media}
    Event.Create({
      title : req.body.title,
      description : req.body.description,
      allDay : allDay,
      author_id : userid,
      author_name : username,
      auth_users : [userid],
      start : req.body.start,
      end : end,
      url : url,
      color : color
    });
  });
};

/* PUT modify a event */
module.exports.eventsUpdateOne = function(req, res) {
  
};

/* DELETE a event */
module.exports.eventsDeleteOne = function(req, res) {
  
};
