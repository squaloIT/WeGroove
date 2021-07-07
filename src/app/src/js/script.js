import './../styles/tailwind.css';
import { connectClientSocket } from './client-socket';

if (window.location.pathname != '/login' && window.location.pathname != '/registration') {
  const jwtUser = document.querySelector("input#test").value;
  connectClientSocket(jwtUser)
}

if (window.location.pathname.indexOf('/post') == 0) {
  import('./post').then(({ default: postJS }) => {
    postJS();
  })
}

if (window.location.pathname == '/') {
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').then(res => {
        console.log("Service worker registered")
        console.log(res)
      });

    });
  }
  import('./index').then(({ default: index }) => {
    index();
  })
}

if (window.location.pathname.indexOf('/profile') == 0) {
  import('./profile').then(({ default: profile }) => {
    profile();
  })
}

if (window.location.pathname.indexOf('/search') == 0) {
  import('./search').then(({ default: search }) => {
    search();
  })
}

if (window.location.pathname.indexOf('/messages') == 0) {
  import('./inbox').then(({ default: inbox }) => {
    inbox();
  })
}

if (window.location.pathname.indexOf('/notifications') == 0) {
  import('./notifications').then(({ default: notifications }) => {
    notifications();
  })
}

if (window.location.pathname.indexOf('/topic') == 0) {
  import('./topics').then(({ default: topics }) => {
    topics();
  })
}

if (window.location.pathname == '/login') {
  import('./login').then(({ default: login }) => {
    login();
  })
}

if (window.location.pathname == '/registration') {
  import('./registration').then(({ default: registration }) => {
    registration();
  })
}