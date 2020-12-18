const crypto = require('crypto');
const passport = require('passport');
const User = require('../model/User');
const sendEmail = require('../utils/mail');
const catchErrors = require('../utils/catchErrors');

exports.login = passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true,
    successRedirect: '/dashboard',
    successFlash: 'Welcome back!'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out!');
    res.redirect('/auth/login');
}

exports.forgotPassword = catchErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        req.flash('error_msg', 'There is no user with the email address.');
        return res.redirect('/auth/forgot-password');
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/auth/reset/${resetToken}`;

    const message = `
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process: ${resetURL}</p>
        <p><a href="${resetURL}">Reset link</a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    const html = `
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process: ${resetURL}</p>
        <p><a href="${resetURL}">Reset link</a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 mins)',
            message,
            html
        });

        req.flash('success', 'You have been emailed a password reset link.');
        res.redirect('/auth/login');
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        req.flash('error', 'There was an error sending the email. Try again later.');
        res.redirect('/auth/forgot-password');
    }
});

exports.reset = catchErrors(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('back');
    }

    res.status(200).render('reset', {
        title: 'Reset your password'
    });
});

exports.resetPassword = catchErrors(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('back');
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.flash('success', '💃 Nice! Your password has been reset! You are now logged in!');
    res.redirect('/auth/login');
});

exports.loginForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/dashboard');
    
    res.status(200).render('login', {
        title: 'Log into your account!'
    });
}

exports.forgotForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/dashboard');

    res.status(200).render('forgot', {
        title: 'Forgot password'
    });
}