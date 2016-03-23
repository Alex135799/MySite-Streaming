var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({ secret: process.env.JWT_SECRET, userProperty: 'payload' });
var ctrlAuth = require('../controllers/authentication');
var ctrlBlogs = require('../controllers/blogs');
var ctrlEvents = require('../controllers/events');

// blogs
router.get('/blogs', ctrlBlogs.blogsList);
router.get('/blogs/:author', ctrlBlogs.blogsListByAuth);
router.post('/blog/:author', auth, ctrlBlogs.blogsCreate);
router.get('/blog/:blogid', ctrlBlogs.blogsReadOne);
router.put('/blog/:blogid', auth, ctrlBlogs.blogsUpdateOne);
router.delete('/blog/:blogid', auth, ctrlBlogs.blogsDeleteOne);
// events
router.get('/events', ctrlEvents.eventsList);
router.get('/events/:author', ctrlEvents.eventsListByAuth);
router.post('/event/:author', auth, ctrlEvents.eventsCreate);
router.get('/event/:eventid', ctrlEvents.eventsReadOne);
router.put('/event/:eventid', auth, ctrlEvents.eventsUpdateOne);
router.delete('/event/:eventid', auth, ctrlEvents.eventsDeleteOne);
//authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
