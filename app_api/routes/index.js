var express = require('express');
var router = express.Router();
var ctrlBlogs = require('../controllers/blogs');

// blogs
router.get('/blogs', ctrlBlogs.blogsList);
router.get('/blogs/:author', ctrlBlogs.blogsListByAuth);
router.post('/blog/:author', ctrlBlogs.blogsCreate);
router.get('/blog/:blogid', ctrlBlogs.blogsReadOne);
router.put('/blog/:blogid', ctrlBlogs.blogsUpdateOne);
router.delete('/blog/:blogid', ctrlBlogs.blogsDeleteOne);

module.exports = router;
