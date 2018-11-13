'use strict';

const express = require('express');

//load array of notes 
const data = require('./db/notes');

//import the config module
const { PORT } = require('./config');

//create an expression application
const app = express();

//create a static webserver (like running http-server)
app.use(express.static('public')); // serve static files

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

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
