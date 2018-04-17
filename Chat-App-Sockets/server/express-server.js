const path = require('path');
const http = require('http');
const express = require('express');


var app = express();
var server = http.createServer(app);
const initExpress=()=>{
  app.use(express.static(path.join(__dirname, '../public')));
};

module.exports={server, initExpress}

