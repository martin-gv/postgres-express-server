const express = require('express');

const router = express.Router();

const routeLogger = require('../middleware/routeLogger');
const requestBodyFilter = require('../middleware/requestBodyFilter');
const hashPassword = require('../middleware/hashPassword');
const authenticate = require('../middleware/authenticate');

const registerHandler = require('../handlers/register');

const authRoutes = require('./auth');
const userRoutes = require('./users');
const noteRoutes = require('./notes');
const tagRoutes = require('./tags');

router.use(routeLogger); // logs to console
router.use(requestBodyFilter);

router.use('/auth', authRoutes);
router.post('/register', hashPassword, registerHandler);

router.use(authenticate);
router.use('/users', userRoutes);
router.use('/notes', noteRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
