import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash';
import expressValidator from 'express-validator';
import path from 'path';

import dbConnection from './models/dbConnection';
import passportConfig from './config/passport';
// TODO: delete?
import homeController from './controllers/home';
import userController from './controllers/user';
import pollController from './controllers/poll';
import ErrorController from './controllers/error';

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
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

// TODO: fix this and move this to another folder
app.get('/auth/current_user', (req, res) => {
  if (req.user) {
    return res.send({
      id: req.user.id,
      username: req.user.username,
      displayName: req.user.displayName,
      emails: req.user.emails
    });
  }
  return res.send({});
});

app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// closing all other routes
app.all('*', ErrorController.index);

dbConnection.then((db) => {
  app.set('db', db);

  app.listen(5000, () => {
    console.log('Listening on port 5000');
  });
});
