var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var getAuthor = function(req, res, callback) {
  if (req.payload && req.payload.username) {
    User
      .findOne({ username: req.payload.username })
      .exec(function(err, user){
        if(!user) {
          sendJSONresponse(res, 404, { "message": "User not found" });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return
        }
        callback(req, res, user.name);
      });
  } else {
    sendJSONresponse(res, 404, { "message": "User not found" });
    return;
  }
};

var getListOfBlogs = function(req, res, search) {
  searchParam = search ? {author: req.params.author} : {};
  return function(req, res){
    Blog.find(searchParam, function(err, results, stats) {
      if(err){
        sendJSONresponse(res, 404, err);
      }
      var blogs = buildBlogList(req, res, results);
      if (blogs.length === 0) { blogs = [{title: "NO DATA HERE"}] }
      console.log("sending blogs: "+JSON.stringify(blogs));
      sendJSONresponse(res, 200, blogs);
    });
  };
};

var buildBlogList = function(req, res, results) {
  var blogs = [];
  results.forEach(function(doc) {
    blogs.push({
      _id: doc._id,
      date_inserted: doc.date_inserted,
      title: doc.title,
      description: doc.description,
      author: doc.author
    });
  });
  blogs = blogs.sort(function(a, b) {
    return new Date(b.date_inserted) - new Date(a.date_inserted);
  });
  return blogs;
};


/* GET list of Blogs */
module.exports.blogsList = getListOfBlogs(false);
module.exports.blogsListByAuth = getListOfBlogs("author");

/* GET a blog by the id */
module.exports.blogsReadOne = function(req, res) {
  //console.log('---------------------------'+req.params.blogid);
  Blog.findById(req.params.blogid, function(err, result) {
    if(err) {sendJSONresponse(res, 404, err);}
    if(result.length === 0) {result = {body: "No such blog", title: "Not Found"}}
    console.log("sending blog: "+JSON.stringify(result));
    sendJSONresponse(res, 200, result);
  });
};

/* POST a new blog */
module.exports.blogsCreate = function(req, res) {
  getAuthor(req, res, function(req, res, username) {
    Blog.Create({
      title : req.body.title,
      description : req.body.description,
      body : req.body.body,
      author : req.body.author
    });
  });
};

/* PUT modify a blog */
module.exports.blogsUpdateOne = function(req, res) {
  
};

/* DELETE a blog */
module.exports.blogsDeleteOne = function(req, res) {
  
};
