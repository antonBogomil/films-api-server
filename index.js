const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 3002;
const {User} = require('./src/models/User');
/**
 *   Users
 */
app.post('/api/users/register', (req, res) => {
    const user = new User(req.body.user);
    user.save((err, doc) => {
        if (err) {
            return res.json({success: false, err})
        }
        res.status(200).json({user: doc.name})
    });
});

app.post('/api/login', (req, res) => {
    const {email, password} = req.body;
    User.findOne({email: email}, (err, user) => {
        if (!user) {
            return res.json({message: 'No user with this email!', success: false})
        }
        user.comparePassword(password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({success: false, message: 'Wrong password!'})
            }
            user.generateToken((err, user) => {
                if (err) {
                    return res.status(400).send(err)
                }
                res.cookie('auth',user.token);
            })
        })
    })
});

app.listen(port, () => {
    console.log("Server is running on port : " + port + '...');
});