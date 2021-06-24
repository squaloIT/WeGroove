const express = require('express')
const router = express.Router();
const NotificationModel = require('../db/schemas/NotificationSchema')

require('./../typedefs');

router.get('/', (req, res, next) => {
  //TODO - Get all notifications

  res.status(200).render('main', {
    title: "Notifications",
    page: 'notifications',
    user: req.session.user,
    jwtUser: req.jwtUser,
    notifications: []
  });
})

module.exports = router;