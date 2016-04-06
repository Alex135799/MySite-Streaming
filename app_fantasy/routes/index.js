var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');

/* GET home page. */
router.get('/home', ctrlHome.home);

module.exports = router;
