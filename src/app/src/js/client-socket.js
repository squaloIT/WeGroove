import { io } from "socket.io-client";
import { getNumberOfUnreadForUser } from "./utils/api";
import { addNewMessage, hideTypingDots, scrollMessagesToBottom, showTypingDots } from "./utils/dom-manipulation";

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

    socket.on('new-message', (msg) => {
      addNewMessage(msg, 'received')
      scrollMessagesToBottom(document.querySelector('#inbox div.chat-messages-container'))
      getNumberOfUnreadForUser()
        .then(data => {
          const numOfChatsSpan = document.querySelector("#numOfUnreadChats")
          if (numOfChatsSpan && data.data > 0) {
            numOfChatsSpan.classList.add('bg-red-700')
            numOfChatsSpan.innerText = data.data
          }
        })
    });
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