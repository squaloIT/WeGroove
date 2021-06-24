const socket = require('socket.io');
// app.set("io", io); //* In this way i made io global app variable
// let io = app.get("io"); //* And I can retreive it with app.get(io)
//* I can also put middleware that will attach io to thhe requst and pass it down the line
//* Or the last way would be to pass it as parameter to module I am require-ing
var socketIO = null;
const sessionsMap = {}; // TODO DELETE USERS FROM THIS OBJECT ON DISCONNECT

function connect(app) {
  const io = socket(app, { pingTimeout: 60000 })

  io.on('connection', socket => {
    socketIO = socket;

    socket.on('saveSocketIDForUserID', data => {
      console.log("🚀 ~ file: socket.js ~ line 18 ~ data", data)
      addSocketIDForUserID(data.userID, data.socketId)
    })
  })
}

function emitUserIdToRetreiveSocketId(userID) {
  console.log('emitUserIdToRetreiveSocketId')
  socketIO.emit("getSocketIDForUserID", userID)
}

function addSocketIDForUserID(userID, socketID) {
  sessionsMap[userID] = socketID;
  console.log("🚀 ~ file: socket.js ~ line 30 ~ sessionsMap", sessionsMap)
}

function deleteUserFromSessionMap(userId) {
  delete sessionsMap[userId];
}

module.exports = {
  emitUserIdToRetreiveSocketId,
  connect
}