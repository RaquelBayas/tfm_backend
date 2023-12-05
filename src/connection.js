const mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

connection.connect((err) => {
  if (!err) {
    console.log("Connected to Database PORT: "+process.env.DB_PORT);
  } else {
    console.log("Error db: ", err);
  }
});

module.exports = connection;
