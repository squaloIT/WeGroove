export function registerUser(data) {
  console.log("🚀 ~ file: api.js ~ line 4 ~ registerUser ~ data", JSON.stringify({ ...data }))
  return fetch(`${process.env.SERVER_URL_DEV}/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data)
  })
}