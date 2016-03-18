var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
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
  console.log('---------------------------'+req.params.blogid);
  Blog.findById(req.params.blogid, function(err, result) {
    if(err) {sendJSONresponse(res, 404, err);}
    if(result.length === 0) {result = {body: "No such blog", title: "Not Found"}}
    console.log("sending blog: "+JSON.stringify(result));
    sendJSONresponse(res, 200, result);
  });
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
