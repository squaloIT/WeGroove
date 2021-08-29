import { io } from "socket.io-client";
import { hideTypingDots, showTypingDots } from "./utils/dom-manipulation";
import { onAudioCallDisplayRinging, onDisconnectRemoveFriendFromList, onFindingOnlineUsers, onFriendConnectionAddToList, onNewMessage, onNewNotification, onVideoCallDisplayRinging } from "./utils/listeners";
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
    socket.on('answer-audio-call', onAudioCallDisplayRinging)
    socket.on('answer-video-call', onVideoCallDisplayRinging)
    socket.on('user-connected', onFriendConnectionAddToList)
    socket.on('user-disconnected', onDisconnectRemoveFriendFromList)
    socket.emit("get-online-following", socket.id)
  })
}

function emitAudioCallStartedForChat(chatId) {
  socket.emit("audio-call-started", { chatId, socketId: socket.id })
}

function emitVideoCallStartedForChat(chatId) {
  socket.emit("video-call-started", { chatId, socketId: socket.id })
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

/**
 * @param { "video" | "audio" } type
 */
function emitCallAnswered(type) {
  socket.emit(`${type}-call-answered`)
}
/**
 * @param { "video" | "audio" } type
 */
function emitCallDenied(type) {
  socket.emit(`${type}-call-answered`)
}

export {
  connectClientSocket,
  emitTypingToRoom,
  emitStopTypingToRoom,
  emitAudioCallStartedForChat,
  emitVideoCallStartedForChat,
  emitCallAnswered,
  emitCallDenied,
  emitJoinRoom
};

