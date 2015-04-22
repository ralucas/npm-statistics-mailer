var express = require('express');
var app = express();

var path = require('path');

var bodyParser = require('body-parser');

var routes = require('./routes');

app.use(bodyParser());

app.use(express.static(path.join(__dirname, 'client')));

routes(app);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
