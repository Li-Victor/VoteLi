var passport = require('passport');

module.exports = {

    //Passport-Local Login
    //POST /Login
    //Sign in using username and password
    postLogin: function (req, res, next) {
        passport.authenticate('local-login', {
                successRedirect: '/',
                failureRedirect: '/',
                failureFlash: true
            }
        )(req, res, next);
    },

    //Passport-Local register
    //POST /register
    //register for new account
    postRegister: function (req, res, next) {
        passport.authenticate('local-register', {
                successRedirect: '/',
                failureRedirect: '/',
                failureFlash: true
            }
        )(req, res, next);
    },

    //GET /logout
    //Log out
    getLogout: function (req, res, next) {
        req.logout();
        res.redirect('/');
    },

    //GET /mypolls
    //mypolls page
    getMyPolls: function (req, res, next) {
        res.render('mypolls', {user: req.user } );
    },

    //GET /newpolls
    //newpolls page
    getNewPolls: function (req, res, next) {
        res.render('newpoll', {user: req.user } );
    }

}
