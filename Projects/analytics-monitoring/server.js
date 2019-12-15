const express = require('express'),
    app = express(),
    port = 3000,
    bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'pug');

let routes = require('./routes/router');
routes(app);

app.listen(port);
console.log('Server running on: ' + port);