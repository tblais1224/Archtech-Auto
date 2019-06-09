const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellingSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    mileage: {
        type: Number,
    },
    hours: {
        type: Number,
    },
    condition: {
        type: String
    },
    chargeTime: {
        type: String
    },
    range: {
        type: String
    },
    drive: {
        type: String
    },
    //0 to 60 time
    acceleration: {
        type: String
    },
    topSpeed: {
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: String,
    },
    color: {
        type: String
    },
    commentId: {
        type: String
    },
    likeId: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = Selling = mongoose.model("selling", SellingSchema)