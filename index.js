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

function createHsetArgs(obj, id) {
  var output = [['hmset', id]];

  _.forEach(obj, function(val, key) {
    if (!/parameter/.test(key)) {
      output[0].push(key, val);
    } else if (key !== 'parameter') {
      var params = key.split(':');
      output.push(['hmset', id + ':' + params[0], params[1], val]);
    }
  });
  return output;
}

app.post('/register', function(req, res) {
  var email = req.body.email; 
  var user = _.extend(req.body, {time: new Date().getTime()});

  md5.update(email, 'utf8');
  var id = md5.digest('hex');

  var commandArgs = createHsetArgs(user, id); 

  client.exists(id, function(err, exists) {
    if (exists) {
      res.status(401).send('exists');
    } else {
      client.multi(commandArgs)
        .exec(function(err, result) {
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
