//import mysql
let mysql = require("mysql");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "stacksofwax",
  port: "3306",
});

db.connect((err) => {
  if (err) throw err;
  console.log("database connected successfully");
});

//import bcrypt
const bcrypt = require("bcrypt");
const password1 = "password";
const password2 = "password_2";

const saltRounds = 10;

bcrypt.hash(password1, saltRounds, (err, hash1) => {
  if (err) {
    // Handle error
  }

  bcrypt.hash(password2, saltRounds, (err, hash2) => {
    if (err) {
      // Handle error
    }

    const sql = `
    INSERT INTO users (username, email, password, first_name, last_name, date_of_birth, country_id) VALUES
      ('johndoe', 'johndoe@example.com', '${hash1}', 'John', 'Doe', '1990-01-01', 1),
      ('janedoe', 'janedoe@example.com', '${hash2}', 'Jane', 'Doe', '1985-05-15', 2);
    `;

    

   
      db.query(sql, (error, results, fields) => {
        if (error) {
          // Handle error
          console.error(error);
        } else {
          console.log("User data inserted successfully");
        }

        db.end();
      });
    });
  });
});
