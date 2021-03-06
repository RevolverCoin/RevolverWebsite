var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/resources', function(req, res, next) {
  res.render('resources');
});

router.get('/faq', function(req, res, next) {
  res.render('faq');
});

router.get('/blog/reward-explained', function(req, res, next) {
  res.render('reward-explained');
});
router.get('/blog', function(req, res, next) {
  res.render('blog');
});


module.exports = router;
