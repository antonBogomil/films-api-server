const express = require("express");
const auth = require("../middleware/auth").auth;
const admin = require("../middleware/admin").admin;
const router = express.Router();
const {ROLE_ADMIN, COOKIE_TOKEN, ERRORS} = require("../constants");
const {User} = require("../models/User");
router.get('/auth', auth,(req, res) => {
    res.status(200).json({
        isAdmin: req.user.role === ROLE_ADMIN,
        isAuth: true,
        email: req.user.email,
        name: req.user.name
    })
});
router.post('/register', auth, admin, (req, res) => {
    const user = new User(req.body.user);
    user.save((err, doc) => {
        if (err) {
            return res.json({success: false, err})
        }
        res.status(200).json({success: true})
    });
});
router.get('/logout',auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ''}, (err, doc) => {
        if (err) return res.json({err, success: false});
        return res.status(200).send({
            success: true
        })
    })
});
router.post('/login', (req, res) => {
    const {email, password} = req.body;
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
module.exports = router;