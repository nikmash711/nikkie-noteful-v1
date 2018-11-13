'use strict';

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

// The file loads and initializes the simdb, then makes 3 queries.

// 1) Find a list of notes that contains the word 'cats'

// GET Notes with search
notes.filter('cats', (err, list) => {
  if (err) {
    console.error(err);
  }
  console.log(list);
});

// 2) Find a specific note by ID
// GET Notes by ID
notes.find(1005, (err, item) => {
  if (err) {
    console.error(err);
  } //something crashed 
  if (item) {
    console.log(item);
  } else {
    console.log('not found'); //everything worked, and id didnt exist
  }
});

// 3) Update a specific note
// PUT (Update) Notes by ID
const updateObj = {
  title: 'New Title',
  content: 'Blah blah blah'
};

notes.update(1005, updateObj, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

const newItem = {
  title: 'Testing',
  content: 'Testing123'
};

//4) Try creating a note using the create() method: 
notes.create(newItem, (err, item)=>{
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

//5) try deleting an item: 
notes.delete(1005, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});