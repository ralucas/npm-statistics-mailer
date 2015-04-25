var Q = require('q');
var User = require('../models/user');

exports.find = function(frequency) {
  var deferred = Q.defer();

  User.find(frequency, function(err, results) {
    if (err) deferred.reject(err);
    deferred.resolve(results);
  });

  return deferred.promise;
};


exports.store = function(user, results) {
  var deferred = Q.defer();

  User.findByIdAndUpdate(user._id, 
    {searchResults: results},
    function(err, update) {
      if (err) deferred.reject(err);
      deferred.resolve(update);
  });

  return deferred.promise;
};

