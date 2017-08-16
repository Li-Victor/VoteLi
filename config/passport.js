var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var crypto = require('crypto');

var dbUsers = require('../models/users');
var secret = require('../secret');
var dbConnection = require('../models/dbConnection');

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    dbUsers.findById(dbConnection, id, function (err, user) {
        if(err) { return cb(err); }
        cb(null, user);
    });
});

passport.use('local-login', new localStrategy({
        passReqToCallback: true
    }, function (req, username, password, cb) {
        dbUsers.findByUsername(dbConnection, username, function (err, userObj) {
            if(err) { return cb(err); }
            if(!userObj) { return cb(null, false, { message: 'Wrong credentials' }); }
            if(userObj.password != password) { return cb(null, false, { message: 'Wrong credentials' }); }
            return cb(null, userObj);
        });
    }
));

passport.use('local-register', new localStrategy({
        passReqToCallback: true
    }, function (req, username, password, cb) {
        dbUsers.registerByUsername(dbConnection, username, password, req.body.displayName, function (err, userObj) {
            if(err) { return cb(err); }
            if(!userObj) { return cb(null, false, { message: 'Username ' + username + ' has already been taken'}); }
            return cb(null, userObj);
        });
    }
));

passport.use(new facebookStrategy({
    clientID: secret.FB_CLIENT_ID,
    clientSecret: secret.FB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/facebook/return',
    profileFields: ['id', 'displayName', 'email']
}, function (accessToken, refreshToken, profile, cb) {

    var id = profile.id;
    var displayName = profile.displayName;

    var usernameHash = crypto.createHash('md5').update(id).digest('hex');
    var passwordHash = crypto.createHash('md5').update(id + displayName).digest('hex');

    dbUsers.fbUser(dbConnection, usernameHash, passwordHash, displayName, function (err, userObj) {
        if(err) { return cb(err); }
        return cb(null, userObj);
    });

}));
