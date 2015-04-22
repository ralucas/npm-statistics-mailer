var register = require('../controllers/register.js');

module.exports = function(app) {

  app.post('/register', register.registration);

};
