const mongoose = require('mongoose');

module.exports = () => {
    // DB CONFIG
    // const db = require('./config/keys').MongoURI;

    // CONNECT TO MONGO
    // mongoose.connect(db, {useNewUrlParser: true})
    //     .then(() => console.log('MongoDB Connected...'))
    //     .catch(err => console.log(err));

    mongoose.connect('mongodb://localhost:27017/passport-auth', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
        .then(() => console.log('MongoDB Connected.....'))
        .catch(err => console.log(`COULD NOT CONNECT TO MONGODB: ${err}`));
}