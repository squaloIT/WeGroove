const mongoose = require('mongoose');
require('./../../typedefs')

const NotificationSchema = new mongoose.Schema({
  userTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  read: { type: Boolean, default: false },
  entity: mongoose.Types.ObjectId,
  notificationType: { type: String, required: true }
}, { timestamps: true });

const NotifiationModel = mongoose.model("Notification", NotificationSchema)
module.exports = NotifiationModel