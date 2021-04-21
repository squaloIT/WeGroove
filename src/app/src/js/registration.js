import { validateRegistrationForm, getDataFromValidationObject } from './registration-validation';
import { registerUser } from './utils/api';

function removeErrBorder(el) {
  el.classList.remove('ring-1')
  el.classList.remove('ring-red-500');
}
function addErrBorder(el) {
  el.classList.add('ring-1')
  el.classList.add('ring-red-500')
}
function displayErrorLabel(el) {
  el.nextElementSibling.classList.remove('hidden')
  el.nextElementSibling.classList.add('block')
}
function hideErrorLabel(el) {
  el.nextElementSibling.classList.remove('block')
  el.nextElementSibling.classList.add('hidden')
}
Array.from(document.querySelectorAll('.form-control'))
  .forEach(el => {
    el.addEventListener('focus', () => {
      removeErrBorder(el)
    })
  });

document.querySelector('form#registration-form')
  .addEventListener('submit', e => {
    e.preventDefault();

    const formValidationObject = validateRegistrationForm()
    console.log("🚀 ~ file: registration.js ~ line 18 ~ formValidationObject", formValidationObject)

    const isErrorWhileValidating = Object.keys(formValidationObject)
      .filter(key => {
        const el = document.querySelector('#' + key)
        removeErrBorder(el)
        hideErrorLabel(el)
        return formValidationObject[key].is_valid === false
      }).length > 0;

    if (isErrorWhileValidating) {
      Object.keys(formValidationObject)
        .forEach(errFieldKey => {
          if (formValidationObject[errFieldKey].is_valid === false) {
            const el = document.querySelector('#' + errFieldKey)
            addErrBorder(el)
            displayErrorLabel(el)
          }
        })
    } else {
      registerUser(getDataFromValidationObject(formValidationObject))
        .then(res => res.json())
        .then(({ msg }) => {
          alert(msg)
        })
        .catch(err => {
          console.log("🚀 ~ file: registration.js ~ line 47 ~ err", err)
        })
    }

  });