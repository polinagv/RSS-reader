import axios from 'axios';

const getRSSFeed = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`);

export default getRSSFeed;
