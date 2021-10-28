// This file contains database credentials and code to connect to database.

const mysql = require("mysql");

const db = mysql.createConnection({
  host: "squadunt.cu0nmp10zptn.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "SquadUNT",
  database: "squad",
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("DB Successfully connected");
  }
});

module.exports = db;
