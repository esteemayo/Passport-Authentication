const express = require('express');

const app = express();

require('./startup/routes')(app);
require('./startup/db')();


const PORT = process.env.PORT || 2000;

app.listen(PORT, console.log(`SERVER STARTED ON PORT ${PORT}`));