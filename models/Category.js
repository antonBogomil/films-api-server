const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        unique: 1,
        maxLength: 100,
    },
    description: {
        type: String,
    },
    img: {
        type: String
    }
});
const Category = mongoose.model('category', categorySchema);
module.exports = {Category};