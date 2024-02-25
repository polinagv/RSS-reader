/* eslint-disable no-console */
/* eslint-disable max-len */
import * as yup from 'yup';
import { getWatchedState, renderValidateErrors } from './view';
import i18nInstance from './locales/initInstance';
import validate from './validate';

const app = () => {
  const state = {
    isValid: true,
    stateLoading: '', // pending, fulfilled, rejected
    rssLinks: [],
    data: {},
    errors: { validateErrors: '', networkErrors: {} },
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
      .url(i18nInstance.t('validate.invalidURL'))
      .notOneOf(state.rssLinks, i18nInstance.t('validate.notUniqueURL'));

    watchedStateValidateErrors.errors.validateErrors = validate(inputUrl.value, schema); // если все ок, то в watchedState.errors.validateErrors будет лежать пустая строка
    // console.log(`Вывожу: ${state.errors.validateErrors}`);

    if (state.errors.validateErrors.length === 0 && !state.rssLinks.includes(inputUrl.value)) { // если нет ошибок и если массив rssLinks еще не содержит такую ссылку
      watchedStateValidateErrors.rssLinks.push(inputUrl.value);
      console.log(state.rssLinks);
    }
  });
};

export default app;
