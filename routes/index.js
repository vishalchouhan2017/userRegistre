var express = require('express');
var router = express.Router();

var User = require('../schema/user');
var Response = require('../common/response');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* REGISTER USER. */
router.post('/register', function(req, res) {
 var data = new User(req.body);
 data.save(function(err){
  if(err){
    console.log(err);
      Response.errorResponse(err.message,res);
  }else{
      Response.successResponse('User registered successfully!',res,{});
  }
 })
});


/* LOGIN USER. */
router.post('/login', function(req, res) {
 var email = req.body.email;
 var password = req.body.password;
 User.findOne({email: email, password: password}, function(err,user){
   if(err){
     console.log(err);
      Response.errorResponse(err.message,res);
   }
   if(!user){
     Response.notFoundResponse('Invalid Email Id or Password!',res);
   }else{
     req.session.user = user;
     Response.successResponse('User loggedin successfully!',res,user);
   }

 })
});

/* GET DASHBOARD */
router.get('/dashboard', function(req, res) {
  if(!req.session.user){
    Response.unauthorizedRequest('You are not logged in',res);
  }else{
    Response.successResponse('Welcome to dashboard!',res,req.session.user);
  }

});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    console.log("session "+JSON.stringify(req.session.user));
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
