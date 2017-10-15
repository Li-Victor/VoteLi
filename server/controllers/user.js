import passport from 'passport';

export default {
  // Passport-Local Login
  // POST /Login
  // Sign in using username and password
  postLogin(req, res, next) {
    req.checkBody('username', 'Login username cannot be empty').notEmpty();
    req.checkBody('password', 'Login password cannot be empty').notEmpty();
    req.sanitizeBody('username').escape();

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        const error = result.array().map(currentError => currentError.msg);
        req.flash('error', error);
        return res.redirect('/');
      }

      passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
      })(req, res, next);
    });
  },

  // Passport-Local register
  // POST /register
  // register for new account
  postRegister(req, res, next) {
    req.checkBody('displayName', 'Register display name cannot be empty').notEmpty();
    req.checkBody('username', 'Register username cannot be empty').notEmpty();
    req.checkBody('password', 'Register password cannot be empty').notEmpty();
    req.sanitizeBody('username').escape();
    req.sanitizeBody('displayName').escape();

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        const error = result.array().map(currentError => currentError.msg);
        req.flash('error', error);
        return res.redirect('/');
      }

      passport.authenticate('local-register', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
      })(req, res, next);
    });
  },

  // GET /logout
  // Log out
  getLogout(req, res) {
    req.logout();
    res.redirect('/');
  },

  // GET /mypolls
  // mypolls page
  getMyPolls(req, res) {
    res.render('mypolls', { user: req.user });
  },

  // GET /newpolls
  // newpolls page
  getNewPolls(req, res) {
    res.render('newpoll', { user: req.user });
  }
};
