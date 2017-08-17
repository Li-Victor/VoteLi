var secret = require('../secret');
var massive = require('massive');

module.exports = massive(secret.DB_URI, {
    scripts: './models/dbScripts'
});
