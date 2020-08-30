var mysql = require('mysql');
require('dotenv').config();

// Database connection setup
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_SECRET,
    database: 'trackappdb',
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to database!");
});
