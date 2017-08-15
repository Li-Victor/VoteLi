var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ensureLogin = require('connect-ensure-login');
var massive = require('massive');
var flash = require('connect-flash');
var crypto = require('crypto');

var dbUsers = require('./db/users');
var secret = require('./secret');

var dbConnection = massive(secret.DB_URI);

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

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    dbUsers.findById(dbConnection, id, function (err, user) {
        if(err) { return cb(err); }
        cb(null, user);
    });
});

var app = express();

//middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: secret.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('home', {
        user: req.user,
        message: req.flash('error')[0]
    });
});


//Passport-Local Login
app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }
));

//Passport-Local register
app.post('/register', passport.authenticate('local-register', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }
));

//passport-Facebook login
app.get('/login/facebook', passport.authenticate('facebook'));

app.get('/login/facebook/return', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
}));

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/mypolls', ensureLogin.ensureLoggedIn('/'), function (req, res) {
    res.render('mypolls', {user: req.user});
});

app.get('/newpoll', ensureLogin.ensureLoggedIn('/'), function (req, res) {
    res.render('newpoll', {user: req.user});
});

dbConnection.then((db) => {
    app.set('db', db);

    app.listen(3000, function () {
        console.log('Listening on port 3000');
    });
});
