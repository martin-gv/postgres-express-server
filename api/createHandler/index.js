const tryCatch = require('../handlers/tryCatch');
const signature = require('../../util/signature');

const methods = require('./methods');

function createHandler(model) {
  const httpMethods = {};
  const keys = Object.keys(methods.http);

  // eslint-disable-next-line
  for (const key of keys) {
    const configured = methods.http[key]({ model });
    httpMethods[key] = tryCatch(configured);
  }

  const findBy = methods.findBy({ model });

  const handlerMethods = {
    ...httpMethods,
    findBy,
    find: findBy('id'),
  };

  return handlerMethods;
}

module.exports = signature(['object'], createHandler);
