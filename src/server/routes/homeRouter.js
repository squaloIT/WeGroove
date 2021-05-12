const express = require('express')
const router = express.Router();
const PostModel = require('../db/schemas/PostSchema')

router.get("/", (req, res, next) => {
  const user = req.session.user;
  const allPosts = PostModel.getAllPosts();

  res.status(200).render('home', {
    title: "Home",
    posts: allPosts,
    user
  });
})


module.exports = router;