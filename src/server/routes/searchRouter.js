const express = require('express')
const router = express.Router();

require('./../typedefs');

router.get('/:searchType', (req, res, next) => {
  const searchType = req.params.searchType.toLowerCase();

  res.status(200).render('main', {
    title: "Search",
    page: 'search',
    user: req.session.user,
    active: searchType
  });
})

module.exports = router;