const validateForm = (formObject) => {
  const returnObj = {}
  Object.keys(formObject)
    .forEach(key => {
      if (formObject[key].fn) {
        returnObj[key] = formObject[key].fn() ? 'valid' : 'invalid'
      } else {
        if (false == validateInput(formObject[key].val, formObject[key]?.regex)) {
          returnObj[key] = 'invalid'
        } else {
          returnObj[key] = 'valid'
        }
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
  validateForm
}