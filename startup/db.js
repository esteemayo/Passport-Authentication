const mongoose = require('mongoose');
const config = require('config');

module.exports = () => {
    // DB CONFIG
    // const db = require('./config/keys').MongoURI;

    // CONNECT TO MONGO
    // mongoose.connect(db, {useNewUrlParser: true})
    //     .then(() => console.log('MongoDB Connected...'))
    //     .catch(err => console.log(err));

    mongoose.connect(config.get('db'), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
        .then(() => console.log('MongoDB Connected.....'))
        .catch(err => console.log(`COULD NOT CONNECT TO MONGODB: ${err}`));
}