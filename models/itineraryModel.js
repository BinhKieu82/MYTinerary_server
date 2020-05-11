const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
  user: {
    userName: { type: String },
    picture: { type: String }
  },
  rating: { type: Number },
  price: { type: Number },
  duration: { type: Number },
  hashtags: { type: Array }
});

module.exports = mongoose.model('Itinerary', itinerarySchema)