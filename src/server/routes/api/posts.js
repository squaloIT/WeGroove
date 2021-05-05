const express = require('express')
const router = express.Router();
const PostModel = require('./../../db/schemas/PostSchema')
const UserModel = require('./../../db/schemas/UserSchema')
const { checkIsLoggedIn } = require('./../../middleware')

router.get('/', (req, res, next) => {

});

//! Need to send session with request! checkIsLoggedIn
router.post('/', checkIsLoggedIn, async (req, res, next) => {
  if (!req.body.content || !req.session.user) {
    return res.sendStatus(400);
  }
  try {
    var createdPost = new PostModel({
      content: req.body.content,
      pinned: false,
      postedBy: req.session.user
    });

    //* Populate will populate any ObjectID field with data from model specified before populate keyword.
    createdPost = await UserModel.populate(createdPost, { path: 'postedBy' });
    const isSaved = await createdPost.save();

    return res.status(isSaved ? 201 : 400).json({
      msg: isSaved ? "Post successfully saved" : "There was an error while saving post",
      status: isSaved ? 201 : 400,
      createdPost
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({ msg: "Error while trying to add new post!" })
  }
});

module.exports = router;