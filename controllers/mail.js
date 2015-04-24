var npm = require('npm');
var sendgrid = require('sendgrid');
var md5 = require('crypto').createHash('md5');

var redis = require('redis');
var _ = require('lodash');
var validator = require('validator');

var db = require('../services/db');

var client = redis.createClient();

exports.searchAndCache = function() {
  var daily = {frequency: 'daily'};
  db.find(daily)
    .then(function(results) {
      if (!results) return 'No results';
      if (!_.isArray(results)) results = [results];
      _.forEach(results, function(result) {
        console.log(result);
        npm.load(function(err, npm) {
          if (err) throw new Error(err, err.stack);
          console.log('hi', result.searchTerms.combined);
          npm.commands.search(result.searchTerms.combined, function(err, pkgs) {
            if (err) throw new Error(err, err.stack);
            console.log('hi2');
            console.log(pkgs);
          });
        });
      });
    });
};

var send = function() {};


