const express = require('express')
const router = express.Router();
require('./../typedefs');

router.get('/:roomId', (req, res, next) => {
  const roomId = req.params.roomId;
  /** @type { user } user */
  const user = req.session.user;
  res.status(200).render('call_room_layout', {
    user
  });
})


module.exports = router;