const express = require('express');
const ChatSchema = require('../db/schemas/ChatSchema');
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
    user: req.session.user,
    chats: chatWihoutLoggedUser
  });
})

router.get('/new', (req, res, next) => {
  res.status(200).render('main', {
    title: "New Message",
    page: 'inbox',
    user: req.session.user
  });
})

module.exports = router;