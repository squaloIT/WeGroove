import { io } from "socket.io-client";
import { hideTypingDots, showTypingDots } from "./utils/dom-manipulation";
import { onDisconnectRemoveFriendFromList, onFindingOnlineUsers, onFriendConnectionAddToList, onNewMessage, onNewNotification } from "./utils/listeners";
var socket = null;

function connectClientSocket(jwtUser) {
  socket = io("http://localhost:3000")
  socket.on('connect', () => {
    console.log("CONNECTED")
    console.log(socket)
    socket.emit("saveSocketIDForUserID", {
      jwtUser,
      socketId: socket.id
    })

    socket.on('new-notification', onNewNotification);
    socket.on('new-message', onNewMessage);
    socket.on('typing', showTypingDots);
    socket.on('stop-typing', hideTypingDots)
    socket.on('online-users', onFindingOnlineUsers)
    socket.on('user-connected', onFriendConnectionAddToList)
    socket.on('user-disconnected', onDisconnectRemoveFriendFromList)
    socket.emit("get-online-following", socket.id)
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

export {
  connectClientSocket,
  emitTypingToRoom,
  emitStopTypingToRoom,
  emitJoinRoom
};

