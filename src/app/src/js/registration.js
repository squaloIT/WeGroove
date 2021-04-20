import validateRegistrationForm from './registration-validation';

function removeErrBorder(el) {
  el.classList.remove('ring-1')
  el.classList.remove('ring-red-500');
}
function addErrBorder(el) {
  el.classList.add('ring-1')
  el.classList.add('ring-red-500')
}

document.querySelector('form#registration-form')
  .addEventListener('submit', e => {
    e.preventDefault();

    const formValidationObject = validateRegistrationForm()

    const isErrorWhileValidating = Object.keys(formValidationObject)
      .filter(key => {
        const el = document.querySelector('#' + key)
        removeErrBorder(el)

        return formValidationObject[key] == 'invalid'
      }).length > 0;

    if (isErrorWhileValidating) {
      Object.keys(formValidationObject)
        .forEach(errFieldKey => {
          if (formValidationObject[errFieldKey] == 'invalid') {
            const el = document.querySelector('#' + errFieldKey)
            addErrBorder(el)
          }
        })
    } else {
      alert("SVE OK SADAAAAA SALJEM DATA")
    }

  });