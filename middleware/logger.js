'use strict'; 

function requestLogger(req, res, next){
  const now = new Date();
  console.log(`${now.toLocaleDateString()} ${req.method} ${req.url}`);
  next();
}

module.exports = {requestLogger};
//this is a named export, so when we import it it has to match