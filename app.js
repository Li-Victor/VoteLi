const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const path = require('path');

const dbConnection = require('./models/dbConnection');
const passportConfig = require('./config/passport');
const secret = require('./secret');
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const pollController = require('./controllers/poll');
const ErrorController = require('./controllers/error');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(
  session({
    secret: secret.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Routes to pages
app.get('/', homeController.index);
app.post('/login', userController.postLogin);
app.post('/register', userController.postRegister);
app.get('/logout', userController.getLogout);
app.get('/mypolls', passportConfig.isAuthenticated, userController.getMyPolls);
app.get('/newpoll', passportConfig.isAuthenticated, userController.getNewPolls);

// passport-Facebook login
app.get('/login/facebook', passport.authenticate('facebook'));
app.get(
  '/login/facebook/return',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  })
);

// api routes
app.get('/api/polls', pollController.getPolls);
app.get('/api/poll/:id', pollController.getPollById);
app.get('/api/pollOptions/:id', pollController.getPollOptionsById);
app.post('/api/poll', pollController.postPoll);
app.post('/api/pollOption/:id', pollController.postPollOptionById);
app.put('/api/poll/:id', pollController.putPollById);
app.delete('/api/poll/:id', pollController.deletePollById);

// closing all other routes
app.all('*', ErrorController.index);

dbConnection.then((db) => {
  app.set('db', db);

  app.listen(5000, () => {
    console.log('Listening on port 5000');
  });
});
