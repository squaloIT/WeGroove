const express = require('express')
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).render('register', {
    title: "Registration"
  });
})

router.post('/', (req, res, next) => {
  if (req.body.username) {
    res.status(200).json({ msg: "Sve ok" })
  } else {
    res.status(400).json({ msg: "Nema username" })
  }
})
module.exports = router;