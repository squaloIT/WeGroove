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
    const chat = new ChatModel({ isGroupChat: true, users })
    await chat.save()

    res.status(200).json({
      data: chat,
      status: 200,
      msg: 'jeeeeeee'
    })
  } catch (err) {
    console.error(err);
    res.status(400).json({
      data: null,
      status: 400,
      msg: 'There was a problem with creating chat'
    })
  }
});


module.exports = router;