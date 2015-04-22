var md5 = require('crypto').createHash('md5');

var redis = require('redis');
var _ = require('lodash');
var validator = require('validator');

var client = redis.createClient();


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

exports.registration = function(req, res, next) {
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
};


