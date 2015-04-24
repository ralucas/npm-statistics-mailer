var Q = require('q');
var User = require('./user');

exports.find = function(frequency) {
  var deferred = Q.defer();

  User.find(frequency, function(err, results) {
    if (err) deferred.reject(err);
    deferred.resolve(results);
  });

  return deferred.promise;
};

