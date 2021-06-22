const mongoose = require('mongoose');
const UserModel = require('./UserSchema');
require('./../../typedefs')

const ChatSchema = new mongoose.Schema({
  chatName: { type: String, trim: true },
  isGroupChat: { type: Boolean, default: false },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }
}, { timestamps: true });

ChatSchema.statics.getAllChatsForUser = async function (userId) {
  let chats = await ChatModel
    .find({ users: { $elemMatch: { $eq: userId } } })
    .populate('users')
    .populate('latestMessage')
    .sort({ updatedAt: -1 })
    .lean()
  // TODO - Populate users

  chats = await UserModel.populate(chats, { path: "latestMessage.sender" })

  return chats;
}
const ChatModel = mongoose.model("Chat", ChatSchema)
module.exports = ChatModel