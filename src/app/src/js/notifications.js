import { onClickOnNotification } from "./utils/listeners"

export default function notifications() {
  Array.from(
    document.querySelectorAll('#notifications > div.content-wrapper > a.notification-link')
  ).forEach(el => {
    el.addEventListener('click', onClickOnNotification)
  })
}