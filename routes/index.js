var express = require('express');
var router = express.Router();
var {db} = require('../db/db');
var passport = require('passport');



/*router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});*/



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/goToRegister', function(req, res, next){
  res.redirect('/register');
})

router.post('/goToLogin', function(req, res, next){
  res.redirect('/login');
})


/*router.get('/lobby', function(req, res, next) {
  res.render('lobby', { message: 'logged in' });
});*/



/*router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});*/


module.exports = router;
