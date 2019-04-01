const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const filmSchema = Schema({
    name: {
        required: true,
        type: String,
        maxLength: 150,
    },
    description: {
        type: String,
    },
    year: {
        type: Number
    },
    rating: {
        type: Number,
    },
    img: {
        type: String
    },
    country: [
        {
            type: Schema.Types.ObjectId,
            ref: 'country',
            required: true,
        }
    ],
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: 'category',
            required: true,
        }
    ],
}, {timestamps: true});

const Film = mongoose.model('film', filmSchema);
module.exports = {Film};