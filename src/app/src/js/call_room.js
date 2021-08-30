import { io } from "socket.io-client";

export default function call_room() {
  var socket = io("http://localhost:3000")
  const myPeer = new Peer(undefined, {
    host: '/',
    port: '9000'
  });
  const parts = window.location.pathname.split("/")
  const ROOM_ID = parts[parts.length - 1]

  const myVideo = document.createElement('video')
  myVideo.muted = true;
  const peers = {};

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    addMyVideoStreaming(myVideo, stream)

    myPeer.on('call', call => {
      console.log("ON CALL")
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on('user-connected-to-call', userId => {

      setTimeout(() => {
        connectToNewUser(userId, stream)
      }, 4000)
    })
  })

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })

  myPeer.on('open', id => {
    socket.emit('join-call', ROOM_ID, id)
  })

  function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')

    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })

    peers[userId] = call
  }
  /**
   * 
   * @param {HTMLElement} video 
   * @param {*} stream 
   */
  function addVideoStream(video, stream) {
    const videoGrid = document.getElementById('video-grid')

    video.srcObject = stream
    video.classList.add("mr-4")
    video.classList.add("w-2/5")
    // video.classList.add("xs:w-1/2")
    video.classList.add("lg:w-1/4")
    video.classList.add("object-cover")

    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }
  /**
   * 
   * @param {HTMLElement} video 
   * @param {*} stream 
   */
  function addMyVideoStreaming(video, stream) {
    const videoGrid = document.getElementById('big-video-wrapper')

    video.srcObject = stream
    video.classList.add("h-full")
    video.classList.add("w-full")

    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }
}