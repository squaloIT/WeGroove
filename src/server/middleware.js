const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('./db/schemas/UserSchema')

exports.checkIsLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

exports.isRememberedCookiePresent = (req, res, next) => {
  var cookie = req.signedCookies.rememberMe;
  // console.log('Cookies: ', JSON.stringify(req.cookies))
  // console.log('Cookies signed: ', JSON.stringify(req.signedCookies))

  if (cookie === undefined) {
    next();
    return;
  }

  jwt.verify(cookie, process.env.SECRET_KEY, async (err, verifiedJwtData) => {
    if (err) {
      console.log("ERROR IN JWT")
      console.log("🚀 ~ file: middleware.js ~ line 18 ~ jwt.verify ~ err", err)
      next();
    } else {
      const user = await UserModel.findOne({ email: verifiedJwtData.email })

      if (!user) {
        console.log("User undefined")
        next();
      }

      const match = await bcrypt.compare(verifiedJwtData.password, user.password)
      if (!match) {
        console.log("Match undefined")
        next();
      }

      const userSessionData = user.getDataForSession()
      req.session.user = userSessionData;

      return res.redirect('/');
    }
  });
}