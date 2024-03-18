/* eslint-disable import/extensions */
import i18n from 'i18next';
import ru from './ru.js';

const i18nInstance = i18n.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

export default i18nInstance;
