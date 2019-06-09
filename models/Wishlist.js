const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const WishlistSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
    },
    model: {
        type: String,
    },
    manufacturer: {
        type: String,
    },
    sellingId: {
        type: String
    },

});


module.exports = Wishlist = mongoose.model("wishlist", WishlistSchema)