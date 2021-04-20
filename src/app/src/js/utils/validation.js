const validateRegistrationForm = (formObject) => {
  const returnObj = {}
  Object.keys(formObject)
    .forEach(key => {
      if (false == validateInput(formObject[key].val, formObject[key]?.regex)) {
        returnObj[key] = 'invalid'
      }
    })

  return returnObj
}

const validateInput = (val, regex = null) => {
  if (!regex) {
    return !!val;
  }
  return val && new RegExp(regex).test(val)
}

export {
  validateRegistrationForm
}