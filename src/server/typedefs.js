/**
 * @typedef { Object } user
 * @property { String } user._id
 * @property { String } user.username
 * @property { String } user.email
 * @property { String } user.password
 * @property { String } user.profilePic
*  @property { String } user.description
 * @property { String } user.fullName
 * @property { Array.<post> | Array.<String> } user.likes
 * @property { Array.<post> | Array.<String> } user.retweets
 * @property { String } user.createdAt
 * @property { String } user.updatedAt
*/

/**
 * @typedef { Object } userFromRegistration
 * @property { String } user.username
 * @property { String } user.email
 * @property { String } user.password
 * @property { String } user.description
 * @property { String } user.fullName
*/
/**
 * @typedef { Object } chat
 * @property { String } _id
 * @property { String } chatName
 * @property { boolean } isGroupChat
 * @property { Array.<user> } users
 * @property { message } latestMessage
 */
/**
 * @typedef { Object } message
 * @property { String } _id
 * @property { String } content
 * @property { user } sender
 * @property { Array.<user> } readBy
 * @property { chat } chat
*/
/**
 * @typedef { Object } post
 * @property { String } post._id
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
 * @typedef {Object} notification
 * @property {String} _id
 * @property {user} userTo -
 * @property {user} userFrom -
 * @property {String} notificationType -
 * @property {String} entity -
 * @property {boolean} read -
 * @property {boolean} seen -
 */