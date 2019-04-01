const express = require("express");
const admin = require("../middleware/admin").admin;
const auth = require("../middleware/auth").auth;
const Film = require("../models/Film").Film;
require('../models/Country');
require('../models/Category');
const mongoose = require('mongoose');
const router = express.Router();




router.get('/',(req, res) => {
    let type = req.query.type;
    let items = req.query.id;
    if (type === 'array') {

        let ids = req.query.id.split(',');
        items = ids.map((item) => {
            return mongoose.Types.ObjectId(item)
        })
    }
    Film
        .find({'_id': {$in: items}})
        .populate('country')
        // .populate('category')
        .exec((err, docs) => {
            if (err) return res.status(404).send(err);
            res.status(200).send(docs);
        })
});
router.post('/save', auth, admin, (req, res) => {
    const film = new Film(req.body);
    film.save((err, doc) => {
        if (err) return res.json({success: false, err});
        return res.json({success: true, film: doc})
    })
});

router.get('/all', (req, res) => {
    Film.find({}, (err, result) => {
        if (err) return res.status(400).send(err);
        res.send(result)
    })
});
module.exports = router;