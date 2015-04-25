var npm = require('npm');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_KEY);
var md5 = require('crypto').createHash('md5');
var Q = require('q');

var redis = require('redis');
var _ = require('lodash');
var validator = require('validator');

var db = require('../services/db');

var client = redis.createClient();

function searchNpm(terms) {
  return Q.ninvoke(npm, "load")
    .then(function() {
      return Q.nfcall(npm.commands.search, terms);
    });
}

exports.searchAndCache = function() {
  var daily = {frequency: 'daily'};
  db.find(daily)
    .then(function(users) {
      if (!users) return 'No users';
      if (!_.isArray(users)) users = [users];
      _.forEach(users, function(user) {
        searchNpm(user.searchTerms.combined)
          .then(function() {
            db.store(user, pkgs)
              .then(function(data) {
                send(user, data)
                  .then(function(response) {
                    console.log('response: ', response);
                  });
              });
          });
      });
    }).fail(function(err) {
      console.error(err);
    }).done();
};

var send = function(user, pkgs) {

  var html = _.map(pkgs, function(pkg) {
    return _.forEach(pkg, function(val, key) {
      return '<strong>' + key + '</strong>' +
        '<span>' + val + '</span>';
    });
  });

  var params = {
    to:       [user.email],
    toname:   [user.name],
    from:     'info@rangeandroam.com',
    fromname: 'npm mailer',
    subject:  'Your ' + user.frequency + ' npm Mailer',
    html:     html, 
  };

  var email = new sendgrid.Email(params); 

  return Q.ninvoke(sendgrid, 'send', email);
};


