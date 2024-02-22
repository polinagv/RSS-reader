/* eslint-disable no-console */
/* eslint-disable max-len */
import * as yup from 'yup';
import { getWatchedState, renderValidateErrors } from './view';

const app = () => {
  const state = {
    isValid: true,
    stateLoading: '', // pending, fulfilled, rejected
    rssLinks: [],
    data: {},
    errors: { validateErrors: '', networkErrors: {} },
  };

  const schema = yup
    .string()
    .url('Ресурс не содержит валидный RSS')
    .notOneOf(state.rssLinks, 'RSS уже существует'); // в этот метож поступает массив из всех ссылок, которые были добавлены ранее: state.rssLinks
  const validate = (link) => {
    try {
      schema.validateSync(link, { abortEarly: false }); // если использовать validate, то это асинхронный метод, поэтому возвращает промис
      console.log('все ок');
      return '';
    } catch (e) {
      console.log(e.message);
      return e.message; // если форма не валидна, то выводится ошибка, которую можно сохранить в state; например, 'name is a required field at createError'
    }
  };

  const watchedStateValidateErrors = getWatchedState(state, renderValidateErrors);

  const submit = document.querySelector('.div_btn-submit');
  submit.addEventListener('submit', (e) => {
    e.preventDefault();
    // если не будет работать, то попробуй добавить условие: if(e.target.value.length > 0)
    watchedStateValidateErrors.errors.validateErrors = validate(e.target.value); // если все ок, то в watchedState.errors.validateErrors будет лежать пустая строка

    if (watchedStateValidateErrors.errors.validateErrors.isEmpty()) {
      watchedStateValidateErrors.rssLinks.push(e.target.value);
    }
  });

  // validate('https://');
};

export default app;
