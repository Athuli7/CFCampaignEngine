//Includes
var express = require('express');
var morgan = require('morgan');
//Vars
var app = express();

//Routes
var api = require('./routes/api');

//Configs


//Express Setup
app.use(express.static('public'));
app.use(morgan('dev'));

//Routing
app.use('/api', api);

app.listen(9004, function () {
  console.log('Example app listening on port 9004!');
});
