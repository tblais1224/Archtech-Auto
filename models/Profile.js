const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//create schema
const ProfileSchema = new Schema({
    handle: {
        type: String,
        required: true,
        max: 30
    },
    skills: {
        type: [String]
    },
    bio: {
        type: String,
    },
    SellingId: {
        type: String,
        required: true
    },
    userId: {
        type: String
    },
    postId: {
        type: String,
        required: true
    },
    wishlist: [{
        item: {
            type: String,
            required: true
        },
        manufacturer: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        price: {
            type: Number,
            required: true
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
})



module.exports = Profile = mongoose.model("profile", ProfileSchema)