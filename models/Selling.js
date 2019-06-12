const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
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
    type: Number
  },
  hours: {
    type: Number
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
    type: String
  },
  color: {
    type: String
  },
  images: [{ imageURL: { type: String, required: true } }],
  watchers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      //if like comment the user id is stored in array for the post
      likes: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "users"
          }
        }
      ],
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Selling = mongoose.model("selling", SellingSchema);
