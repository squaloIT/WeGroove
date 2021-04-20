import { validateRegistrationForm } from './utils/validation';

function getValuesFromRegistrationFormAndValidate() {
  const testObj = validateRegistrationForm(generateFormObjectWithRegex(getValuesFromForm()))
  console.log("🚀 ~ file: registration.js ~ line 5 ~ getValuesFromRegistrationFormAndValidate ~ testObj", testObj)

  if (Object.keys(testObj).length > 0) {
    Object.keys(testObj)
      .forEach(errFieldKey => {
        const el = document.querySelector('#' + errFieldKey)
        el.classList.add('ring-1')
        el.classList.add('ring-red-500')
      })
  } else {
    alert("SVE OK SADAAAAA")
  }

  return testObj
}

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
  // username is 8-20 characters long

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
      regex: passwordRegex
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

function validateRegistration() {
  getValuesFromRegistrationFormAndValidate()
}

document.querySelector('form#registration-form')
  .addEventListener('submit', e => {
    e.preventDefault();

    validateRegistration()
  });

export {
  validateRegistration,
  getValuesFromRegistrationFormAndValidate
}