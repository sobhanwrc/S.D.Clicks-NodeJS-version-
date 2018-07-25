const bCrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

//set strategy for google
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//set strategy for instagram
var InstagramStrategy = require('passport-instagram').Strategy;

// load the auth variables
var configAuth = require('./db');

module.exports = passport => {

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => {
                return done(null, user);
            });
    });

    passport.use('local-login',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, (req, email, password, done) => {
            var isValidPassword = function (userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }

            User.findOne({ email })
                .then(user => {
                    if(!user) {
                        return done(null, false, req.flash('loginMessage', 'Wrong Username or password'));
                    }
                    if (!isValidPassword(user.password, password)) {
                        return done(null, false, req.flash('loginMessage', 'Wrong Username or password'));
    
                    }
                    return done(null, user);
                })
                .catch(err => {
                    console.log(err);
                    return done(null, false, req.flash('loginMessage', 'Something wrong.Please try again.'));
                });
        })
    );

    //for google
    passport.use('google',
        new GoogleStrategy ({
            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL
    },
    function (token, refreshToken, profile, done){
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            // try to find the user based on their google id
            User.findOne({ 'google_id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var user = new User({
                        login_type: 'google',
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                        google_id    : profile.id,
                        google_token : token,
                        google_name  : profile.displayName
                    });

                    if(user.save()){
                        return done(null, user);
                    }
                }
            });
        });
    }));

    //for instagram 
    passport.use('instagram',
        new InstagramStrategy({
            clientID        : configAuth.instagramAuth.clientID,
            clientSecret    : configAuth.instagramAuth.clientSecret,
            callbackURL     : configAuth.instagramAuth.callbackURL
      },
      function(accessToken, refreshToken, profile, done) {

        // asynchronous verification, for effect...
        process.nextTick(function () {
            console.log(profile._json.data,'instagram data');
            // return false;
            User.findOne({ instagramId: profile._json.data.id }, function (err, user) {
                if(err)
                return done(err);
                
                if(user){
                    return done(null, user);
                }else{
                    // if the user isnt in our database, create a new user
                    var user = new User({
                        login_type: 'instagram',
                        avatar: profile._json.data.profile_picture,
                        instagramId    : profile._json.data.id,
                        instagram_name  : profile._json.data.displayName
                    });

                    if(user.save()){
                        return done(null, user);
                    }
                }
            });
        });
      }
    ));
};