// User profile
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

// define the schema for our user model
const userSchema = mongoose.Schema({ 
  name: String,
  email: String,
  password: String,  
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
    image: String
  },  
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Itinerary" }]
});


module.exports = mongoose.model("User", userSchema);
