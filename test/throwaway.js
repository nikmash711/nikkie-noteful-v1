// 'use strict';

// describe('PUT /api/notes/:id', function(){
//   it('PUT request should update and return a note object when given valid data', function(){
//     const id = 1001;
//     const updatedNote = {'title': 'testing', 'content': 'testing1234'};
//     return chai.request(app)
//       .put(`api/notes/${id}`)
//       .send(updatedNote)
//       .then(function(res){
//         expect(res).to.be.json;
//         expect(res.body).to.be.a('object');
//         expect(res.body).to.include.keys('id', 'title', 'content');
//         expect(res.body.id).to.not.equal(null);
//       });
//   });
// });