const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//create schema
const ProfileSchema = new Schema({
    handle: {
        type: String,
        required: true,
        max: 30
    },
    bio: {
        type: String,
    },
    // SellingId: {
    //     type: String
    // },
    userId: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})



module.exports = Profile = mongoose.model("profile", ProfileSchema)