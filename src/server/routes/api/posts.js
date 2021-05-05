const express = require('express')
const router = express.Router();
const PostModel = require('./../../db/schemas/PostSchema')
const { checkIsLoggedIn } = require('./../../middleware')

router.get('/', (req, res, next) => {

});

//! Need to send session with request! checkIsLoggedIn
router.post('/', async (req, res, next) => {
  if (!req.body.content || !req.session.user) {
    return res.sendStatus(400);
  }

  const createdPost = new PostModel({
    content: req.body.content,
    pinned: false,
    postedBy: req.session.user
  });
  const isSaved = await createdPost.save();

  return res.status(isSaved ? 200 : 400).json({
    msg: isSaved ? "Post successfully saved" : "There was an error while saving post",
    status: isSaved ? 200 : 400,
    createdPost
  });
});

module.exports = router;