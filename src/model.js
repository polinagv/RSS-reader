/* eslint-disable max-len */
import {
  getWatchedState, renderValidateErrors, renderFeeds, renderPosts,
} from './view';

export const state = {
  requestState: 'fulfilled', // pending, fulfilled, rejected
  rssLinks: [], // это свойство нужно, чтобы работал метод notOneOf в schema, так как туда должен поступать массив
  data: {
    feeds: [
      // {
      //   id: 1,
      //   url: 'https://lorem-rss.hexlet.app/feed',
      //   title: 'ФОНТАНКА.ру: Новости Санкт-Петербурга',
      //   description: 'Санкт-Петербургская интернет-газета. Самые свежие городские новости.',
      // },
      // {},
    ],
    posts: [
      // {
      //   id: 1,
      //   postId: 2,
      //   title: 'Горсуд оставил в силе законность сноса дома на улице Егорова',
      //   link: '',
      // },
    ],
  },
  errors: { validateErrors: '', networkErrors: '' },
};

export const watchedStateValidateErrors = getWatchedState(state, renderValidateErrors);
export const watchedStateDataFeeds = getWatchedState(state, renderFeeds);
export const watchedStateDataPosts = getWatchedState(state, renderPosts);
// export const watchedStateRequestState = getWatchedState(state, renderNewPosts);
// const watchedStateNetworkErrors = getWatchedState(state, renderNetworkErrors);
