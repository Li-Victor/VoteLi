module.exports = {
  // GET /
  // Home page.
  index(req, res) {
    res.render('home', {
      user: req.user,
      message: req.flash('error')
    });
  }
};
