//routes/user.js will generate a token during user registration, which then used in auth.js for authentication
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Itinerary = require('../models/itineraryModel');
const auth = require('../middleware/auth');

const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken'); //token stored in www.jwt.io service for a specific time, not in MongoDB

/* GET users listing. Testing only */
router.get("/", auth, function(req, res, next) {
  res.send("respond with a resource");
});

/* GET user profile. */
router.get("/profile", auth, function(req, res, next) {
  res.send(req.user);
});

/* POST user */
router.post("/", function(req, res, next) { //signup backend route
  const { name, email, password } = req.body;
  if(!name || !email || !password) { //simple validation input fields
    return res.status(400).json({ msg: 'Please fill up all your fields' }); 
  }
  User.findOne({ email }) //validate whether email existed or not
    .then(user => {
      if(user) return res.status(400).json({ msg: 'User already exists' });
      const newUser = new User ({        
        name,
        email,
        password          
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {
              jwt.sign( //response a token to client when client register user
                { id: user.id }, //token should engage with user.id (unique value)
                config.get('jwtSecret'), //using jwtSecret text in /config/default.json to create a token
                { expiresIn: 3600 }, //token lasts within 1 hour
                (err, token) => {
                  if(err) throw err;
                  res.json ({ //return data back to browser
                    token, //token: token - response the token a long with user info to client which can see on Postman/post method
                    user: {                  
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      favorites: user.favorites //missing causing auth.favorites undefine in Heart component & register               
                    }
                  });
                }
              )
            })
        })
      })
    })
});

router.route("/favorites").put(auth, (req, res) => { //update the userModel
  console.log('Backend user favorites:', req.user);   
  User.findOne({ _id: req.user.id})
    .then((user) => {
      let isInArray = user.favorites.some(iti =>
        iti == req.body.itinerary //id of itinerary requested from client
      );
      //console.log('Backend Favorites status:', isInArray);
      
      if(isInArray) {
        console.log('Backend Favorites remove:', req.body.itinerary);
        User.findByIdAndUpdate(req.user.id, {
          $pull: { //remove an id from itinerary array of userModel
            favorites: req.body.itinerary
          }
        }).then(currentUser => {
          res.status(202).send(req.body.itinerary);
        }).catch(err => {res.send(err)});
      } else{
        console.log('Backend Favorites add:', req.body.itinerary);
        User.findByIdAndUpdate(req.user.id, {
          favorites: [...user.favorites, req.body.itinerary]
        }).then(currentUser => {
          res.status(201).send(req.body.itinerary);
        }).catch(err => {res.send(err)});
      }
  });
});

module.exports = router;
