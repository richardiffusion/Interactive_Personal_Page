const environment = process.env.NODE_ENV || 'development';

if (environment === 'production') {
  module.exports = require('./production');
} else {
  module.exports = require('./development');
}