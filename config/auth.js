// Protect routes from unauth users

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash("error_msg", "Unauthorized Request");
    res.redirect("/");
  },
};

