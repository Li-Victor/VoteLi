import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as facebookStrategy } from 'passport-facebook';
import crypto from 'crypto';

import dbUsers from '../models/users';
import secret from '../secret';

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((req, id, cb) => {
  const db = req.app.get('db');
  dbUsers.findById(db, id, (err, user) => {
    if (err) {
      return cb(err);
    }
    return cb(null, user);
  });
});

passport.use(
  'local-login',
  new localStrategy(
    {
      passReqToCallback: true
    },
    (req, username, password, cb) => {
      const db = req.app.get('db');
      dbUsers.findByUsername(db, username, (err, userObj) => {
        if (err) {
          return cb(err);
        }
        if (!userObj) {
          return cb(null, false, { message: 'Wrong credentials' });
        }
        if (userObj.password !== password) {
          return cb(null, false, { message: 'Wrong credentials' });
        }
        return cb(null, userObj);
      });
    }
  )
);

passport.use(
  'local-register',
  new localStrategy(
    {
      passReqToCallback: true
    },
    (req, username, password, cb) => {
      const db = req.app.get('db');
      dbUsers.registerByUsername(db, username, password, req.body.displayName, (err, userObj) => {
        if (err) {
          return cb(err);
        }
        if (!userObj) {
          return cb(null, false, { message: `Username ${username} has already been taken` });
        }
        return cb(null, userObj);
      });
    }
  )
);

passport.use(
  new facebookStrategy(
    {
      clientID: secret.FB_CLIENT_ID,
      clientSecret: secret.FB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/facebook/return',
      profileFields: ['id', 'displayName', 'email'],
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, cb) => {
      const id = profile.id;
      const displayName = profile.displayName;

      const usernameHash = crypto
        .createHash('md5')
        .update(id)
        .digest('hex');
      const passwordHash = crypto
        .createHash('md5')
        .update(id + displayName)
        .digest('hex');

      const db = req.app.get('db');
      dbUsers.fbUser(db, usernameHash, passwordHash, displayName, (err, userObj) => {
        if (err) {
          return cb(err);
        }
        return cb(null, userObj);
      });
    }
  )
);

export default {
  isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/');
  }
};
