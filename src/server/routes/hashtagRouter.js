const express = require('express')
const router = express.Router();
const HashtagModel = require('../db/schemas/HashtagSchema')
var moment = require('moment');
require('./../typedefs');

router.get("/:id", async (req, res, next) => {
  /** @type { user } user */
  const user = req.session.user;

  /** @type { hashtag }  */
  let hashtag = await HashtagModel.getHashtagWithPosts(req.params.id);

  const allPostsWithFromNow = hashtag.posts.map(post => {
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
  console.log("🚀 ~ file: HashtagSchema.js ~ line 31 ~ allPostsWithFromNow", JSON.stringify(allPostsWithFromNow, null, 3))

  res.status(200).render('main', {
    page: 'topics',
    title: hashtag.hashtag,
    posts: allPostsWithFromNow,
    jwtUser: req.jwtUser,
    numOfUnreadNotifications: req.numberOfUnreadNotifications,
    numOfUnreadChats: req.numberOfUnreadChats,
    popularHashtags: req.mostPopularHashtags,
    user
  });
})


module.exports = router;