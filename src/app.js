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
import parseHTML from './parseHTML';
import getRSSFeed from './api/getRSSFeed';
import getNewPosts from './api/getNewPosts';

const app = () => {
  const inputUrl = document.querySelector('.form_input');
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedStateValidateErrors.errors.validateErrors = '';
    // getRSSFeed('https://lorem-rss.hexlet.app/feed').then((response) => { const doc = parseHTML(response.data.contents); console.log(doc.querySelector('title').textContent); });

    // чтобы в notOneOf поступал не пустой массив, схема должна создаваться при сабмите
    const schema = yup
      .string()
      .url(i18nInstance.t('validate.invalidURL'))
      .notOneOf(state.rssLinks, i18nInstance.t('validate.notUniqueURL'));

    watchedStateValidateErrors.errors.validateErrors = validate(inputUrl.value, schema); // если все ок, то в watchedState.errors.validateErrors будет лежать пустая строка

    if (state.errors.validateErrors.length === 0 && !state.rssLinks.includes(inputUrl.value)) {
      // если нет ошибок и если массив rssLinks еще не содержит такую ссылку
      const url = inputUrl.value;

      watchedStateValidateErrors.rssLinks.push(url);

      getRSSFeed(url)
        .then((response) => {
          const doc = parseHTML(response.data.contents);

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
            // console.log(item);
            const titlePost = item.querySelector('title').textContent;
            const linkPost = item.querySelector('link').nextSibling;
            // console.log(linkPost);
            const post = {
              id: _.uniqueId(),
              postId: feed.id,
              title: titlePost,
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

  getNewPosts();
};

export default app;
