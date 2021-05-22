const mongoose = require('mongoose');
const UserModel = require('./UserSchema');
require('./../../typedefs')

const PostSchema = new mongoose.Schema({
  content: { type: String, trim: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pinned: Boolean,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  retweetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  retweetData: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true });

/** @returns post[] */
PostSchema.statics.getAllPosts = async () => {
  /** @type { post[] } allPosts */
  var allPosts = await PostModel
    .find()
    .populate('postedBy') //* This is enough. No need for the line beneath 
    .populate('retweetData')
    .sort({ "createdAt": "-1" })
    .lean()
  //.lean gives me JS object instead of mongoose model which was the case without .lean

  /** @type { post[] } allPosts */
  const postsWithPostedByPopulated = await UserModel.populate(allPosts, { path: 'retweetData.postedBy' });
  //* No need for this.
  // allPosts = await UserModel.populate(allPosts, { path: 'postedBy' })

  return postsWithPostedByPopulated;
}

const PostModel = mongoose.model("Post", PostSchema)
module.exports = PostModel