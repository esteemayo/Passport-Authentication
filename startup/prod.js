const helmet = require('helmet');
const compression = require('compression');

module.exports = app => {
    // Set security http headers
    app.use(helmet());

    // Compression
    app.use(compression());
}