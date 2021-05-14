const mongoose = require('mongoose');
const UserModel = require('./UserSchema');

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pinned: Boolean
}, { timestamps: true });

PostSchema.statics.getAllPosts = async () => {
  var allPosts = await PostModel.find({}, null, {
    sort: {
      createdAt: -1
    }
  }).lean(); //.lean gives me JS object instead of mongoose model which was the case without .lean

  allPosts = await UserModel.populate(allPosts, { path: 'postedBy' })
  return allPosts
}

const PostModel = mongoose.model("Post", PostSchema)
module.exports = PostModel