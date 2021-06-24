require('./../typedefs')
const moment = require('moment');
const jwt = require('jsonwebtoken')

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
/**
 * Adds fromNow and numOfComments properties to post depending on its type
 * @param {post} post 
 * @param {Array.<post>} allPosts 
 * @returns {post}
 */
function fillPostAdditionalFields(post, allPosts) {
  if (post && allPosts) {

    if (post.retweetData) {
      return {
        ...post,
        fromNow: moment(post.createdAt).fromNow(),
        retweetData: {
          ...post.retweetData,
          fromNow: moment(post.retweetData.createdAt).fromNow(),
          numOfComments: getNumberOfCommentsForPost(allPosts, post.retweetData)
        },
      }
    } else {
      if (post.replyTo) {
        return {
          ...post,
          replyTo: {
            ...post.replyTo,
            fromNow: moment(post.replyTo.createdAt).fromNow(),
            numOfComments: getNumberOfCommentsForPost(allPosts, post.replyTo)
          },
          fromNow: moment(post.createdAt).fromNow(),
          numOfComments: getNumberOfCommentsForPost(allPosts, post)
        }
      }
      else {
        return {
          ...post,
          fromNow: moment(post.createdAt).fromNow(),
          numOfComments: getNumberOfCommentsForPost(allPosts, post)
        }
      }
    }

  }
}
/**
 * Creates jwt token used in all routes and in main.liquid
 * @param {user} user 
 */
function createUserJWT(user) {
  return jwt.sign(user, process.env.SECRET_KEY)
}

module.exports = {
  createFiltersForSelectedTab,
  getNumberOfCommentsForPost,
  createUserJWT,
  fillPostAdditionalFields
}