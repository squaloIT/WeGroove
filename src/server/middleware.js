exports.checkIsLoggedIn = (req, res, next) => {
  if (true) {
    // if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
}