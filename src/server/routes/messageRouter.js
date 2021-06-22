const express = require('express');
const mongoose = require('mongoose');
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
  }).populate("users");

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

// function createOrGetChatWithUser(userFound, userLogged) {
//   return ChatModel.findOneAndUpdate( //???
//     {
//       isGroupChat: false,
//       // users: [userFound._id, userLogged._id]
//       users: {
//         $size: 2,
//         $all: [
//           {
//             $elemMatch: { $eq: mongoose.Types.ObjectId(userFound._id) },
//             $elemMatch: { $eq: mongoose.Types.ObjectId(userLogged._id) }
//           }
//         ]
//       }
//     },//60ce04c54ccebe53c0239fed
//     {
//       $setOnInsert: {
//         users: [userFound._id, userLogged._id]
//       }
//     },
//     {
//       new: true,
//       upsert: true
//     }
//   )
//     .populate('users')
// }

module.exports = router;