const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const admin = require("./src/middleware/admin").admin;
const ROLE_ADMIN = require("./src/constants").ROLE_ADMIN;
const {COOKIE_TOKEN, ERRORS} = require("./src/constants");
const {User} = require('./src/models/User');
const {auth} = require('./src/middleware/auth');
const {Category} = require('./src/models/Category');
require('dotenv').config();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log("Server is running on port : " + port + '...');
});


app.post('/api/films/category/save', auth, admin, (req, res) => {
    const category = new Category(req.body);
    category.save((err, doc) => {
        if (err) return res.json({success: false, err});
        return res.json({success: true, category: doc})
    })
});


/*
* Middleware
*/
app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        isAdmin: req.user.role === ROLE_ADMIN,
        isAuth: true,
        email: req.user.email,
        name: req.user.name
    })
});
app.post('/api/users/register', auth, admin, (req, res) => {
    const user = new User(req.body.user);
    user.save((err, doc) => {
        if (err) {
            return res.json({success: false, err})
        }
        res.status(200).json({success: true})
    });
});
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ''}, (err, doc) => {
        if (err) return res.json({err, success: false});
        return res.status(200).send({
            success: true
        })
    })
});
app.post('/api/users/login', (req, res) => {
    const {email, password} = req.body;
    console.log(email);
    User.findOne({email: email}, (err, user) => {
        if (!user) return res.json({message: ERRORS.EMAIL_NOT_FOUND, success: false});
        user.comparePassword(password, (err, isMatch) => {
            if (!isMatch) return res.json({success: false, message: ERRORS.WRONG_PASSWORD});
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie(COOKIE_TOKEN, user.token).status(200).json({
                    success: true,
                });
            })
        })
    })
});


