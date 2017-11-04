var express = require('express');
var router = express.Router();
var {db} = require('../db/db');
var passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('register');
});

router.use('/registerUser', function checkIfUserNameTaken(req, res, next)
{
  var username = req.body.username;
  var nameQuery = `select * from users where username = $1`;
  db.oneOrNone(nameQuery, [username])
  .then(function(data){
    if(data != null)
    {
      res.redirect('/');
    }
    else {
      next();
    }
  })
  .catch(function(error){
    return res.send(error);
  });
});

router.post('/registerUser', function(req, res, next)
{
  var username = req.body.username;
  var password = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var encryptedPassword = new Buffer(password).toString('base64');
  var insertQuery = `INSERT INTO users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4)`;
  db.none(insertQuery, [username, firstname, lastname, encryptedPassword])
  .then(function()
  {
    next();
  })
  .catch(function(error){
    return res.send(error);
  });
}, passport.authenticate('local',
{successRedirect: '/lobby', failureRedirect: '/'}));



module.exports = router;
