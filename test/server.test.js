'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('GET /api/notes', function(){
  it('GET request to notes should return and list all the notes', function(){
    return chai.request(app)
      .get('/api/notes')
      .then(function(res){
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        //should return the default of 10 Notes as an array:
        expect(res.body.length).to.be.at.least(10);
        //should return an array of objects with the id, title and content:
        const expectedKeys = ['id', 'title', 'content'];
        res.body.forEach(function(note) {
          expect(note).to.be.a('object');
          expect(note).to.include.keys(expectedKeys);
        });
      });
  });

  it('GET request should return correct search results for a valid query', function(){
    const searchTerm = 'boring';
    return chai.request(app)
    //is it okay that this is hardcoded?
      .get(`/api/notes/?searchTerm=${searchTerm}`)
      .then(function(res){
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        
        //make sure title of each includes the search term
        res.body.forEach(function(note) {
          expect(note.title).includes(`${searchTerm}`);
        });
      });
  });

  it('GET request should return an empty array for an incorrect query', function(){
    const searchTerm = 'erqerrew';
    return chai.request(app)
    //is it okay that this is hardcoded?
      .get(`/api/notes/?searchTerm=${searchTerm}`)
      .then(function(res){
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        //make sure array is empty: 
        expect(res.body.length).equals(0);
      });
  });
});

describe('GET /api/notes/:id', function(){
  it('GET request with a valid id should return correct note object', function(){
    const id = 1001;
    return chai.request(app)
      .get(`/api/notes/${id}`) //why dont we need a colon here (thats just a placeholder in router)
      .then(function(res){
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        // console.log("LOOK", res.body);
      });
  });
  it('GET request with an invalid id should return a 404 error', function(){
    const id = 'INVALID';
    return chai.request(app)
      .get(`/api/notes/${id}`) 
      .then(function(res){
        expect(res).to.have.status(404);
        // console.log("LOOK", res.body);
      });
  });
});

describe('POST /api/notes', function(){
  it('POST request should create and return a new item with location header when provided valid data', function(){
    const newNote = {'title': 'Test', 'content': 'testing123'};
    return chai.request(app)
      .post('/api/notes/') 
      .send(newNote)
      .then(function(res){
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.not.equal(null);
        // response should be deep equal to `newNote` from above if we assign
        // `id` to it from `res.body.id`
        expect(res.body).to.deep.equal(
          Object.assign(newNote, { id: res.body.id })
        );
      });
  });

  it('POST request should return an object with a message property "Missing title in request body" when missing "title" field', function(){
    const newNote = {'content': 'testing123'};
    return chai.request(app)
      .post('/api/notes/')
      .send(newNote)
      .then(function(res){
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
        // response should be deep equal to `newNote` from above if we assign
        // `id` to it from `res.body.id`
      });
  });
});