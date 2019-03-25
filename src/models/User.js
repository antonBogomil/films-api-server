const mongoose = require('mongoose');
const bcript = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_NUM = 10;
require('dotenv').config();

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    name: {
        type: String,
        required: true,
        maxLength: 100
    },
    films: {
        type: Array,
        default: []
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    }

});
userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcript.genSalt(SALT_NUM, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcript.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next()
            });
        })
    } else next();
});

userSchema.methods.comparePassword = function (password, callback) {
    const user = this;
    bcript.compare(password, user.password, function (err, isMatch) {
        if (err) return callback(err);
        return callback(null, isMatch);
    });
};
userSchema.methods.generateToken = function (callback) {
    const token = jwt.sign(this._id.toHexString(), process.env.SECRET);
    this.token = token;
    this.save((err, user) => {
        if (err) {
            return callback(err)
        }
        callback(null, user)
    })
};
userSchema.statics.findByToken = function (token, callback) {
    jwt.verify(token, process.env.SECRET, function (err, decode) {
        User.findOne({"_id": decode, "token": token}, (err, user) => {
            if (err) return callback(err);
            callback(null, user)
        })
    });
};
const User = mongoose.model('User', userSchema);

module.exports = {User};