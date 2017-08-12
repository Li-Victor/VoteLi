var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ensureLogin = require('connect-ensure-login');

var dbUsers = require('./db/users');
var secret = require('./secret');

passport.use(new Strategy(
    function (username, password, cb) {
        dbUsers.findByUsername(username, function (err, userObj) {
            if(err) { return cb(err); }
            if(!userObj) { return cb(null, false); }
            if(userObj.password != password) { return cb(null, false); }
            return cb(null, userObj);
        });
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    dbUsers.findById(id, function (err, user) {
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

//Initialize Passport and restore authentication state, if any, from any session
app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('home', {user: req.user});
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login'}), function (req, res) {
    res.redirect('/');
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/polls', ensureLogin.ensureLoggedIn(), function (req, res) {
    res.render('polls', {user: req.user});
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});
