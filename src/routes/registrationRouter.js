const express = require('express')
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).render('register', {
    title: "Registration"
  });
})

router.post('/', (req, res, next) => {
  console.log(req.body.username)
  if (req.body.username) {
    res.status(200).render('register', { msg: "Sve ok" })
  } else {
    res.status(400).render('register', { msg: "Nema username" })
  }
})
module.exports = router;