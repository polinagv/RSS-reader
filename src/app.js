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

  const validate = (link, schema) => {
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
  const inputUrl = document.querySelector('.form_input');
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedStateValidateErrors.errors.validateErrors = '';

    // чтобы в notOneOf поступал не пустой массив, схема должна создаваться при сабмите
    const schema = yup
      .string()
      .url('Ссылка должна быть валидным URL')
      .notOneOf(state.rssLinks, 'RSS уже существует'); // в этот метод поступает массив из всех ссылок, которые были добавлены ранее: state.rssLinks

    watchedStateValidateErrors.errors.validateErrors = validate(inputUrl.value, schema); // если все ок, то в watchedState.errors.validateErrors будет лежать пустая строка
    // console.log(`Вывожу: ${state.errors.validateErrors}`);

    if (state.errors.validateErrors.length === 0 && !state.rssLinks.includes(inputUrl.value)) {
      // если нет ошибок и если массив rssLinks еще не содержит такую ссылку
      watchedStateValidateErrors.rssLinks.push(inputUrl.value);
      console.log(state.rssLinks);
    }
  });
  // validate('https://');
};

export default app;
