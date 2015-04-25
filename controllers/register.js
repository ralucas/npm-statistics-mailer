var _ = require('lodash');
var validator = require('validator');
var User = require('../models/user');
var mail = require('./mail');

function validate(obj) {
  
}

function searchTerms(obj) {
  var output = {
    combined: []
  };

  _.forEach(obj, function(val, key) {
    if (/search/.test(key)) {
      var term = key.split('-').pop();
      
      output.combined.push(val);

      if (output[term]) {
        if (_.isString(output[term])) {
          output[term] = [output[term], val];
        } else {
          output[term].push(val); 
        }
      } else {
        output[term] = val;
      }
    }
  });
  return output;
}

exports.registration = function(req, res, next) {
  var user = new User({
    email: req.body.email,
    name: req.body.first_name + ' ' + req.body.last_name,
    frequency: req.body.frequency,
    searchTerms: searchTerms(req.body)
  });

  user.save(function(err, result) {
    if (err) {
      var error = new Error(err, err.stack);
      res.status(507).send(error);
      throw error;
    } else {
      console.log(result);
      mail.searchAndCache();
      res.status(200).send({message: 'success', result: result});
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


