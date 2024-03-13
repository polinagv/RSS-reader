/* eslint-disable no-console */
/* eslint-disable max-len */
import * as yup from 'yup';
import _ from 'lodash';
import {
  state,
  watchedStateValidateErrors,
  watchedStateDataFeeds,
  watchedStateDataPosts,
} from './model';
import i18nInstance from './locales/initInstance';
import validate from './validate';
import dataParse from './dataParse';
import getRSSFeed from './api/getRSSFeed';
import getNewPosts from './api/getNewPosts';

const app = () => {
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

    const url = inputUrl.value.trim();

    watchedStateValidateErrors.errors.validateErrors = validate(url, schema); // если все ок, то в watchedState.errors.validateErrors будет лежать пустая строка

    if (state.errors.validateErrors.length === 0 && !state.rssLinks.includes(url)) {
      // если нет ошибок и если массив rssLinks еще не содержит такую ссылку

      watchedStateValidateErrors.rssLinks.push(url);

      getRSSFeed(url)
        .then((response) => {
          const doc = dataParse(response.data.contents);

          const titleFeed = doc.querySelector('title').textContent; // если в форму закинуть обычный url (не rss), то ломается вот здесь и переходит в catch
          const descriptionFeed = doc.querySelector('description').textContent;
          const feed = {
            id: _.uniqueId(),
            url,
            title: titleFeed,
            description: descriptionFeed,
          };
          watchedStateDataFeeds.data.feeds.push(feed);

          const items = doc.querySelectorAll('item');
          items.forEach((item) => {
            const titlePost = item.querySelector('title').textContent;
            const descriptionPost = item.querySelector('description').textContent;
            const linkPost = item.querySelector('link').textContent;
            const post = {
              feedId: feed.id,
              postId: _.uniqueId(),
              title: titlePost,
              description: descriptionPost,
              link: linkPost,
            };
            watchedStateDataPosts.data.posts.push(post);
          });
        })
        .catch((error) => {
          // watchedStateNetworkErrors.errors.networkErrors = error; // это почва на будущую обработку ошибок от сервера, не убирай
          console.log(`Вывожу ошибку: ${error}`);
        });
    }
  });

  const modal = document.querySelector('#modal');

  modal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const idButton = button.getAttribute('data-id');
    // <button type="button" class="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>

    let postDescription;
    state.data.posts.forEach((post) => {
      if (post.postId === idButton) {
        postDescription = post.description;
      }
    });

    const li = button.parentNode;
    const a = li.querySelector('a');
    // сделай MVC: раздели контроллеры и рендер модалки (нужно отсюда убрать изменение DOM)
    a.classList.remove('fw-bold');
    a.classList.add('fw-normal', 'link-secondary');
    // <a href="http://example.com/test/1710334680" class="fw-normal link-secondary" data-id="2" target="_blank" rel="noopener noreferrer">блабла</a>

    const postTitle = a.textContent; // Lorem ipsum 2024-03-13T12:58:00Z
    const postLink = a.getAttribute('href'); // http://example.com/test/1710334680

    const modalTitle = modal.querySelector('.modal-title'); // обновляем контент модального окна
    modalTitle.textContent = postTitle;

    const modalButtonFullArticle = modal.querySelector('.full-article'); // нужно у этой кнопки поменять href; достать эту ссылку на пост нужно по event.relatedTarget, достав оттуда data-id (у кнопки и поста один и тот же id)
    modalButtonFullArticle.setAttribute('href', `${postLink}`);

    const modalBody = modal.querySelector('.modal-body');
    modalBody.textContent = postDescription;
  });

  getNewPosts();
};

export default app;
