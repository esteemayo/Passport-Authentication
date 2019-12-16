const express = require('express');
const expressLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
// const passport = require('passport-session');

const index = require('../routes/index');
const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = app => {
    // PASSPORT CONFIG
    require('../config/passport')(passport);

    // EJS
    app.use(expressLayout);
    app.set('view engine', 'ejs');

    // BODYPARSER
    app.use(express.urlencoded({ extended: false }));

    // EXPRESS SESSION
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // CONNECT FLASH
    app.use(flash());

    // GLOBAL VARIABLES
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next();
    });

    app.use('/', index);
    app.use('/users', users);
    app.use('/auth', auth);
}