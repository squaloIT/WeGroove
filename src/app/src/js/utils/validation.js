const validateForm = (formObject) => {
  const returnObj = {}
  Object.keys(formObject)
    .forEach(key => {
      console.log("🚀 ~ file: validation.js ~ line 7 ~ validateForm ~ formObject[key]", formObject[key])
      if (formObject[key].fn) {
        returnObj[key] = {
          ...formObject[key],
          is_valid: formObject[key].fn()
        }
      } else {
        if (false == validateInput(formObject[key].val, formObject[key]?.regex)) {
          returnObj[key] = {
            ...formObject[key],
            is_valid: false
          }
        } else {
          returnObj[key] = {
            ...formObject[key],
            is_valid: true
          }
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