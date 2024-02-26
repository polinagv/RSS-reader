import axios from 'axios';

const getRSSFeed = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`);

export default getRSSFeed;
