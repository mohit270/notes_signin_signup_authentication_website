const express = require("express");
const route = express.Router();
const passport = require('passport');
const GoogelStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User')



passport.use(new GoogelStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async function(accessToken, refreshToken, profile, done) { 
    console.log(profile); 
    const newUser = {
      googleId: profile._json.sub,
      displayName: profile._json.name,
      firstName: profile._json.given_name,
      lastName: profile._json.family_name,
      profileImage: profile._json.picture
    }
    try{
      let user = await User.findOne({googleId:profile._json.sub});
      if(user){
        done(null,user);
      }else{
        user = await User.create(newUser);
        done(null,user);
      }
    }catch(error){
      console.log(error);
    }
  }
));

// Google Login Route
route.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

route.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login-failure',
    successRedirect: '/dashboard'
    })
);

// Route if something goes wrong
route.get('/login-failure',(req,res)=>{
    const locals = {
        message:"Something went wrong...",
    }
    res.render('404',locals);
});

// Logout Session
route.get('/logout',(req,res)=>{
  req.session.destroy(error=>{
    if(error){
      const locals = { message: "Error loggin out" };
      res.render('404',locals);
    }else{
      res.redirect('/');
    }
  })
})


// Presist user data after successful authentication
passport.serializeUser(function(user,done){
  done(null,user.id);
});

//Retrive user data from session
passport.deserializeUser(function(id,done){
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(error => {
      done(error);
    });
})


module.exports = route;