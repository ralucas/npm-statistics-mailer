var express = require('express');
var app = express();

var path = require('path');
var md5 = require('crypto').createHash('md5');

var npm = require('npm');
var redis = require('redis');
var _ = require('lodash');
var validator = require('validator');

var bodyParser = require('body-parser');

var client = redis.createClient();

app.use(bodyParser());

app.use(express.static(path.join(__dirname, 'client')));

function validate(obj) {
  
}

app.post('/register', function(req, res) {
  console.log(req.body);
  var email = req.body.email; 

  var command = _.map()

  md5.update(email, 'utf8');
  var id = md5.digest('hex');

  client.exists(id, function(err, exists) {
    if (exists) {
      res.status(401).send('exists');
    } else {
      client.hset(id, function(err, result) {
        if (err) throw new Error(err);
        res.status(200).send('success');
      });
    }
  });

});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
