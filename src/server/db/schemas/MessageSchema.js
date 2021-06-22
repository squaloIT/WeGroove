const mongoose = require('mongoose');
require('./../../typedefs')

const MessageSchema = new mongoose.Schema({
  content: { type: String, trim: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }
}, { timestamps: true });

const MessageModel = mongoose.model("Message", MessageSchema)
module.exports = MessageModel