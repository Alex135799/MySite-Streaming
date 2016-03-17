var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

/* GET list of Blogs */
module.exports.blogList = function(req, res) {
  Blog.find({author: "me"}, function(err, results, stats) {
    if(err){
      sendJSONresponse(res, 404, err);
    }
    var blogs = buildBlogList(req, res, results);
    if (blogs.length === 0) { blogs = "NO DATA HERE" }
    console.log("sending blogs: "+blogs);
    sendJSONresponse(res, 200, blogs);
  }); 
};

var buildBlogList = function(req, res, results) {
  var blogs = [];
  results.forEach(function(doc) {
    blogs.push({
      _id: doc.obj._id,
      date_inserted: doc.obj.date_inserted,
      title: doc.obj.title,
      description: doc.obj.description
    });
  });
  return blogs;
};
  


/* GET a blog by the id */
module.exports.blogsReadOne = function(req, res) {
  
};

/* POST a new blog */
module.exports.blogsCreate = function(req, res) {
  
};

/* PUT modify a blog */
module.exports.blogsUpdateOne = function(req, res) {
  
};

/* DELETE a blog */
module.exports.blogsDeleteOne = function(req, res) {
  
};
