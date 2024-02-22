/* eslint-disable max-len */
import onChange from 'on-change';

// const form = document.querySelector('.rss-form');
const formContainer = document.querySelector('[data-purpose="container"]');
const inputUrl = document.querySelector('.form_input');

export const getWatchedState = (state, render) => onChange(state, render);

export const renderValidateErrors = (path, value) => {
  if (path === 'errors.validateErrors') {
    if (value !== '') { // если туда попала ошибка
      inputUrl.classList.add('is-invalid'); // красная рамка вокруг инпута

      const pInvalid = document.createElement('p'); // вывод ошибки из watchedState.errors.validateErrors
      pInvalid.classList.add(['feedback', 'm-0', 'position-absolute', 'small', 'text-danger']); // <p class="feedback m-0 position-absolute small text-danger">Ссылка должна быть валидным URL</p>
      pInvalid.textContent = value;
      formContainer.append(pInvalid);
    }
  }

  if (path === 'rssLinks') {
    // После того как поток добавлен, форма принимает первоначальный вид (очищается инпут, устанавливается фокус)
  }
};
