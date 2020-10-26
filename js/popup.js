'use strict';

const OPENED_CLASS = `popup--opened`;
const NO_JS_CLASS = `popup--no-js`;
const ERROR_CLASS = `popup--error`;
const ERROR_MESSAGE = `Обязательное поле для заполнения`;
const URL = `https://echo.htmlacademy.ru/`;

const popup = document.querySelector(`#popup-js`);
const openPopupBtn = document.querySelector(`#placement__description-button-js`);
const closePopupBtn = document.querySelector(`#popup__close-button-js`);
const submitPopupFormBtn = document.querySelector(`#popup__submit-js`);
const nameInput = document.querySelector(`#popup-field-name-js`);
const emailInput = document.querySelector(`#popup-field-email-js`);
const letterTextarea = document.querySelector(`#popup-field-letter-js`);

const openPopup = (evt) => {
  evt.preventDefault();

  popup.classList.add(OPENED_CLASS);

  closePopupBtn.addEventListener(`click`, closePopup);
  submitPopupFormBtn.addEventListener(`click`, submitForm);
  nameInput.addEventListener(`input`, onFieldDataChanged);
  emailInput.addEventListener(`input`, onFieldDataChanged);
  letterTextarea.addEventListener(`input`, onFieldDataChanged);
};

const closePopup = (evt) => {
  if (evt) {
    evt.preventDefault();
  }

  popup.classList.remove(OPENED_CLASS);
  popup.classList.remove(ERROR_CLASS);

  closePopupBtn.removeEventListener(`click`, closePopup);
  submitPopupFormBtn.removeEventListener(`click`, submitForm);
  nameInput.removeEventListener(`input`, onFieldDataChanged);
  emailInput.removeEventListener(`input`, onFieldDataChanged);
  letterTextarea.removeEventListener(`input`, onFieldDataChanged);
};

const submitForm = (evt) => {
  evt.preventDefault();

  popup.classList.remove(ERROR_CLASS);

  if (isValidFormData()) {
    fetch(URL, {
      method: `POST`,
    })
      .then((response) => {
        if (!response.ok) {
          popup.classList.add(ERROR_CLASS);

          throw new Error(`_${response.status}: ${response.statusText}`);
        }

        closePopup();

        return response;
      })
      .catch((error) => {
        popup.classList.add(ERROR_CLASS);

        throw error;
      });
  }
};

const isValidField = (field) => {
  if (field.value.length > 0) {
    field.setCustomValidity(``);

    return true;
  }

  field.setCustomValidity(ERROR_MESSAGE);

  return false;
};

const isValidFormData = () => {
  return isValidField(nameInput)
    && isValidField(emailInput)
    && isValidField(letterTextarea);
};

const onFieldDataChanged = (evt) => {
  isValidField(evt.target);
};

if (popup && openPopupBtn && closePopupBtn && submitPopupFormBtn) {
  popup.classList.remove(NO_JS_CLASS);
  openPopupBtn.addEventListener(`click`, openPopup);
}
