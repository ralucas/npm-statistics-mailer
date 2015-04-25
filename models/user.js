var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/npm-mailer');

var userSchema = mongoose.Schema({
  email: String,
  name: String,
  frequency: String,
  time: {
    type: Date,
    default: Date.now
  },
  searchTerms: Object,
  searchResults: Object
});

var User = mongoose.model('User', userSchema);

module.exports = User;
