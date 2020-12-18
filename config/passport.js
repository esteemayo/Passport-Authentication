const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../model/User');

module.exports = passport => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Match user
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Incorrect email or password' });
                }

                // Match / validate password
                bcrypt.compare(password, user.password, (err, isValid) => {
                    if (err) throw err;

                    if (!isValid) {
                        return done(null, false, { message: 'Incorrect email or password' });
                    }

                    // Check if account has been verified
                    if (!user.active) {
                        return done(null, false, { message: 'You need to verify email first' });
                    }

                    return done(null, user);
                });
            });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}