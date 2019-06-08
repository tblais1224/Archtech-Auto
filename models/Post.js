const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//this is a model for creating posts with a like and comment feature
//the posts will not delete if user deletes profile
//create Schema
const PostSchema = new Schema({
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
    //if like post the user id is stored in array for the post
    likes: [{
        userId: {
            type: String
        },
    }],
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
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = Post = mongoose.model("post", PostSchema)