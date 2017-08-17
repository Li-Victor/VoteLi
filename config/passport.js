var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var crypto = require('crypto');

var dbUsers = require('../models/users');
var secret = require('../secret');

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (req, id, cb) {
    var db = req.app.get('db');
    dbUsers.findById(db, id, function (err, user) {
        if(err) { return cb(err); }
        cb(null, user);
    });
});

passport.use('local-login', new localStrategy({
        passReqToCallback: true
    }, function (req, username, password, cb) {
        var db = req.app.get('db');
        dbUsers.findByUsername(db, username, function (err, userObj) {
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
        var db = req.app.get('db');
        dbUsers.registerByUsername(db, username, password, req.body.displayName, function (err, userObj) {
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
    profileFields: ['id', 'displayName', 'email'],
    passReqToCallback: true
}, function (req, accessToken, refreshToken, profile, cb) {

    var id = profile.id;
    var displayName = profile.displayName;

    var usernameHash = crypto.createHash('md5').update(id).digest('hex');
    var passwordHash = crypto.createHash('md5').update(id + displayName).digest('hex');

    var db = req.app.get('db');
    dbUsers.fbUser(db, usernameHash, passwordHash, displayName, function (err, userObj) {
        if(err) { return cb(err); }
        return cb(null, userObj);
    });

}));

module.exports = {
    isAuthenticated: function (req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }
}
