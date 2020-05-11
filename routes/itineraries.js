const express = require('express');
const router = express.Router();
const User = require("../models/userModel");
const Itinerary = require('../models/itineraryModel');
const auth = require('../middleware/auth');

router.get('/all', auth, (req, res) => { //for testing only
  Itinerary.find({})
    .then(files => {
        res.send(files)
    })
    .catch(err => console.log(err));
});

router.route("/:id").get(auth, (req, res) => {
  Itinerary.find({ city: req.params.id }) //response the city with id matched
    .populate("city", "name") //refer to city object and city.name
    .exec((err, itineraries) => {
      if (err) {
        res
          .status(400)
          .send({
            status: 400,
            message:
              "This city does not exist, mate. How... how did you even get to this page?"
          });
        return;
      }
      res.json(itineraries); //res.json() normally used to return a nested object/array to a request from client (React server)
    });
});

router.get("/favorites/user", auth, (req, res) => {  
  User.findById(req.user.id).then((user) => {
    Itinerary.find({ _id: { $in: user.favorites } })
    .populate("city", "name")
    .exec((err, itineraries) => {
      if (err) {
        res.status(400).send(err);
        return;
      }
      //console.log('Backend itinerary userFavorites :', itineraries);  
      res.json(itineraries);
    });
  })    
});

module.exports = router;