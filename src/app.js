/* eslint-disable no-console */
/* eslint-disable max-len */
import * as yup from 'yup';
import _ from 'lodash';
import {
  state,
  watchedStateValidateErrors,
  watchedStateDataFeeds,
  watchedStateDataPosts,
  watchedStateReadabilityPosts,
  watchedStateModalContent,
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
    const postTitle = a.textContent;
    const postLink = a.getAttribute('href');
    // <a href="http://example.com/test/1710334680" class="fw-normal link-secondary" data-id="2" target="_blank" rel="noopener noreferrer">Lorem ipsum 2024-03-13T12:58:00Z</a>

    watchedStateReadabilityPosts.uiState.readabilityPosts.push({
      postId: idButton,
      readability: 'read',
    }); // отрисовываем рендером прочитанные посты
    watchedStateModalContent.uiState.modalContent.push({
      postId: idButton,
      modalTitle: postTitle,
      modalBody: postDescription,
      postLink,
    }); // отрисовываем рендером контент модального окна
  });

  getNewPosts();
};

export default app;
