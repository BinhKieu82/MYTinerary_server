const express = require('express');
const router = express.Router();

const City = require('../models/cityModel');

router.get('/all', (req, res) => {
  City.find({})
    .then(files => {
        res.send(files)
    })
    .catch(err => console.log(err));
});

router.get('/:name',
	(req, res) => {
    City.findOne({ name: req.params.name })
    .then(city => {
      res.send(city) //res.send() normally used to response a text/html or simple object/array to React server (client)
    })
    .catch(err => console.log(err));
});

//postCity function will be launch later
/* router.post('/', (req, res) => {
  const newCity = new City({
    name: req.body.name,
    country: req.body.country
  })
  newCity.save() //save newCity to MongoDB
    .then(city => {
    res.status(201).send(city) //response newCity to React server
    })
    .catch(err => {
    res.status(500).send("Server error")}) 
}); */ 

module.exports = router;