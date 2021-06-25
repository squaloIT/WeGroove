const express = require('express')
const router = express.Router();
const { checkIsLoggedIn } = require('../../middleware');
const NotificationModel = require('../../db/schemas/NotificationSchema');
require('../../typedefs');


router.post('/read', checkIsLoggedIn, async (req, res) => {
  const notificationId = req.body.notificationId;
  const notification = await NotificationModel.findByIdAndUpdate(notificationId, {
    read: true
  })

  return res.status(200).json({
    msg: "Successfully read",
    status: 200,
    data: notification
  })
})

module.exports = router;