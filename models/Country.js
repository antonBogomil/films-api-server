const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        unique: 1,
        maxLength: 80,
    },
    code: {
        type: String,
        unique: 1,
        required: true
    },
    img: {
        type: String
    }
});
const Country = mongoose.model('country', countrySchema);
module.exports = {Country};