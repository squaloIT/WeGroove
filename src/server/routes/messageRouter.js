const express = require('express')
const router = express.Router();

require('./../typedefs');

router.get('/', (req, res, next) => {
  res.status(200).render('main', {
    title: "Inbox",
    page: 'inbox',
    user: req.session.user
  });
})

router.get('/new-message', (req, res, next) => {
  res.status(200).render('main', {
    title: "New Message",
    page: 'inbox',
    user: req.session.user
  });
})

module.exports = router;