var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var massive = require('massive');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var path = require('path');

var dbConnection = require('./models/dbConnection');
var passportConfig = require('./config/passport');
var secret = require('./secret');
var homeController = require('./controllers/home');
var userController = require('./controllers/user');

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

//Routes to pages
app.get('/', homeController.index);
app.post('/login', userController.postLogin);
app.post('/register', userController.postRegister);
app.get('/logout', userController.getLogout);
app.get('/mypolls', passportConfig.isAuthenticated, userController.getMyPolls);
app.get('/newpoll', passportConfig.isAuthenticated, userController.getNewPolls);

//passport-Facebook login
app.get('/login/facebook', passport.authenticate('facebook'));
app.get('/login/facebook/return', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
}));

dbConnection.then((db) => {
    app.set('db', db);

    app.listen(3000, function () {
        console.log('Listening on port 3000');
    });
});
