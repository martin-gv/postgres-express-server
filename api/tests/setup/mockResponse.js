module.exports = ({ locals } = {}) => {
  const res = {};

  res.locals = locals || {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};
