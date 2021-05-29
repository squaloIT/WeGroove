/**
 * @typedef { Object } user
 * @property { String } user.username
 * @property { String } user.email
 * @property { String } user.password
 * @property { String } user.profilePic
 * @property { String } user.firstName
 * @property { String } user.lastName
 * @property { Array.<post> | Array.<String> } user.likes
 * @property { Array.<post> | Array.<String> } user.retweets
 * @property { String } user.createdAt
 * @property { String } user.updatedAt
*/
/**
 * @typedef { Object } post
 * @property { String } post.content
 * @property { user | String } post.postedBy
 * @property { Boolean } post.pinned
 * @property { Array.<user> | Array.<String> } post.likes
 * @property { Array.<user> | Array.<String> } post.retweetUsers
 * @property { post | String } user.retweetData
 * @property { String } user.createdAt
 * @property { String } user.updatedAt
 *
 */
/**
 * @typedef { Object } apiResponse
 * @property { String } apiResponse.status
 * @property { String } apiResponse.msg
 * @property { Object | undefined } apiResponse.data
*/

/**
 * @typedef {Object} buttonWrapperElements
 * @property {HTMLElement} span - The X Coordinate
 * @property {HTMLElement} button - The Y Coordinate
 */