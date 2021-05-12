const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pinned: Boolean
}, { timestamps: true });

PostSchema.statics.getAllPosts = async () => {
  var allPosts = await PostModel.find({})
  console.log("🚀 ~ file: PostSchema.js ~ line 11 ~ PostSchema.statics.getAllPosts= ~ allPosts", allPosts)
  return allPosts
}

const PostModel = mongoose.model("Post", PostSchema)
module.exports = PostModel