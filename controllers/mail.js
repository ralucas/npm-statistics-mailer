var npm = require('npm');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_KEY);
var Q = require('q');

var _ = require('lodash');
var validator = require('validator');

var db = require('../services/db');

function searchNpm(terms) {
  return Q.ninvoke(npm, "load")
    .then(function() {
      return Q.nfcall(npm.commands.search, terms);
    });
}

function createEmailHtml(objs) {
  var output = '<h1>Your npm Mailer</h1>';

  _.forEach(objs, function(obj) {
    output += '\n<h2>' + obj.name + '</h2>';
    _.forEach(obj, function(val, key) {
      output += '<p><strong>' + key + ':</strong>' +
        '<span> ' + val + '</span></p>';
    });
  });

  return output;
}

exports.searchAndCache = function() {
  var daily = {frequency: 'daily'};
  db.find(daily)
    .then(function(users) {
      if (!users) return 'No users';
      if (!_.isArray(users)) users = [users];
      _.forEach(users, function(user) {
        searchNpm(user.searchTerms.combined)
          .then(function(pkgs) {
            db.store(user, pkgs)
              .then(function(data) {
                send(data, pkgs)
                  .then(function(response) {
                    console.log('response: ', response);
                  }).fail(function(err) {
                    console.error(err, err.stack);
                  });
              });
          });
      });
    }).fail(function(err) {
      console.error(err);
    }).done();
};

var send = function(user, pkgs) {

  var html = createEmailHtml(pkgs);
  
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

