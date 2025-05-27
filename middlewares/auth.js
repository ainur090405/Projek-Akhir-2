function isLoggedIn(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next();
  } else {
    res.redirect('/login?error=' + encodeURIComponent('Silakan login terlebih dahulu.'));
  }
}

module.exports = { isLoggedIn };
