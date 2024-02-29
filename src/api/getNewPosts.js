/* eslint-disable padded-blocks */
/* eslint-disable max-len */
/* eslint-disable no-console */
import _ from 'lodash';
import getRSSFeed from './getRSSFeed';
import parseHTML from '../parseHTML';
import { state, watchedStateDataPosts } from '../model';

const getNewPosts = () => {
  state.rssLinks.forEach((link) => {
    // [ 'https://lorem-rss.hexlet.app/feed', 'http://www.fontanka.ru/fontanka.rss', 'https://thecipherbrief.com/feed' ]

    let postId;
    state.data.feeds.forEach((feed) => {
      if (feed.url === link) {
        postId = feed.id;
      }
    });

    getRSSFeed(link)
      .then((response) => {
        const doc = parseHTML(response.data.contents);
        const items = doc.querySelectorAll('item'); // // нужно отфильтровать большой массив items из всех последних постов и оставить только те, которых еще нет в state.data.posts

        const existedTitlesPosts = [];
        state.data.posts.forEach((post) => {
          existedTitlesPosts.push(post.title);
        }); // получили массив из тайтлов state.data.posts

        Array.from(items)
          .filter((item) => {
            // если не сработает, попробуй двойной цикл
            const titlePost = item.querySelector('title').textContent; // нужно проверить, что такого titlePost еще нет в существующих постах, то есть state.data.posts
            return !existedTitlesPosts.includes(titlePost); // не должен содержать данное значение, чтобы попасть в следующий массив
          })
          .forEach((item) => {
            const titlePost = item.querySelector('title').textContent;
            const linkPost = item.querySelector('link').nextSibling;
            const post = {
              id: _.uniqueId(),
              postId,
              title: titlePost,
              link: linkPost,
            };
            watchedStateDataPosts.data.posts.push(post); // нужен именно этот watchedState, так как renderPosts как раз и отрисовывает по одному посту
          });
      })
      .catch((err) => {
        state.requestState = 'rejected';
        console.log(err);
      });
  });

  setTimeout(getNewPosts, 5000);
};

export default getNewPosts;
