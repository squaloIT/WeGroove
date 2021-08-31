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

    const leaveCallButton = document.querySelector('button#leave-call');
    leaveCallButton.addEventListener('click', function () {
      window.location.href = '/'
    })

    myPeer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')

      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on('user-connected-to-call', userId => {
      setTimeout(() => {
        connectToNewUser(userId, stream)
      }, 2000)
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
  let timeout = null;
  function addVideoStream(video, stream) {
    console.log("POZVAN addVideoStream")
    const videoGrid = document.getElementById('video-grid')

    video.srcObject = stream
    video.classList.add("object-fill")
    video.classList.add("cursor-pointer")
    video.classList.add("hover:border")
    video.classList.add("hover:border-white")
    video.classList.add("lg:max-h-80")
    video.classList.add("lg:max-w-none")
    video.classList.add("max-w-[200px]")
    video.classList.add("lg:mb-4")

    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      video.addEventListener('click', () => {
        const bigVideo = document.querySelector('#big-video-wrapper video')
        const smallVideoSrcObject = video.srcObject;
        video.srcObject = bigVideo.srcObject;
        bigVideo.srcObject = smallVideoSrcObject;
      })
    }, 1000)
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
    video.classList.add("object-cover")

    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }
}