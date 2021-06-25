const mongoose = require('mongoose');
require('./../../typedefs')

const NotificationSchema = new mongoose.Schema({
  userTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  read: { type: Boolean, default: false },
  entity: mongoose.Types.ObjectId,
  notificationType: { type: String, required: true }
}, { timestamps: true });

NotificationSchema.methods.createNotification = async function () {
  await NotificationModel.deleteOne({
    userFrom: this.userFrom,
    userTo: this.userTo,
    notificationType: this.notificationType,
    entity: this.entity
  });

  const newNotification = await this.save()
  return newNotification;
};

const NotificationModel = mongoose.model("Notification", NotificationSchema)
module.exports = NotificationModel