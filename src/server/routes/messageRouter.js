const express = require('express');
const mongoose = require('mongoose');
const ChatModel = require('../db/schemas/ChatSchema');
const MessageModel = require('../db/schemas/MessageSchema');
const UserModel = require('../db/schemas/UserSchema');
const router = express.Router();

require('./../typedefs');

//* messages
router.get('/', async (req, res, next) => {
  /** @type { Array.<chat> } */
  const chats = await ChatModel.getAllChatsForUser(req.session.user._id);
  const chatWihoutLoggedUser = chats.map(c => {
    const users = c.users.filter(u => u._id != req.session.user._id);

    return {
      ...c,
      chatName: c.chatName ? c.chatName : users.map(u => u.firstName + " " + u.lastName).join(", "),
      users
    }
  });

  res.status(200).render('main', {
    title: "Inbox",
    page: 'inbox',
    subPage: 'inbox',
    user: req.session.user,
    chats: chatWihoutLoggedUser
  });
})

//* messages/new
router.get('/new', (req, res, next) => {
  res.status(200).render('main', {
    title: "New Message",
    subPage: 'new-message',
    page: 'inbox',
    user: req.session.user
  });
})

//* messages/60d1b0731fefcb2adc407e4d
router.get('/:chatId', async (req, res, next) => {
  const chatId = req.params.chatId;
  const userId = req.session.user._id;

  var chat = await ChatModel.findOne({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } }
  }).populate("users");

  if (chat == null) {
    const userFound = await UserModel.findById(chatId);

    if (userFound == null) {
      return res.redirect('/')
    } else {
      chat = await createOrGetChatWithUser(userFound, req.session.user);
    }
  }

  let chatMessages = await MessageModel.find({ chat: chatId })
    .populate('sender')
    .populate('chat')
    .lean()

  chatMessages = chatMessages.map((msg, i) => {
    return {
      ...msg,
      prevMessage: chatMessages[i - 1],
      nextMessage: chatMessages[i + 1],
    }
  });

  res.status(200).render('main', {
    title: "Chat",
    subPage: 'chat',
    page: 'inbox',
    user: req.session.user,
    messages: chatMessages,
    chat,
  });
})

async function createOrGetChatWithUser(userFound, userLogged) {
  var chat = await ChatModel.findOne(
    {
      isGroupChat: false,
      users: ["" + userFound._id, "" + userLogged._id]
    }
  ).populate('users');

  if (chat == null) {
    chat = new ChatModel({
      isGroupChat: false,
      users: [userFound._id, userLogged._id],
      chatName: userFound.firstName + " " + userFound.lastName
    })

    await chat.save()
    chat = await chat.populate('users');
  }

  return chat
}

module.exports = router;