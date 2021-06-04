const express = require('express')
const router = express.Router();
const PostModel = require('./../../db/schemas/PostSchema')
const UserModel = require('./../../db/schemas/UserSchema')
const { checkIsLoggedIn } = require('./../../middleware')
require('./../../typedefs');

router.post('/', checkIsLoggedIn, async (req, res, next) => {
  if (!req.body.content || !req.session.user) {
    return res.sendStatus(400);
  }
  try {
    /** @type { post } createdPost */
    var createdPost = new PostModel({
      content: req.body.content,
      pinned: false,
      postedBy: req.session.user
    });

    //* Populate will populate any ObjectID field with data from model specified before populate keyword.
    createdPost = await UserModel.populate(createdPost, { path: 'postedBy' });

    /** @type { Boolean } isSaved */
    const isSaved = await createdPost.save();

    return res.status(isSaved ? 201 : 400).json({
      msg: isSaved ? "Post successfully saved" : "There was an error while saving post",
      status: isSaved ? 201 : 400,
      data: { createdPost }
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({ msg: "Error while trying to add new post!", status: 500 })
  }
});

router.post('/replyTo/:id', checkIsLoggedIn, async (req, res, next) => {
  if (!req.body.content || !req.session.user) {
    return res.sendStatus(400);
  }
  try {
    const postId = req.body._id;
    if (!postId) {
      throw new Error("No postId sent")
    }
    /** @type { post } createdPost */
    var createdPost = new PostModel({
      content: req.body.content,
      pinned: false,
      postedBy: req.session.user,
      replyTo: postId
    });

    //* Populate will populate any ObjectID field with data from model specified before populate keyword.
    createdPost = await UserModel.populate(createdPost, { path: 'postedBy' });

    /** @type { Boolean } isSaved */
    const isSaved = await createdPost.save();

    return res.status(isSaved ? 201 : 400).json({
      msg: isSaved ? "Post successfully saved" : "There was an error while saving post",
      status: isSaved ? 201 : 400,
      data: { createdPost }
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({ msg: "Error while trying to add new post!", status: 500 })
  }
});

router.put('/like', checkIsLoggedIn, async (req, res) => {
  /** @type { String } postId */
  const postId = req.body._id;

  if (!postId) {
    res.status(400).json({
      msg: "There was an error trying to like the post, please try again later thank you",
      status: 400
    });
  }

  /** @type { String } userId */
  const userId = req.session.user._id;

  /** @type { Boolean } isLiked */
  const isLiked = req.session.user.likes && req.session.user.likes.includes(postId)

  /** @type { String } option */
  const option = isLiked ? "$pull" : "$addToSet";

  /** @type { user } newUserWithLikes */
  const newUserWithLikes = await UserModel.findByIdAndUpdate(userId, {
    [option]: {
      likes: postId
    }
  }, { new: true })

  req.session.user = newUserWithLikes;

  /** @type { post } newPostWithLikes */
  const newPostWithLikes = await PostModel.findByIdAndUpdate(postId, {
    [option]: {
      likes: userId
    }
  }, { new: true })

  res.status(201).json({
    status: 201,
    msg: isLiked ? "Post unliked" : "Post liked",
    data: {
      isLiked: option == "$addToSet",
      post: newPostWithLikes
    }
  })
})

router.post('/retweet', checkIsLoggedIn, async (req, res) => {
  /** @type { String } postId */
  const postId = req.body._id;
  /** @type { String } userId */
  const userId = req.session.user._id;

  if (!postId) {
    res.status(400).json({
      msg: "There was an error trying to retweet the post, please try again later thank you",
      status: 400
    });
  }

  //* There can't be two retweeted post from the same user for the same post
  /** @type { post } deletedPost */
  const deletedPost = await PostModel.findOneAndDelete({ postedBy: userId, retweetData: postId })
    .catch(err => {
      console.error(err);
      res.status(400).json({
        msg: "There was an error trying to retweet the post, please try again later thank you",
        status: 400
      });
    })

  /** @type { String } option */
  const option = deletedPost ? "$pull" : "$addToSet";
  /** @type { post } repost */
  var repost = deletedPost;

  //*If there is no deletedPost it means that there was no already retweeted posts so I need to created it 
  if (repost == null) {
    repost = await PostModel.create({ postedBy: userId, retweetData: postId })
  }

  req.session.user = await UserModel.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } }, { new: true })
    .catch(err => {
      console.error(err);
      res.status(400).json({
        msg: "There was an error trying to retweet the post, please try again later thank you",
        status: 400
      });
    });

  /** @type { post } post */
  const post = await PostModel.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } }, { new: true })
    .catch(err => {
      console.error(err);
      res.status(400).json({
        msg: "There was an error trying to retweet the post, please try again later thank you",
        status: 400
      });
    });

  res.status(201).json({
    status: 201,
    msg: deletedPost ? "Post unretweeted" : "Post retweeted",
    data: {
      isRetweeted: option == "$addToSet",
      post
    }
  })
})

router.get('/:id', checkIsLoggedIn, async (req, res) => {
  /** @type { post } */
  const post = await PostModel.getPostWithID(req.params.id)

  return res.status(200).json({
    msg: "Successfully founded post",
    status: 200,
    data: post
  })
})

router.delete('/delete/:id', checkIsLoggedIn, async (req, res) => {
  /** @type { post } */
  const post = await PostModel.findByIdAndDelete(req.params.id)
    .catch(err => {
      console.log(err);
      res.status(400).json({
        msg: "There was an error while trying to delete post",
        status: 400,
      })
    })

  if (post) {
    await PostModel.deleteMany({ retweetData: post._id })
      .catch(err => {
        console.log(err);
        res.status(400).json({
          msg: "There was an error while trying to delete post",
          status: 400,
        })
      })

    return res.status(200).json({
      msg: "Successfully deleted post",
      status: 204,
      data: post
    })
  }

  return res.status(200).json({
    msg: "There was no post to be deleted",
    status: 200,
    data: post
  })
})

router.get('/profile/:tab', checkIsLoggedIn, async (req, res) => {
  /** @type { post } */
  const allUserPosts = await PostModel.findAllUserPosts(req.session.user._id, req.params.tab)
    .catch(err => {
      console.log(err);
      return res.status(400).json({
        msg: "There was problem with getting posts",
        status: 400
      })
    })

  return res.status(200).json({
    msg: "Successfully founded posts",
    status: 200,
    data: allUserPosts
  })
})


module.exports = router;