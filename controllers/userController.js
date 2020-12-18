const _ = require('lodash');
const User = require('../model/User');
const sendEmail = require('../utils/mail');
const catchErrors = require('../utils/catchErrors');

exports.register = catchErrors(async (req, res, next) => {
    const newUser = _.pick(req.body, ['name', 'email', 'password', 'confirmPassword', 'passwordChangedAt']);

    const user = await User.create(newUser);

    const secretToken = user.createEmailSecretToken();
    await user.save();

    const message = `
        Hi ${user.firstName},
        Please verify your email by typing the following token: ${secretToken}
        On the following page: <a href="${req.protocol}://${req.get('host')}/users/verify">${req.protocol}://${req.get('host')}/users/verify</a>
        Have a pleasant day!
    `;

    const html = `
        <h3>Hi ${user.firstName},</h3>
        <p>Please verify your email by typing the following token: ${secretToken}</p>
        <p>On the following page: <a href="${req.protocol}://${req.get('host')}/users/verify">${req.protocol}://${req.get('host')}/users/verify</a></p>
        <p>Have a pleasant day!</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Please verify your email address!',
            message,
            html
        });
    } catch (err) {
        user.secretToken = undefined;
        await user.save();

        req.flash('error', 'There was an error sending the email. Try again later.');
        res.redirect('/users/register');
    }

    next();
});

exports.verify = catchErrors(async (req, res, next) => {
    // find the account that matches the secret token
    const user = await User.findOne({ secretToken: req.body.secretToken });

    if (!user) {
        req.flash('error_msg', 'No user found or invalid token.');
        return res.redirect('/users/verify');
    }

    user.active = true;
    user.secretToken = undefined;
    await user.save();

    req.flash('success_msg', 'Thank you! Now you may login.');
    res.redirect('/auth/login');
});

exports.registerForm = (req, res) => {
    if (req.isAuthenticated()) return redirect('/dashboard');

    res.status(200).render('register', {
        title: 'Create your account!'
    });
}

exports.verifyForm = (req, res) => {
    if (req.isAuthenticated()) return redirect('/dashboard');

    res.status(200).render('verify', {
        title: 'Verify your email address!'
    });
}