module.exports = {

    // GET /
    // Home page.
    index: function (req, res) {
        res.render('home', {
            user: req.user,
            message: req.flash('error')[0]
        });
    }
};
