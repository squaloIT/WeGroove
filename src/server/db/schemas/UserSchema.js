const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '/images/profilePic.png' }
}, { timestamps: true });


UserSchema.statics.findByCredentials = async (email, password) => {
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

UserSchema.methods.getDataForSession = function () {
  var user = this;

  var payload = {
    username: user.username,
    email: user.email,
    profile_picture: user.profilePic,
    firstName: user.firstName,
    lastName: user.lastName,
    _id: user._id
  }

  return payload
}

const UserModel = mongoose.model("User", UserSchema)
module.exports = UserModel