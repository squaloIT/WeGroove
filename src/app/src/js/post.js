import imageCommentPreview from "./utils/image-comment-preview";
import { onSearchTopicsAndUsers } from "./utils/listeners";

export default function postJS() {
  imageCommentPreview()
  document.querySelector("div.right_column #topics-users-search")
    .addEventListener("keyup", onSearchTopicsAndUsers())
}