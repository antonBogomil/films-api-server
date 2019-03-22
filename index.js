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

const {User} = require('./src/models/user');
/**
 * Users
 */
app.post('/api/users/register', (req, res) => {
    const users = req.body.users || [];
    users.forEach((u) => {
        const user = new User(u);
        user.save();
    })
});

app.listen(port, () => {
    console.log("Server is running on port : " + port + '...');
});