/* eslint-disable no-console */
/* eslint-disable max-len */
import * as yup from 'yup';
import _ from 'lodash';
import { getWatchedState, renderValidateErrors, renderFeeds } from './view';
import i18nInstance from './locales/initInstance';
import validate from './validate';
import parseHTML from './parseHTML';
import getRSSFeed from './api/getRSSFeed';

const app = () => {
  const state = {
    // isValid: true,
    stateLoading: '', // pending, fulfilled, rejected
    rssLinks: [],
    data: {
      feeds: [
        {
          id: 1,
          url: 'https://lorem-rss.hexlet.app/feed',
          title: 'ФОНТАНКА.ру: Новости Санкт-Петербурга',
          description: 'Санкт-Петербургская интернет-газета. Самые свежие городские новости.',
        },
        {
          id: 2,
          url: 'https://thecipherbrief.com/feed',
          title: '',
          description: '',
        },
      ],
      posts: [
        {
          id: 1,
          postId: 2,
          title: 'Горсуд оставил в силе законность сноса дома на улице Егорова',
        },
      ],
    },
    errors: { validateErrors: '', networkErrors: '' },
  };

  const watchedStateValidateErrors = getWatchedState(state, renderValidateErrors);
  const watchedStateRSSLinks = getWatchedState(state, renderFeeds);
  // const watchedStateNetworkErrors = getWatchedState(state, renderNetworkErrors);
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

    if (state.errors.validateErrors.length === 0 && !state.rssLinks.includes(inputUrl.value)) {
      // если нет ошибок и если массив rssLinks еще не содержит такую ссылку
      const url = inputUrl.value;
      watchedStateValidateErrors.rssLinks.push(url);

      getRSSFeed(url)
        .then((response) => {
          const doc = parseHTML(response.data.contents); // возвращается DOM
          const titleFeed = doc.querySelector('title').textContent;
          const descriptionFeed = doc.querySelector('description').textContent;
          const feed = {
            id: _.uniqueId(),
            url,
            title: titleFeed,
            description: descriptionFeed,
          };
          watchedStateRSSLinks.data.feeds.push(feed);
        })
        .catch((error) => {
          // watchedStateNetworkErrors.errors.networkErrors = error; // это почва на будущую обработку ошибок от сервера, не убирай
          console.log(error);
        });
    }
  });
};

export default app;
