const secret = require('../secret');
const massive = require('massive');

module.exports = massive(secret.DB_URI, {
  scripts: './models/dbScripts'
});
