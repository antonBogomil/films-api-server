const express = require('express');
const router = express.Router();
const {Category} = require('../models/Category');
const admin = require("../middleware/admin").admin;
const auth = require("../middleware/auth").auth;
router.post('/save', auth, admin, (req, res) => {
    const category = new Category(req.body);
    category.save((err, doc) => {
        if (err) return res.json({success: false, err});
        return res.json({success: true, category: doc});
    })
});
router.get('/all', (req, res) => {
    Category.find({}, (err, result) => {
        if (err) return res.status(400).send(err);
        res.send(result)
    })
});
module.exports = router;