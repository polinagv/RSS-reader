/* eslint-disable no-console */
/* eslint-disable max-len */
import onChange from 'on-change';
import i18nInstance from './locales/initInstance';

const formContainer = document.querySelector('[data-purpose="container"]');
const inputUrl = document.querySelector('.form_input');
const feedsContainer = document.querySelector('.feeds');
const postsContainer = document.querySelector('.posts');

export const getWatchedState = (state, render) => onChange(state, render);

export const renderModalContent = (path, value) => {
  const { modalTitle, modalBody, postLink } = value[value.length - 1];

  const modal = document.querySelector('#modal');
  const modalButtonFullArticle = modal.querySelector('.full-article');

  modalButtonFullArticle.setAttribute('href', `${postLink}`);
  modal.querySelector('.modal-title').textContent = modalTitle;
  modal.querySelector('.modal-body').textContent = modalBody;
};

export const renderReadabilityPosts = (path, value) => {
  const { postId, readability } = value[value.length - 1];
  const a = document.querySelector(`[data-id="${postId}"]`);

  if (readability === 'read') {
    a.classList.remove('fw-bold');
    a.classList.add('fw-normal', 'link-secondary');
    // <a href="http://example.com/test/1710334680" class="fw-normal link-secondary" data-id="2" target="_blank" rel="noopener noreferrer">блабла</a>
  }
};

export const renderPosts = (path, value) => {
  if (postsContainer.children.length === 0) {
    // если такого DOM элемента еще нет, то отрисовываем
    postsContainer.insertAdjacentHTML(
      'afterbegin',
      `<div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">Посты</h2>
        </div>
      </div>
      <ul class="list-group border-0 rounded-0"></ul>`,
    );
  }

  // value это массив со всеми постами
  const ulPosts = postsContainer.querySelector('.list-group');
  const { postId, title, link } = value[value.length - 1]; // { feedId: 1, postId: 2, title: 'бла', link: 'https://бла.com' }

  ulPosts.insertAdjacentHTML(
    'beforeend',
    `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
        <a
          href="${link}"
          class="fw-bold a-post"
          data-id="${postId}"
          target="_blank"
          rel="noopener noreferrer"
        >${title}</a>
        <button 
          type="button"
          class="btn btn-outline-primary btn-sm"
          data-id="${postId}"
          data-bs-toggle="modal"
          data-bs-target="#modal"
        >Просмотр</button>
    </li>`,
  );
};

export const renderFeeds = (path, value) => {
  if (feedsContainer.children.length === 0) {
    // если такого DOM элемента еще нет, то отрисовываем
    feedsContainer.insertAdjacentHTML(
      'afterbegin',
      `<div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">Фиды</h2>
        </div>
      </div>
      <ul class="list-group border-0 rounded-0"></ul>`,
    );
  }

  const { title, description } = value[value.length - 1]; // { id: 1, url: 'https://бла.com', title: 'бла', description: 'бла' }

  const ulFeeds = feedsContainer.querySelector('.list-group');
  ulFeeds.insertAdjacentHTML(
    'afterbegin',
    `<li class="list-group-item border-0 border-end-0">
      <h3 class="h6 m-0">${title}</h3>
      <p class="m-0 small text-black-50">${description}</p>
    </li>`,
  );
};

export const renderValidateErrors = (path, value) => {
  if (path === 'errors.validateErrors') {
    if (value !== '') {
      // если туда попала ошибка
      inputUrl.classList.add('is-invalid'); // красная рамка вокруг инпута

      const pExample = document.querySelector('.div_p-example');
      if (pExample.nextElementSibling) {
        pExample.nextElementSibling.remove();
      }

      const pInvalid = document.createElement('p'); // вывод ошибки из watchedState.errors.validateErrors
      pInvalid.classList.add(
        'feedback',
        'm-0',
        'position-absolute',
        'small',
        'text-danger',
        'div_p_invalid',
      ); // <p class="feedback m-0 position-absolute small text-danger">Ссылка должна быть валидным URL</p>
      pInvalid.textContent = value;
      formContainer.append(pInvalid);
    }
  }

  if (path === 'rssLinks') {
    inputUrl.value = ''; // очищаем инпут
    inputUrl.focus();
    inputUrl.classList.remove('is-invalid'); // убираем красную рамку вокруг инпута

    const pExample = document.querySelector('.div_p-example');
    if (pExample.nextElementSibling) {
      pExample.nextElementSibling.remove();
    }

    const pValid = document.createElement('p');
    pValid.classList.add(
      'feedback',
      'm-0',
      'position-absolute',
      'small',
      'text-success',
      'div_p_valid',
    ); // <p class="feedback m-0 position-absolute small text-success">RSS успешно загружен</p>
    pValid.textContent = i18nInstance.t('validate.successURL');
    formContainer.append(pValid);
  }
};
