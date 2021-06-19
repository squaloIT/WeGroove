const mongoose = require('mongoose');
require('./../../typedefs')

const ChatSchema = new mongoose.Schema({
  chatName: { type: String, trim: true },
  isGroupChat: { type: Boolean, default: false },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }
}, { timestamps: true });

ChatSchema.statics.getAllChatsForUser = async function (userId) {
  const chats = await ChatModel
    .find({ users: { $elemMatch: { $eq: userId } } })
    .populate('users')
    .lean()
  // TODO - Populate users

  return chats;
}
const ChatModel = mongoose.model("Chat", ChatSchema)
module.exports = ChatModel