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
    if (this.isModified()) {
        bcript.genSalt(SALT_NUM, (err, salt) => {
            console.log(this);
            if (err) {
                return next(err)
            }
            bcript.hash(this.password, salt, (err, hash) => {
                if (err) {
                    return next(err)
                }
                this.password = hash;
                next()
            });
        })
    } else next();
});

userSchema.methods.comparePassword = function (password, callback) {
    bcript.compare(password, this.password, (err, isMatch) => {
        if (err) return callback(err);
        return callback(null, isMatch);
    });
};
userSchema.methods.generateToken = function (callback) {
    const token  = jwt.sign(this._id.toHexString(),process.env.SECRET);
    this.token = token;
    this.save((err,user)=>{
        if (err){return callback(err)}
        callback(null,user)
    })
};

const User = mongoose.model('User', userSchema);

module.exports = {User};