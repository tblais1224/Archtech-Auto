const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellingSchema = new Schema({
    userId: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    comments: [{
        userId: {
            type: String
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    watching: [{
        userId: {
            type: String
        },
    }],
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = Selling = mongoose.model("selling", SellingSchema)