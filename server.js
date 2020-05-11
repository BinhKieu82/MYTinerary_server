const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require('config');


const app = express();
const port = process.env.PORT || 5000; //use port at production or 5000 for local
const db = config.get('mongoURI');

mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true })
    .then(() => console.log('Connection to Mongo DB established'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.json());
app.use(cors());

app.use('/cities',require('./routes/cities'));
app.use('/itineraries', require('./routes/itineraries'));
app.use('/itineraries/find', require('./routes/itineraries'));
app.use("/activities",require('./routes/activities'));
app.use('/comments', require('./routes/comments'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));


app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json(err);
});

app.listen(port, () => {
  console.log("Server is running on " + port + "port");
});