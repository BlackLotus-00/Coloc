//in doc
const LocalStrategy=require('passport-local').Strategy;
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const keys=require('./mdp');
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const User=require('../models/users');
//user Model

module.exports = function(passport) {
    passport.use(
      new GoogleStrategy({
        // options for google strategy
        //process.env.GOOGLE_CLIENT_ID
        clientID: '32169756545-v32nv7q78l01d1tru9t509a4prnnhfgl.apps.googleusercontent.com',
        clientSecret: 'Ry8xh6_4Y_H4jKAchqafpnLr',
        callbackURL: '/auth/google/callback',
      }, 
      async (accessToken, refreshToken, profile, done) => {
        // passport callback function
        //console.log('passport callback function fired:');
        //console.log(profile);
        const newUser= {
          googleId: profile.id,
          displayName: profile.displayName,
          image: profile.photos[0].value,
          name: profile.name.givenName,
          email: profile.emails[0].value
          

        }
        try {
          let user=await User.findOne({ googleId: profile.id})
          if (user) {
            done(null,user)
          } else {
            user=await User.create(newUser)
            done(null,user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  passport.use(
      new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Match user
        User.findOne({
          email: email
        }).then(user => {
          if (!user) {
            return done(null, false, { message: 'Aucun compte avec cette adresse' });
          }
          if(!user.isverified) {
            return done(null, false, { message: 'veuillez verifier votre compte!' });
          }
          return done(null, user);
  
          // Match password
          bcrypt.compare(password, user.password,  (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'mot de passe incorrect' });
            }
          });
          //verified account
          
        });
      })
    );
    
passport.serializeUser(function(user, done) {
        done(null, user.id);
});
    
passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });



/*  passport.use(
/*    new GoogleStrategy({
      // options for google strategy
      clientID:'32169756545-292ks3srcagog06e62va2nbii7v20pka.apps.googleusercontent.com',
      clientSecret: 'H7QrTWVWWLBXqLKiE0cS9-2Z',
      callbackURL: '/profil'
  }, (accessToken, refreshToken, profile, done) => {
      // passport callback function
      console.log('passport callback function fired:');
      console.log(profile);
      new User({
          googleId: profile.id,
         //username: profile.displayName
      }).save().then((newUser) => {
          console.log('new user created: ', newUser);
      });
  })
);*/

};