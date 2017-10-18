import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';

import dbConnection from './models/dbConnection';
import passportConfig from './config/passport';

// TODO: delete?
import pollController from './controllers/poll';

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use(express.static(path.join(__dirname, '../client/build')));

// passport-Facebook login
app.get('/login/facebook', passport.authenticate('facebook'));
app.get(
  '/login/facebook/return',
  passport.authenticate('facebook', {
    // run in production
    // successRedirect: '/',
    // failureRedirect: '/'

    // run in development
    successRedirect: 'http://localhost:3000',
    failureRedirect: 'http://localhost:3000'
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

// auth routes
app.get('/auth/current_user', passportConfig.currentUser);
app.get('/auth/logout', passportConfig.logout);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

dbConnection.then((db) => {
  app.set('db', db);

  app.listen(5000, () => {
    console.log('Listening on port 5000');
  });
});
