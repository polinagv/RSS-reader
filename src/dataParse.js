/* eslint-disable max-len */
/* eslint-disable no-console */

const dataParse = (responseData) => {
  // нужно сделать, чтобы он проверял, что именно он парсит. это данные rss или нет? должны быть rss
  const parser = new DOMParser();
  const doc = parser.parseFromString(responseData, 'text/xml'); // возвращается DOM
  return doc;
};

export default dataParse;
