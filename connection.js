const mysql2 = require("mysql2");

//Imports connection.js module - database connection
const connection = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 10,
    port:  process.env.DB_PORT,
    
});

module.exports = connection;