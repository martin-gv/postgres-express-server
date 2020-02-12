const express = require('express');

const router = express.Router();

const auth = require('../handlers/auth');

router.post('/login', auth.login);
router.post('/refresh', auth.refresh);

module.exports = router;
