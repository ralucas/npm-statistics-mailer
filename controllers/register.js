var md5 = require('crypto').createHash('md5');

var redis = require('redis');
var _ = require('lodash');
var validator = require('validator');

var client = redis.createClient();

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/npm-mailer');

var userSchema = mongoose.Schema({
  email: String,
  name: String,
  frequency: String,
  time: {
    type: Date,
    default: Date.now
  }
});

var User = mongoose.model('User', userSchema);

function validate(obj) {
  
}

exports.registration = function(req, res, next) {
  var user = new User({
    email: req.body.email,
    name: req.body.first_name + ' ' + req.body.last_name,
    frequency: req.body.frequency
  });

  user.save(function(err, result) {
    if (err) {
      var error = new Error(err, err.stack);
      res.status(507).send(error);
      throw error;
    } else {
      res.status(200).send('success');
    }
  });
};


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

exports.redisRegistration = function(req, res, next) {
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


