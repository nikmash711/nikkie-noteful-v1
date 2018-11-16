'use strict';

const express = require('express');

const router = express.Router(); //creating the router 

// loads and initialize the sim database:
const data = require('../db/notes'); //load array of notes
const simDB = require('../db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this


//NOW we need to update our endpoints to use simDB methods 

//The following block of code responds to a GET request to /api/notes and returns data in JSON format.
//get/load all, and search by query if there is one
router.get('/', (req, res, next) => {
  //Destructure the query string property in to `searchTerm` constant
  const { searchTerm } = req.query; 
  
  //using the filter method that exists on the database
  notes.filter(searchTerm)
    .then(list=>{
      if (list) {
        res.json(list);
      } else {
        next();
      }
    })
    .catch(err =>{
      return next(err); // goes to error handler
    });
});

//get a single note 
router.get('/:id', (req, res, next) => {
  const {id} = req.params;

  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const {id} = req.params;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    console.log(req.body);
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
    //if it fails this test, updateObj is blank...
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.update(id, updateObj)
    .then(item=>{
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err=>{
      return next(err);
    });
});

router.post('/', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem)
    .then(item=>{
      if (item) {
        res.location(`http://${req.headers.host}/api/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    })
    .catch(err=>{
      return next(err);
    });
});



router.delete('/:id', (req, res, next)=>{
  const {id} = req.params;

  notes.delete(id)
    .then(()=>{
      res.sendStatus(204);
    })
    .catch(err=>{
      return next(err);
    });
});



module.exports = router;