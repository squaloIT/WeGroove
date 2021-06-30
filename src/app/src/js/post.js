import { addAllListenersToPosts, validateAndPreviewImagesForComment } from "./utils/listeners";

export default function postJS() {
  var selectedImages = []

  addAllListenersToPosts(validateAndPreviewImagesForComment(selectedImages))
}