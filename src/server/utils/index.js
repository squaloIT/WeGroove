require('./../typedefs')

/**
 * @param {Number} userId 
 * @param {string} filterTab 
 * @returns { Object }
 */
function createFiltersForSelectedTab(userId, filterTab) {
  const filterObj = {}

  if (!filterTab) {
    filterObj.postedBy = userId;
    filterObj.replyTo = {
      $exists: false
    }
  } else {
    if (filterTab == 'posts') {
      filterObj.postedBy = userId;
      filterObj.replyTo = {
        $exists: false
      }
    }

    if (filterTab == 'likes') {
      filterObj.likes = userId;
    }

    if (filterTab == 'replies') {
      filterObj.postedBy = userId;
      filterObj.replyTo = {
        $exists: true
      }
    }
  }

  return filterObj
}
/**
 * @param {Array.<post>} allPosts 
 * @param {post} post 
 * @returns { number }
 */
function getNumberOfCommentsForPost(allPosts, post) {
  return allPosts.filter(p => post._id.toString() == p.replyTo?._id.toString()).length
}

module.exports = {
  createFiltersForSelectedTab,
  getNumberOfCommentsForPost
}