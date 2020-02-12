const get = ({ model }) => async (req, res) => {
  if (res.locals.documents) {
    return res.status(200).json(res.locals.documents);
  }

  const results = req.params.id
    ? await model.findById(req.params.id)
    : await model.find({ $offset: 3 });

  return res.status(200).json(results);
};

const post = ({ model }) => async (req, res) => {
  const results = await model.create(req.body);
  res.status(201).json(results);
};

const put = ({ model }) => async (req, res) => {
  const results = await model.updateById(req.params.id, req.body);
  res.status(200).json(results);
};

const $delete = ({ model }) => async (req, res) => {
  await model.deleteById(req.params.id);
  res.status(204).end();
};

module.exports = {
  get,
  post,
  put,
  delete: $delete,
};
