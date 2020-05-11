const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
  itinerary: { type: mongoose.Schema.Types.ObjectId, ref: "Itinerary" },
  image: { type: String },
  alt: { type: String }
});
module.exports = mongoose.model("Activity", activitySchema);
