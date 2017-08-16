var passport = require('passport');

module.exports = {

    //Passport-Local Login
    //POST /Login
    //Sign in using username and password
    postLogin: function (req, res, next) {
        req.checkBody('username', 'Login username cannot be empty').notEmpty();
        req.checkBody('password', 'Login password cannot be empty').notEmpty();
        req.sanitizeBody('username').escape();

        req.getValidationResult().then(function (result) {
            if(!result.isEmpty()) {
                var error = result.array().map(function (currentError) {
                    return currentError.msg;
                });
                req.flash('error', error);
                return res.redirect('/');
            }

            passport.authenticate('local-login', {
                    successRedirect: '/',
                    failureRedirect: '/',
                    failureFlash: true
                }
            )(req, res, next);

        });


    },

    //Passport-Local register
    //POST /register
    //register for new account
    postRegister: function (req, res, next) {
        req.checkBody('displayName', 'Register display name cannot be empty').notEmpty();
        req.checkBody('username', 'Register username cannot be empty').notEmpty();
        req.checkBody('password', 'Register password cannot be empty').notEmpty();
        req.sanitizeBody('username').escape();
        req.sanitizeBody('displayName').escape();

        req.getValidationResult().then(function (result) {
            if(!result.isEmpty()) {
                var error = result.array().map(function (currentError) {
                    return currentError.msg;
                });
                req.flash('error', error);
                return res.redirect('/');
            }

            passport.authenticate('local-register', {
                    successRedirect: '/',
                    failureRedirect: '/',
                    failureFlash: true
                }
            )(req, res, next);
        });

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
