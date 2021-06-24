const express = require('express')
const router = express.Router();
const PostModel = require('../db/schemas/PostSchema')
var moment = require('moment');
const { emitUserIdToRetreiveSocketId } = require('../socket');
require('./../typedefs');

router.get("/", async (req, res, next) => {
  /** @type { user } user */
  const user = req.session.user;

  // const io = req.io;
  // io.join(user._id)

  /** @type { post[] } allPosts */
  let allPosts = await PostModel.getAllPosts(user);

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

  res.status(200).render('main', {
    page: 'home',
    title: "Home",
    posts: allPostsWithFromNow,
    user
  });

  setTimeout(() => {
    emitUserIdToRetreiveSocketId(user._id)
  }, 2000)
})


module.exports = router;