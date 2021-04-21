export function registerUser(data) {
  console.log("🚀 ~ file: api.js ~ line 4 ~ registerUser ~ data", JSON.stringify({ ...data }))
  fetch(`${process.env.SERVER_URL_DEV}/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      return res.json()
    })
    .then(({ msg, status }) => {
      console.log("🚀 ~ file: api.js ~ line 15 ~ .then ~ status", status)
      console.log("🚀 ~ file: api.js ~ line 15 ~ .then ~ msg", msg)

    })
    .catch(err => {
      console.error(`Error while trying to register user`, err)
    })
}