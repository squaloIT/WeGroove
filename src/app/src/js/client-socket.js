import { io } from "socket.io-client";

var socket = null;

function connectClientSocket() {
  socket = io("http://localhost:3000")

  socket.on('connect', () => {
    console.log("CONNECTED")

    socket.on("getSocketIDForUserID", userID => {
      socket.emit("saveSocketIDForUserID", {
        userID,
        socketId: socket.id
      })
    })

    socket.on('typing', () => {
      console.log("USER IS FUCKING TYPING")
    })
  })
}

function sendTypingToRoom(chatId) {
  socket.emit("typing", chatId)
}

function emitJoinRoom(room) {
  socket.emit("joinRoom", room)
}

function sendMessageToChat(chatId, message) {

}

export {
  connectClientSocket,
  sendTypingToRoom,
  sendMessageToChat,
  emitJoinRoom
}