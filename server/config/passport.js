import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import crypto from 'crypto';

import dbUsers from '../models/users';

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
  new FacebookStrategy(
    {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/login/facebook/return',
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
      dbUsers.fbLogin(db, usernameHash, passwordHash, displayName, (err, userObj) => {
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
  },
  currentUser(req, res) {
    if (req.user) {
      return res.send({
        id: req.user.id,
        username: req.user.username,
        displayName: req.user.displayName,
        emails: req.user.emails
      });
    }
    return res.send({});
  },
  logout(req, res) {
    req.logout();
    res.redirect('/');
  }
};
