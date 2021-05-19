const express = require('express')
const router = express.Router();
const PostModel = require('../db/schemas/PostSchema')
var moment = require('moment')

router.get("/", async (req, res, next) => {
  const user = req.session.user;
  let allPosts = await PostModel.getAllPosts();

  const allPostsWithFromNow = allPosts.map(post => {
    if (post.retweetData) {
      return {
        ...post,
        fromNow: moment(post.createdAt).fromNow(),
        retweetData: {
          ...post.retweetData,
          fromNow: moment(post.retweetData.createdAt).fromNow()
        }
      }
    } else {
      return {
        ...post,
        fromNow: moment(post.createdAt).fromNow()
      }
    }
  });


  res.status(200).render('home', {
    title: "Home",
    posts: allPostsWithFromNow,
    user
  });
})


module.exports = router;