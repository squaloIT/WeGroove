const express = require('express');
const router = express.Router();
const ChatModel = require('../../db/schemas/ChatSchema');
const NotificationModel = require('../../db/schemas/NotificationSchema');
const Message = require('./../../db/schemas/MessageSchema')
const { emitMessageToUsers } = require('../../socket');
const { checkIsLoggedIn } = require('./../../middleware')
require('./../../typedefs');

router.post('/sendMessage', checkIsLoggedIn, async (req, res) => {
  const chatId = req.body.chatId
  const content = req.body.content
  const senderId = req.session.user._id

  if (!chatId || !content) {
    return res.status(400).json({
      data: null,
      status: 400,
      msg: "Provide all values"
    })
  }

  try {
    const newMessage = await Message({
      content,
      sender: senderId,
      chat: chatId
    }).save()

    const chat = await ChatModel.findByIdAndUpdate(chatId, {
      latestMessage: newMessage._id
    }, { new: true });

    const userIds = chat.users.filter(_id => _id != senderId)

    emitMessageToUsers(userIds, newMessage);
    addNotificationsToUsers(userIds, newMessage);

    res.status(200).json({
      data: newMessage,
      status: 200,
      msg: "success"
    })
  } catch (err) {
    console.error(err)

    return res.status(400).json({
      data: null,
      status: 400,
      msg: err
    })
  }
});
/**
 * 
 * @param {Array.<string>} userIds 
 * @param {message} message 
 */
function addNotificationsToUsers(userIds, message) {
  userIds.forEach(id => {
    if (id) {
      const notification = new NotificationModel({
        userTo: id,
        userFrom: message.sender,//* this is id
        notificationType: 'new-message',
        entity: message.chat //* this is id
      })
      notification.createNotification();
    }
  })
}

module.exports = router;