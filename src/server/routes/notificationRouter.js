const express = require('express')
const router = express.Router();
const NotificationModel = require('../db/schemas/NotificationSchema')

require('./../typedefs');

router.get('/', async (req, res, next) => {
  //TODO - Get all notifications

  const usersNotification = await NotificationModel.find({
    userTo: req.session.user._id,
    notificationType: { $ne: 'new-message' }
  })
    .sort({ createdAt: -1 })
    .populate('userTo')
    .populate('userFrom')


  res.status(200).render('main', {
    title: "Notifications",
    page: 'notifications',
    user: req.session.user,
    jwtUser: req.jwtUser,
    notifications: usersNotification
  });

  setTimeout(async () => {
    await NotificationModel.updateMany({
      userTo: req.session.user._id
    }, { read: true })
  }, 2000)
})

module.exports = router;