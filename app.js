const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
const { notFoundHandler, errorHandler } = require('./api');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/api', routes);

app.use('*', notFoundHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
