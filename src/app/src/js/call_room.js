import jwt_decode from 'jwt-decode';
import { io } from "socket.io-client";
import { createAudioBlock } from './utils/html-creators';

export default function call_room() {
  var socket = io("http://localhost:3000")
  const myPeer = new Peer(undefined, {
    host: '/',
    port: '9000'
  });
  const parts = window.location.pathname.split("/")
  const ROOM_ID = parts[parts.length - 1]
  const CALL_TYPE = parts[parts.length - 2]

  const myVideo = document.createElement('video')
  myVideo.muted = true;
  const peers = {};

  const options = { audio: true }
  if (CALL_TYPE === 'video') {
    options.video = true;
  }

  navigator.mediaDevices.getUserMedia(options)
    .then(stream => {
      const leaveCallButton = document.querySelector('button#leave-call');
      leaveCallButton.addEventListener('click', function () {
        myPeer.disconnect();
        window.history.back();
      })

      if (CALL_TYPE === 'video') {
        connectForVideo(stream)
      } else {
        connectForAudio(stream)
      }
    })

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })

  myPeer.on('open', id => {
    const jwtUser = jwt_decode(document.querySelector("#test").value)
    socket.emit('join-call', ROOM_ID, id, jwtUser)
  })


  function connectToNewUser(callType, peerId, stream, userId = null) {
    const call = myPeer.call(peerId, stream)
    const video = document.createElement('video')

    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })

    call.on('close', () => {
      removeVideo(callType, video, userId)
    })

    peers[peerId] = call
  }

  function connectForAudio(stream) {
    myPeer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')

      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on('user-connected-to-call', (peerId, user, roomId) => {
      const isAlreadyDisplayed = document.querySelector(`#participants-wrapper .call-user-wrapper[data-uid='${user._id}']`)

      if (!isAlreadyDisplayed) {
        displayUserBlockInAudioCall(user)
      }
      connectToNewUser("audio_call", peerId, stream, user._id)
      const jwtUser = jwt_decode(document.querySelector("#test").value)
      socket.emit("already-in-room", jwtUser, roomId)
    })

    socket.on('already-in-room', user => {
      const isAlreadyDisplayed = document.querySelector(`#participants-wrapper .call-user-wrapper[data-uid='${user._id}']`)

      if (!isAlreadyDisplayed) {
        displayUserBlockInAudioCall(user)
      }
    })
  }

  function removeVideo(callType, video, userId) {
    video.remove();

    if (callType === 'audio_call') {
      const wrapper = document.querySelector(`.call-user-wrapper[data-uid='${userId}']`)
      wrapper.remove();
    }
  }

  function displayUserBlockInAudioCall(user) {
    const participantsWrapper = document.querySelector("#participants-wrapper");
    const userBlock = createAudioBlock(user);
    participantsWrapper.innerHTML += userBlock;
  }

  function connectForVideo(stream) {
    addMyVideoStreaming(myVideo, stream)

    myPeer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')

      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on('user-connected-to-call', (peerId, user, roomId) => {
      setTimeout(() => {
        connectToNewUser("video_call", peerId, stream)
      }, 2000)
    })
  }
  /**
   * 
   * @param {HTMLElement} video 
   * @param {*} stream 
   */
  let timeout = null;
  function addVideoStream(video, stream) {
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