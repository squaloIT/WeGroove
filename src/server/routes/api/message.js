const express = require('express');
const ChatModel = require('../../db/schemas/ChatSchema');
const { emitMessageToUsers } = require('../../socket');
const router = express.Router();
const Message = require('./../../db/schemas/MessageSchema')
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

    const userIdsToEmitNewMessage = chat.users.filter(_id => _id != senderId)

    emitMessageToUsers(userIdsToEmitNewMessage, newMessage);

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


module.exports = router;