const express = require('express');
const { Schema } = require('mongoose');
const ChatModel = require('../db/schemas/ChatSchema');
const ChatSchema = require('../db/schemas/ChatSchema');
const UserModel = require('../db/schemas/UserSchema');
const router = express.Router();

require('./../typedefs');

router.get('/', async (req, res, next) => {
  /** @type { Array.<chat> } */
  const chats = await ChatSchema.getAllChatsForUser(req.session.user._id);
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

router.get('/new', (req, res, next) => {
  res.status(200).render('main', {
    title: "New Message",
    subPage: 'new-message',
    page: 'inbox',
    user: req.session.user
  });
})

router.get('/:chatId', async (req, res, next) => {
  const chatId = req.params.chatId;
  const userId = req.session.user._id;

  var chat = await ChatModel.findOne({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } }
  })

  if (chat == null) {
    const userFound = await UserModel.findById(chatId);

    if (userFound == null) {
      return res.redirect('/')
    } else {
      chat = await createOrGetChatWithUser(userFound, req.session.user);
    }
  }

  res.status(200).render('main', {
    title: "Chat",
    subPage: 'chat',
    page: 'inbox',
    user: req.session.user,
    chat
  });
})

function createOrGetChatWithUser(userFound, userLogged) {
  return ChatModel.findOneAndUpdate(
    {
      isGroupChat: false,
      users: [userFound._id, userLogged._id]
      // users: {
      //   $size: 2,
      //   $all: [
      //     {
      //       $elemMatch: { $eq: Schema.Types.ObjectId(userFound._id) },
      //       $elemMatch: { $eq: Schema.Types.ObjectId(userLogged._id) }
      //     }
      //   ]
      // }
    },
    {
      $setOnInsert: {
        users: [userFound._id, userLogged._id]
      }
    },
    {
      new: true,
      upsert: true
    }
  )
    .populate('users')
}

module.exports = router;