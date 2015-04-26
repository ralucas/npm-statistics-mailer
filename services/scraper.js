var request = require('request');
var cheerio = require('cheerio');

var baseUrl = 'https://www.npmjs.com/';

var handleResponse = function(error, response, body) {
  if (error) throw new Error(error, error.stack);
  if (response.statusCode === '200') {
    $ = cheerio.load(body);
    return $;
  } else {
    return new Error('Error in HTTP Request: ' + response.statusCode);
  }
};

var handleFailure = function(error) {
  console.error(error, error.stack);
  return new Error(error, error.stack);
};

var getAuthorPackageUrls = function($) {
  var packageUrls = [];
  $('.collaborated-packages li a').each(function(i, el) {
    var url = $(el).attr('href');
    packageUrls.push(url); 
  });
  return packageUrls;
};

var createPackagePromises = function(hrefs) {
  var promises = [];
  _.forEach(hrefs, function(href) {
    var url = baseUrl + href; 
    promise.push(Q.nfcall(request, 'get', url)); 
  });
  return promises;
};

var handlePackagePromises = function(promises) {
  return Q.all(promises);
};

exports.author = function(author) {
  var url = baseUrl + '~' + author;

  return Q.nfcall(request, 'get', url)
    .then(handleResponse)
    .then(getAuthorPackageUrls)
    .then(createPackagePromises)
    .fail(handleFailure)
    .done();
};

exports.packageName = function(packageName) {
  var url = baseUrl + '/package/' + packageName;
  
  pkgPromises = getPackageData(url);
  return Q.all(pkgPromises)
  
};


