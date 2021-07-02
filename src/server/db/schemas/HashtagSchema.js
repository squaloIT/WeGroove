const mongoose = require('mongoose');
require('./../../typedefs')

const HashtagSchema = new mongoose.Schema({
  hashtag: { type: String, trim: true, unique: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true });

HashtagSchema.statics.createHashTagsForPost = async function (post) {
  const hashtags = post.content.split(" ").filter(v => v.startsWith('#'))

  hashtags.forEach(async hashtag => {
    const existingHashtag = await HashtagModel.findOne({ hashtag });

    if (existingHashtag) {
      existingHashtag.posts = [...existingHashtag.posts, post._id];
      await existingHashtag.save();
    } else {
      var newHashtag = new HashtagModel({
        hashtag,
        posts: [post._id]
      })
      await newHashtag.save()
    }
  });
}

const HashtagModel = mongoose.model("Hashtag", HashtagSchema)
module.exports = HashtagModel