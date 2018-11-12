'use strict';

const express = require('express');

const data = require('./db/notes');

const app = express();

app.use(express.static('public')); // serve static files

//The following block of code responds to a GET request to /api/notes and returns data in JSON format.
app.get('/api/notes', (request, response) => {
  const searchTerm = request.query.searchTerm; // retrieve the searchTerm from the query-string on the req.query object. 
  if(searchTerm){
    response.json(data.filter(note=>note.content.includes(searchTerm) || note.title.includes(searchTerm)
    ));
    console.log(searchTerm);
    //if the title or content includes the searchTerm, filter the data by that
    return;
  }
  response.json(data);
});

/**
   * Terse solution
   */
// const { searchTerm } = req.query;
// res.json(searchTerm ? data.filter(item => item.title.includes(searchTerm)) : data);

app.get('/api/notes/:id', (request, response) => {
  const note = data.find(note => note.id === Number(request.params.id)); //its a string, and we need to make it a number 
  response.json(note);
  // response.json(data[Number(request.params.id)]); WHY DOESNT THIS WORK 
});

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
