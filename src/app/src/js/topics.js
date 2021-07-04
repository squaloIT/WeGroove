import { setSeparatorHeightForAllReplies } from './utils/dom-manipulation';
import imageCommentPreview from './utils/image-comment-preview';

export default function topics() {
  imageCommentPreview()

  const taReply = document.querySelector("div.reply-aria textarea")
  taReply.addEventListener('keyup', function (e) {
    if (e.target.scrollHeight > 110) {
      e.target.style.overflowY = 'scroll'
    } else {
      e.target.style.overflowY = 'hidden'
      e.target.style.height = `${e.target.scrollHeight}`;
    }

  });

  setSeparatorHeightForAllReplies()

}