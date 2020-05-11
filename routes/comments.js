const express = require("express");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const router = express.Router();
const auth = require('../middleware/auth');

router.get("/:cityId", auth, (req, res) => {
  Comment.find({ city: req.params.cityId })
    .populate("city", "name")
    .populate("itinerary", "title")
    .exec((err, comments) => {
      //we send the comments sorted by date, so the newest ones goes on top
      res.json(comments.sort((a, b) => a.date < b.date));
    });
});

router.get("/find/:id", auth, (req, res) => {
  Comment.find({ _id: req.params.id }, (err, comment) => { //commentId from component Comments
      res.json(comment);
    });
  })
  .delete("/find/:id", auth, (req, res) => {
    User.findById(req.user.id).then((user) => {
      Comment.findById(req.params.id, (err, comment) => {
        //console.log('Comment Backend:req.params.name:', user.name);
        if (comment.user.name === user.name) { //comment._id == req.params.id could be better
          comment.remove(err => { //delete comment
            if (err) {
              res.status(500).send(err);
            } else {
              //202 accepted
              res.status(202).send("Comment deleted.");
            }
          });
        } else {
          res.status(401).send("You are not authorized to delete this comment.");
        }
      });
    })
  });

router.get("/", auth, (req, res) => {
  Comment.find({})
      .populate("city", "name")
      .populate("itinerary", "title")
      .exec((err, comments) => {
        res.json(comments);
      });
  })
  .post("/", auth, (req, res) => {
    let comment = new Comment({
      ...req.body
    });
    comment.save();
    res.status(201).send(comment);
  });

module.exports = router;
