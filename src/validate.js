/* eslint-disable no-console */
/* eslint-disable max-len */

const validate = (link, schema) => {
  try {
    schema.validateSync(link, { abortEarly: false }); // если использовать validate, то это асинхронный метод, поэтому возвращает промис
    console.log('все ок');
    return '';
  } catch (e) {
    console.log(e.message);
    return e.message; // если форма не валидна, то выводится ошибка, которую можно сохранить в state; например, 'name is a required field at createError'
  }
};

export default validate;
