var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ensureLogin = require('connect-ensure-login');
var massive = require('massive');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var path = require('path');

var dbConnection = require('./models/dbConnection');
var passportConfig = require('./config/passport');
var secret = require('./secret');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(session({
    secret: secret.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


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
    res.render('mypolls', {user: req.user} );
});

app.get('/newpoll', ensureLogin.ensureLoggedIn('/'), function (req, res) {
    res.render('newpoll', {user: req.user} );
});

dbConnection.then((db) => {
    app.set('db', db);

    app.listen(3000, function () {
        console.log('Listening on port 3000');
    });
});
