const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const LikeSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    postId: {
        type: String
    },
    sellingId: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = Like = mongoose.model("like", LikeSchema)