import './../styles/tailwind.css';

if (window.location.pathname.indexOf('/post') == 0) {
  import('./post').then(({ default: postJS }) => {
    postJS();
  })
}

if (window.location.pathname == '/') {
  import('./index').then(({ default: index }) => {
    index();
  })
}

if (window.location.pathname.indexOf('/profile') == 0) {
  import('./profile').then(({ default: profile }) => {
    profile();
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