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

//NOW we need to update our endpoints to use simDB 

//The following block of code responds to a GET request to /api/notes and returns data in JSON format.
//get all and search by query 
app.get('/api/notes', (request, response) => {
  // Basic JSON response (data is an array of objects)
  // res.json(data);

  //Destructure the query string property in to `searchTerm` constant
  const searchTerm = request.query.searchTerm; // retrieve the searchTerm from the query-string on the req.query object. 

  //if search term exists, and the title or content includes the searchTerm, filter the data by that. If searchTerm isnt found, return nothihng. If there's no search term, return the data unfiltered
  if(searchTerm){
    response.json(data.filter(note=>note.content.includes(searchTerm) || note.title.includes(searchTerm)
    ));
  }
  else{
    response.json(data);
  }
});

/**
   * Terse solution
   */
// const { searchTerm } = req.query;
// res.json(searchTerm ? data.filter(item => item.title.includes(searchTerm)) : data);

//get a single note 
app.get('/api/notes/:id', (request, response) => {
  const note = data.find(note => note.id === Number(request.params.id)); //its a string, and we need to make it a number 
  response.json(note);
  // response.json(data[Number(request.params.id)]); WHY DOESNT THIS WORK  
});

//purposely making a runtime error: 
// app.get('/boom', (req, res, next) => {
//   throw new Error('Boom!!');
// });

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
