const express = require('express');
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

  const newMessage = await Message({
    content,
    sender: senderId,
    chat: chatId
  })
    .save()
    .catch(err => {
      console.log(err)
      res.status(400).json({
        data: null,
        status: 400,
        msg: err
      })
    })

  return res.status(200).json({
    data: newMessage,
    status: 200,
    msg: "success"
  })
});


module.exports = router;