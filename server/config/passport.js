import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

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
      profileFields: ['id', 'displayName'],
      passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, cb) => {
      const id = profile.id;
      const displayname = profile.displayName;

      const db = req.app.get('db');
      dbUsers.fbLogin(db, id, displayname, (err, userObj) => {
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
    return res.status(401).json({ error: 'Not Authenticated' });
  }
};
