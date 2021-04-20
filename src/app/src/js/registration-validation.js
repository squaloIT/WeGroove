import { validateForm } from './utils/validation';

function generateFormObjectWithRegex({
  first_name,
  last_name,
  username,
  email,
  password,
  confirm_password
}) {
  const firstNameRegex = /^[A-Z][a-z]{1,30}$/;
  const lastNameRegex = /^[A-Z][a-z]{1,30}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //Minimum eight characters, at least one letter and one number:
  const usernameRegex = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
  // └─────┬────┘└───┬──┘└─────┬─────┘└─────┬─────┘ └───┬───┘
  // │         │         │            │           no _ or . at the end
  // │         │         │            │
  // │         │         │            allowed characters
  // │         │         │
  // │         │         no __ or _. or ._ or .. inside
  // │         │
  // │         no _ or . at the beginning
  // │
  // username is 3-20 characters long

  return {
    'first-name': {
      val: first_name,
      regex: firstNameRegex
    },
    'last-name': {
      val: last_name,
      regex: lastNameRegex
    },
    username: {
      val: username,
      regex: usernameRegex
    },
    email: {
      val: email
    },
    password: {
      val: password,
      regex: passwordRegex
    },
    "confirm-password": {
      val: confirm_password,
      fn: () => password.trim() == confirm_password.trim()
    }
  }
}

function getValuesFromForm() {
  const first_name = document.querySelector('#first-name').value
  const last_name = document.querySelector('#last-name').value
  const username = document.querySelector('#username').value
  const email = document.querySelector('#email').value
  const password = document.querySelector('#password').value
  const confirm_password = document.querySelector('#confirm-password').value

  return {
    first_name,
    last_name,
    username,
    email,
    password,
    confirm_password
  }
}

function getDataFromValidationObject(validationObject) {
  const newObj = {};

  for (let key in validationObject) {
    newObj[key] = validationObject[key].val
  }
  console.log("🚀 ~ file: registration-validation.js ~ line 80 ~ getDataFromValidationObject ~ newObj", newObj)
  return newObj
}

function validateRegistrationForm() {
  return validateForm(generateFormObjectWithRegex(getValuesFromForm()))
}

export {
  validateRegistrationForm,
  getDataFromValidationObject
}