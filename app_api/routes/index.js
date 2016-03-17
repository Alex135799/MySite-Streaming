var express = require('express');
var router = express.Router();
var ctrlBlogs = require('../controllers/blogs');

// blogs
router.get('/blogs', ctrlBlogs.blogList);
router.post('/blogs', ctrlBlogs.blogsCreate);
router.get('/blogs/:blogid', ctrlBlogs.blogsReadOne);
router.put('/blogs/:blogid', ctrlBlogs.blogsUpdateOne);
router.delete('/blogs/:blogid', ctrlBlogs.blogsDeleteOne);

module.exports = router;
