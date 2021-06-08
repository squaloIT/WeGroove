const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcrypt');
require('./../../typedefs')

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true },
  description: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '/assets/profilePic.jpeg' },
  coverPic: { type: String, default: '/assets/coverPic.png' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });


UserSchema.statics.findByCredentials = async (email, password) => {
  /** @type { user } user */
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

UserSchema.statics.isAlreadyCreated = (username, email) => {
  return UserModel.findOne({
    $or: [{ username }, { email }]
  })
}

UserSchema.statics.findByUsernameOrID = async (username) => {
  /** @type { user } */
  let user = await UserModel.findOne({ username })

  if (!user) {
    user = await UserModel.findById(username)
  }
  user.joined = moment(user.createdAt).format("MMM, YYYY")

  return user;
}

UserSchema.methods.getDataForSession = function () {
  /** @type { user } user */
  var user = this;

  var payload = {
    username: user.username,
    email: user.email,
    profilePic: user.profilePic,
    firstName: user.firstName,
    lastName: user.lastName,
    _id: user._id
  }

  return payload
}

const UserModel = mongoose.model("User", UserSchema)
module.exports = UserModel