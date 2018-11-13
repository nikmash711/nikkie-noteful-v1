'use strict';

const express = require('express');

// load and initialize the sim database:
const data = require('./db/notes'); //load array of notes
const simDB = require('./db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this

//import the config module.
const  PORT = require('./config');

const {requestLogger} = require('./middleware/logger');
//. means current directory 
//have to import it with same name exported

//create an expression application
const app = express();

//create a static webserver (like running http-server)
app.use(express.static('public')); // serve static files

//use the logger middleware
app.use(requestLogger);

//NOW we need to update our endpoints to use simDB methods 

//The following block of code responds to a GET request to /api/notes and returns data in JSON format.
//get/load all, and search by query if there is one
app.get('/api/notes', (request, response, next) => {
  //Destructure the query string property in to `searchTerm` constant
  const { searchTerm } = request.query; 
  
  //using the filter method that exists on the database
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    response.json(list); // responds with filtered array
  });
});

//get a single note 
app.get('/api/notes/:id', (request, response, next) => {
  const {id} = request.params;

  notes.find(id, (err, note) => {
    if (err) {
      return next(err);
    }
    if(note){
      response.json(note);
    }
    else{
      return next();
    }
  });
});
//fail and bail -

//Common to leave this at the bottom 

//404 handling middleware - gets here after it tries to get to the other endpoints 
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
  //this sets the status to 404, and makes the .json response the error message
});

//error handling middleware
//If a runtime error occurs in an Express, it will immediately propagate to the next error handler with the method signature: app.use(function (err, req, res, next) {...}), which is this!
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err //blank?
  });
});


app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
