const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pinned: Boolean
}, { timestamps: true });

const PostModel = mongoose.model("Post", PostSchema)
module.exports = PostModel