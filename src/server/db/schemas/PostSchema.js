const mongoose = require('mongoose');
const UserModel = require('./UserSchema');
const moment = require('moment');
require('./../../typedefs')

const PostSchema = new mongoose.Schema({
  content: { type: String, trim: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pinned: Boolean,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  retweetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  retweetData: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true });

/** @returns post[] */
PostSchema.statics.getAllPosts = async () => {
  /** @type { post[] } allPosts */
  var allPosts = await PostModel
    .find()
    .populate('postedBy') //* This is enough. No need for the line beneath 
    .populate('retweetData')
    .populate('replyTo')
    .sort({ "createdAt": "-1" })
    .lean()
  //.lean gives me JS object instead of mongoose model which was the case without .lean

  /** @type { post[] } allPosts */
  var postsWithPostedByPopulated = await UserModel.populate(allPosts, { path: 'retweetData.postedBy' });
  postsWithPostedByPopulated = await UserModel.populate(postsWithPostedByPopulated, { path: 'replyTo.postedBy' });

  return postsWithPostedByPopulated;
}

/** @returns post[] */
PostSchema.statics.findAllUserPosts = async (userId, filterTab = false) => {
  /** @type { post[] } allPosts */
  const filterObj = {};

  if (!filterTab) {
    filterObj.postedBy = userId;
    filterObj.replyTo = {
      $exists: false
    }
  } else {
    if (filterTab == 'posts') {
      filterObj.postedBy = userId;
      filterObj.replyTo = {
        $exists: false
      }
    }

    if (filterTab == 'likes') {
      filterObj.likes = userId;
    }

    if (filterTab == 'replies') {
      filterObj.postedBy = userId;
      filterObj.replyTo = {
        $exists: true
      }
    }
  }

  console.log(JSON.stringify(filterObj))

  var allPosts = await PostModel
    .find({ ...filterObj })
    .populate('postedBy') //* This is enough. No need for the line beneath 
    .populate('retweetData')
    .populate('replyTo')
    .sort({ "createdAt": "-1" })
    .lean()

  /** @type { post[] } allPosts */
  var postsWithPostedByPopulated = await UserModel.populate(allPosts, { path: 'retweetData.postedBy' });

  return postsWithPostedByPopulated;
}

/** @returns post */
PostSchema.statics.getPostWithID = async (_id) => {
  /** @type { post } */
  const post = await PostModel.findById(_id)
    .populate('postedBy')
    // .populate('likes')
    .populate('retweetUsers')
    .lean()
    .catch(err => {
      console.error(err);
    })
  post.time = moment(post.createdAt).format("H:m A")
  post.date = moment(post.createdAt).format("MMM D, YYYY")

  return post;
}

/** @returns post */
PostSchema.statics.getRepliesForPost = async (_id) => {
  /** @type { Array.<post> } */
  const replies = await PostModel.find({ replyTo: _id })
    .populate('postedBy')
    .populate('likes')
    .populate('retweetUsers')
    .lean()
    .catch(err => {
      console.error(err);
    });

  const repliesWithFromNow = replies.map(p => ({ ...p, fromNow: moment(p.createdAt).fromNow() }))

  return repliesWithFromNow;
}

const PostModel = mongoose.model("Post", PostSchema)
module.exports = PostModel