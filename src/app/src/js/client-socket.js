import { io } from "socket.io-client";

(function clientSocket() {
  var socket = io("http://localhost:3000")

  socket.on('connect', () => {
    console.log("CONNECTED")

    socket.on("getSocketIDForUserID", userID => {
      socket.emit("saveSocketIDForUserID", {
        userID,
        socketId: socket.id
      })
    })
  })
})()
