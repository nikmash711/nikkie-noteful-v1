'use strict';

const express = require('express');

//import morgan 
const morgan = require('morgan');

//import the router module
const notesRouter = require('./router/notes.router');

//import the config module.
const  PORT = require('./config');

//. means current directory 
//have to import it with same name exported

//create an expression application
const app = express();

//Updating a note requires access to the request body which means we need to tell the Express app to utilize the built-in express.json() middleware. The express.json() middleware parses incoming requests that contain JSON and makes them available on req.body
//parse request body
//make sure tihs is before the router module!
//QUESTION: why do we need need to put the below into notes.router.js??
app.use(express.json()); //when did i not require this? 

//logger should use dev predefined format 
app.use(morgan('dev'));

//create a static webserver (like running http-server)
app.use(express.static('public')); // serve static files

//mount router with the core path 
app.use('/api/notes', notesRouter);

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


// Listen for incoming connections

//the if statement prevents the server from automatically starting when we run the tests.
if (require.main === module) {
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app; // Export for testing
// exports the Express app so it can be required and used in your test files.