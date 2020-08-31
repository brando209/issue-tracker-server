var mysql = require('mysql');
require('dotenv').config();

// Database connection setup
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_SECRET,
    database: 'trackappdb',
});

module.exports = {
    getConnection() { return connection; }
};