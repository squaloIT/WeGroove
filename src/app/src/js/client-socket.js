import { io } from "socket.io-client";
import { hideTypingDots, showTypingDots } from "./utils/dom-manipulation";

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

    socket.on('typing', showTypingDots);
    socket.on('stop-typing', hideTypingDots)
  })
}

function emitTypingToRoom(room) {
  socket.emit("typing", room)
}

function emitStopTypingToRoom(room) {
  socket.emit("stop-typing", room)
}

function emitJoinRoom(room) {
  socket.emit("joinRoom", room)
}

function sendMessageToChat(chatId, message) {

}

export {
  connectClientSocket,
  emitTypingToRoom,
  sendMessageToChat,
  emitStopTypingToRoom,
  emitJoinRoom
}