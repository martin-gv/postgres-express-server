module.exports = ({ params, body } = {}) => {
  return {
    params: params || {},
    body: body || {},
  };
};
