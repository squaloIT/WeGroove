import { onClickOnNotification, onSearchTopicsAndUsers } from "./utils/listeners"

export default function notifications() {
  Array.from(
    document.querySelectorAll('#notifications > div.content-wrapper > a.notification-link')
  ).forEach(el => {
    el.addEventListener('click', onClickOnNotification)
  })

  document.querySelector("div.right_column #topics-users-search")
    .addEventListener("keyup", onSearchTopicsAndUsers())
}