/* eslint-disable max-len */
/* eslint-disable no-console */

const parseHTML = (responseData) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(responseData, 'text/html'); // возвращается DOM
  return doc;

  // console.log(doc.querySelector('title').textContent);
  // возвращается строка 'ФОНТАНКА.ру: Новости Санкт-Петербурга', ее можно добавить в state.data.feeds[0].title
};

export default parseHTML;
