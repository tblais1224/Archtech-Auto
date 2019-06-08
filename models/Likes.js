const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const LikesSchema = new Schema({
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


module.exports = Post = mongoose.model("post", PostSchema)