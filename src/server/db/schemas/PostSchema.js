const mongoose = require('mongoose');
const UserModel = require('./UserSchema');
const moment = require('moment');
const { createFiltersForSelectedTab, getNumberOfCommentsForPost, fillPostAdditionalFields } = require('../../utils');
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

PostSchema.pre('find', function (next) {
  this.populate('postedBy')
  this.populate('retweetData')
  this.populate('replyTo');
  next()
})

/**
 * @param { user }
 * @returns post[] */
PostSchema.statics.getAllPosts = async (user) => {
  /** @type { post[] } allPosts */
  var allPosts = await PostModel
    .find({ postedBy: { "$in": [...user.following, user._id] } })
    .sort({ "createdAt": "-1" })
    .lean()
  //.lean gives me JS object instead of mongoose model which was the case without .lean

  allPosts = allPosts.map(post => ({
    ...post,
    numOfComments: getNumberOfCommentsForPost(allPosts, post)
  }))

  /** @type { post[] } allPosts */
  var postsWithPostedByPopulated = await UserModel.populate(allPosts, { path: 'retweetData.postedBy' });
  postsWithPostedByPopulated = await UserModel.populate(postsWithPostedByPopulated, { path: 'replyTo.postedBy' });
  postsWithPostedByPopulated = postsWithPostedByPopulated.map(post => fillPostAdditionalFields(post, allPosts));

  return postsWithPostedByPopulated;
}

/** @returns post[] */
PostSchema.statics.findAllUserPosts = async (userId, filterTab = false) => {

  /** @type { post[] } allPosts */
  const allPosts = await PostModel
    .find()
    .sort({ "createdAt": "-1" })
    .lean();

  const filterObj = createFiltersForSelectedTab(userId, filterTab);

  var allPostsForFilters = await PostModel
    .find({ ...filterObj })
    .sort({ "createdAt": "-1" })
    .lean()

  /** @type { post[] } allPosts */
  var postsWithPostedByPopulated = await UserModel.populate(allPostsForFilters, { path: 'retweetData.postedBy' });

  const allPostsWithFromNow = postsWithPostedByPopulated.map(post => fillPostAdditionalFields(post, allPosts));
  return allPostsWithFromNow;
}

/** @returns post */
PostSchema.statics.getPostWithID = async (_id) => {
  /** @type { post } */
  const post = await PostModel.findById(_id)
    .populate('postedBy')
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