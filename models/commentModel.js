const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const commentSchema = new Schema({
  user: {
    name: { type: String },
    photo: { type: String }
  },
  itinerary: { type: Schema.Types.ObjectId, ref: "Itinerary" },
  message: { type: String },
  date: {
    type: Date,
    default: Date.now()
  },
  city: { type: Schema.Types.ObjectId, ref: "City" }
});
module.exports = commentModel = mongoose.model("Comment", commentSchema);
