const path = require('path');
const xss = require('xss-clean');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const expressLayout = require('express-ejs-layouts');
const mongoSanitize = require('express-mongo-sanitize');
// const passport = require('passport-session');

const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/errorController');
const viewRouter = require('../routes/view');
const userRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const helpers = require('../helpers');

module.exports = app => {
    // Ejs
    app.use(expressLayout);
    app.set('view engine', 'ejs');
    
    // Serving static files
    app.use(express.static(path.join(`${__dirname}/../public`)));

    if (app.get('env') === 'development') {
        app.use(morgan('dev'));
    }

    // Passport config
    require('../config/passport')(passport);

    // Body parser
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Data sanitization against nosql query injection
    app.use(mongoSanitize());

    // Data sanitize against xss
    app.use(xss());

    // Express session
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Connect flash
    app.use(flash());

    // Global variables
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        res.locals.h = helpers;
        next();
    });

    app.use('/', viewRouter);
    app.use('/users', userRouter);
    app.use('/auth', authRouter);

    app.all('*', (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    });

    app.use(globalErrorHandler);
}