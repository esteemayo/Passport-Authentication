const md5 = require('md5');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const randomstring = require('randomstring');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, 'Please Supply an email address'],
        validate: [validator.isEmail, 'Please provide a valid email adddress']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be atleast 8 characters long']
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Passwords are not the same'
        }
    },
    secretToken: {
        type: String,
        trim: true
    },
    active: {
        type: Boolean,
        default: false
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    date: {
        type: Date,
        default: Date.now,
        select: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.virtual('firstName').get(function () {
    return this.name.split(' ')[0];
});

userSchema.virtual('gravatar',).get(function() {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;

    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

userSchema.methods.createEmailSecretToken = function () {
    return this.secretToken = randomstring.generate();
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;    // 10mins

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;