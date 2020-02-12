const express = require('express');

const router = express.Router();

const removeFromBody = require('./removeFromBody');

router
  .route('*')
  .post(removeFromBody('id'))
  .put(removeFromBody('id'));

module.exports = router;
