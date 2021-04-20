import test from './test';
import { validateRegistration } from './registration'

document.querySelector('form#registration-form')
  .addEventListener('submit', e => {
    e.preventDefault();

    validateRegistration()
  });