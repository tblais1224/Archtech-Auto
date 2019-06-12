const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  handle: {
    type: String,
    required: true,
    max: 30
  },
  bio: {
    type: String
  },
  selling: [{ sellingId: { type: String, required: true } }],
  sellerRatings: [
    {
      userId: { type: String, required: true },
      text: { type: String, required: true },
      rating: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    }
  ],
  wishlist: [
    {
      sellingId: { type: String },
      model: { type: String },
      manufacturer: { type: String },
      description: { type: String }
    }
  ],
  watching: [{ sellingId: { type: String, required: true } }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
