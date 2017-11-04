var express = require('express');
var router = express.Router();
var {db} = require('../db/db');
var BoxSDK = require('box-node-sdk');
var dotenv = require('dotenv');



function loggedIn(req, res, next) {
    if (req.user) {
        next();
        console.log(req.user, "logged in");
    } else {
        console.log("not logged in");
        res.render('error', {message:'you must be logged in to view lobby'});
    }
}

router.use(loggedIn);

function getFirstAndLastName(req, res, next){
  var userQuery = `select * from users where username = $1`;
  db.oneOrNone(userQuery, [req.session.passport.user])
    .then(function(data){
      if (data == null || data.length == 0){
        return res.redirect('/');
      } else {
        res.locals.firstname = data.firstname;
        res.locals.lastname = data.lastname;
        next();
      }
    })
    .catch(function(error){
      console.log("ERROR: ", error);
      return res.send(error);
    });
}

router.use(getFirstAndLastName);

function getFolderName(req, res, next){
  var d = new Date();
  res.locals.foldername = res.locals.lastname + "." + res.locals.firstname + "." + d;
  next();
}

router.use(getFolderName);


//Get clientID, clientSecret and token from .env file, initiate SDK and create client folder
function createTheFolder(req, res, next){
  dotenv.load();
  var sdk = new BoxSDK({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret
  });

  res.locals.token = process.env.token;
  var client = sdk.getBasicClient(res.locals.token);
  var fName = res.locals.foldername;

  client.folders.create('0', fName)
      .then(function(data){
      res.locals.folderid = data.id;
      next();
    });
}

router.use(createTheFolder);

router.get('/', function(req, res, next) {
  res.render('lobby', {
                        user:req.user,
                        message:'logged in',
                        folderid:res.locals.folderid,
                        token: res.locals.token
                      });
});




module.exports = router;
