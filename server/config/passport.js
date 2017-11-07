import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';

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
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${process.env.REDIRECT_DOMAIN}/login/twitter/return`,
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
