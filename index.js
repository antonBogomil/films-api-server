
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3002;
require('dotenv').config();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
require('./config/db')();
require('./routes')(app);

app.listen(port, () => {
    console.log("Server is running on port : " + port + '...');
});


//
//
// app.post('/api/country/save', auth, admin, (req, res) => {
//     const country = new Country(req.body);
//     country.save((err, doc) => {
//         if (err) return res.json({success: false, err});
//         return res.json({success: true, country: doc})
//     })
// });
//
