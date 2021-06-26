const socket = require('socket.io');
const jwt = require('jsonwebtoken')
// app.set("io", io); //* In this way i made io global app variable
// let io = app.get("io"); //* And I can retreive it with app.get(io)
//* I can also put middleware that will attach io to thhe requst and pass it down the line
//* Or the last way would be to pass it as parameter to module I am require-ing
var socketIO = null;
const sessionsMap = {}; // TODO DELETE USERS FROM THIS OBJECT ON DISCONNECT
var io = null;

function connect(app) {
  io = socket(app, { pingTimeout: 60000 })

  io.on('connection', socket => {
    socketIO = socket;

    socket.on('saveSocketIDForUserID', data => {
      addSocketIDForUserID(data.jwtUser, data.socketId)
    })

    socket.on('typing', (room) => {
      socket.to(room).emit("typing")
    })

    socket.on('stop-typing', (room) => {
      socket.to(room).emit("stop-typing")
    })

    socket.on('joinRoom', (room) => {
      socket.join(room)
    })
  })
}
/**
 * 
 * @param {String} userID 
 */
function emitUserIdToRetreiveSocketId(userID) {
  socketIO.emit("getSocketIDForUserID", userID)
}
/**
 * 
 * @param {Array.<String>} userIds 
 * @param {message} message 
 */
function emitMessageToUsers(userIds, message) {
  userIds.forEach(_id => {
    const socketID = sessionsMap[_id]
    socketIO.to(socketID).emit('new-message', message)
  })
}
/**
 * 
 * @param {String} jwtUser 
 * @param {String} socketID 
 */
function addSocketIDForUserID(jwtUser, socketID) {
  jwt.verify(jwtUser, process.env.SECRET_KEY, (err, verifiedJwtData) => {
    if (err) return;

    sessionsMap[verifiedJwtData._id] = socketID;
  })
}
/**
 * @param {String} userID 
 */
function deleteUserFromSessionMap(userId) {
  delete sessionsMap[userId];
}
/**
 * @param {notification} notification 
 * @param {Number} notificationNumber 
 */
function emitNotificationToUser(notification, notificationNumber) {
  const userID = notification.userTo._id || notification.userTo;
  const socketID = sessionsMap[userID]

  io.to(socketID).emit('new-notification', JSON.stringify({
    notification,
    notificationNumber
  }))
}

module.exports = {
  connect,
  emitMessageToUsers,
  deleteUserFromSessionMap,
  emitUserIdToRetreiveSocketId,
  emitNotificationToUser
}