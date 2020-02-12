const tryCatch = require('../handlers/tryCatch');
const signature = require('../../util/signature');

const methods = require('./methods');

function createHandler(model) {
  const httpMethods = Object.keys(methods.http).reduce((acc, key) => {
    const configured = methods.http[key]({ model });
    acc[key] = tryCatch(configured);
    return acc;
  }, {});

  const findBy = methods.findBy({ model });

  const handlerMethods = {
    ...httpMethods,
    findBy,
    find: findBy('id'),
  };

  return handlerMethods;
}

module.exports = signature(['object'], createHandler);
