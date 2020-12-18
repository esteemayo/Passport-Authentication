const express = require('express');

const app = express();

require('./startup/routes')(app);
require('./startup/prod')(app);

module.exports = app;