//Con google
const passport      = require('passport');
const User          = require('../models/User');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
     User
        .findOne({ facebookID: profile.id })
       .then(user=>{
        if (user){
          return done(err, user);
        }

        const newUser = new User({
          username: profile.displayName,
          facebookID: profile.id,
          email: profile.email
        })
        console.log(profile)
        newUser.save()
        .then(user=>{
          done(null,newUser)
        })
      })
      .catch(err=>{
        console.log(err)
      })
}));