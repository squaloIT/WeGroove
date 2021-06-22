const express = require('express');
const router = express.Router();
const ChatModel = require('./../../db/schemas/ChatSchema')
const { checkIsLoggedIn } = require('./../../middleware')
require('./../../typedefs');

router.post('/create', checkIsLoggedIn, async (req, res) => {
  const users = req.body.users

  if (!users || users.length == 0) {
    return res.status(400).json({
      data: null,
      status: 400,
      msg: "There was no user specified for chat!"
    })
  }
  //* Need to add logged in user to group chat
  users.push(req.session.user._id);

  try {
    const chatAlreadyExists = await ChatModel.findOne({ users: { $eq: users } })

    if (!chatAlreadyExists) {
      const chat = new ChatModel({ isGroupChat: users.length > 2, users })
      await chat.save()

      return res.status(200).json({
        data: chat,
        status: 200,
        msg: 'Created new chat'
      })
    } else {
      return res.status(200).json({
        data: chatAlreadyExists,
        status: 200,
        msg: 'Chat already exists'
      })
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({
      data: null,
      status: 400,
      msg: 'There was a problem with creating chat'
    })
  }
});

router.put('/change-chat-name', checkIsLoggedIn, async (req, res) => {
  const newChatName = req.body.chatName;
  const chatId = req.body.chatId;
  console.log(newChatName)
  console.log(chatId)

  var chat = await ChatModel.findByIdAndUpdate(chatId, {
    chatName: newChatName
  }, { new: true })
    .catch(err => {
      console.log(err)
      return res.status(400).json({
        data: null,
        status: 400,
        msg: err
      })
    })

  if (chat == null) {
    chat = await ChatModel.findOneAndUpdate(
      {
        isGroupChat: false,
        users: [chatId, req.session.user._id]
      },
      { chatName: newChatName },
      { new: true }
    )
      .catch(err => {
        console.log(err)
        return res.status(400).json({
          data: null,
          status: 400,
          msg: err
        })
      })
  }

  if (chat == null) {
    return res.status(400).json({
      data: null,
      status: 400,
      msg: 'No chat found'
    })
  }

  return res.status(200).json({
    data: chat,
    status: 200,
    msg: 'Successfully changed chat name.'
  })
})

module.exports = router;