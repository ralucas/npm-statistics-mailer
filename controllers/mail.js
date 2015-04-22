var npm = require('npm');
var sendgrid = require('sendgrid');
var md5 = require('crypto').createHash('md5');

var redis = require('redis');
var _ = require('lodash');
var validator = require('validator');

var client = redis.createClient();

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/npm-mailer');

var findDaily = function() {};

var findDailyandWeekly = function() {};

var findAll = function() {};

var searchAndCache = function() {};

var send = function() {};



