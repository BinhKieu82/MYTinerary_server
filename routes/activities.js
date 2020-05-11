const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');

const Activity = require("../models/activityModel");

router.route("/:id").get(auth, (req, res) => {
  Activity.find({ city: req.params.id })
    .populate("itinerary", "title")
    .populate("city", "name")
    .exec((err, activities) => {
      res.json(activities);
    });
});

router.route("/").get(auth, (req, res) => {
  Activity.find({}, (err, activities) => {
    res.json(activities);
  });
});
module.exports = router;
