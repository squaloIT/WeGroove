const mongoose = require('mongoose');
const { emitNotificationToUser } = require('../../socket');
require('./../../typedefs')

const NotificationSchema = new mongoose.Schema({
  userTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notificationType: { type: String, required: true },
  entity: mongoose.Types.ObjectId,
  read: { type: Boolean, default: false },
  seen: { type: Boolean, default: false },
}, { timestamps: true });

NotificationSchema.methods.createNotification = async function () {
  await NotificationModel.deleteOne({
    userFrom: this.userFrom,
    userTo: this.userTo,
    notificationType: this.notificationType,
    entity: this.entity
  });

  /** @type { notification } */
  const newNotification = await this.save();
  newNotification.populate('userTo')
  newNotification.populate('userFrom')

  if (newNotification.notificationType != 'new-message') {
    const notifications = await NotificationModel.getAllNotificationsForUser(req.session.user._id, {
      seen: false
    })

    emitNotificationToUser(newNotification, notifications.length)
  }
  return newNotification;
};

NotificationSchema.statics.getAllNotificationsForUser = async function (userId, additionalFilters = {}) {
  const filters = {
    userTo: userId,
    notificationType: { $ne: 'new-message' },
    userFrom: { $ne: userId },
    ...additionalFilters
  };

  /** @type { Array.<notification> } */
  const notifications = await NotificationModel.find(filters)
    .sort({ createdAt: -1 })
    .populate('userTo')
    .populate('userFrom')
    .lean()

  return notifications
}

const NotificationModel = mongoose.model("Notification", NotificationSchema)
module.exports = NotificationModel