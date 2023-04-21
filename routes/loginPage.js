const express = require('express');
const router = express.Router();

//Imports connection.js module - database connection
const connection = require("../connection");

//hash passwords
const bcrypt = require("bcrypt");


//Login
router.get("/login", (req, res) => {
  res.render("login");
});

//check login
router.post("/login", (req, res) => {
  const usernameOrEmail = req.body.usernameOrEmail;
  const password = req.body.password;

  const query = "SELECT * FROM users WHERE email = ? OR username = ?";

  connection.query(
    query,
    [usernameOrEmail, usernameOrEmail],
    (err, rows, fields) => {
      if (err) {
        console.error(err);
      }

      if (rows.length > 0) {
        const user = rows[0];

        // Compare the provided password with the stored hash using bcrypt
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
            return;
          }

          if (match) {
            //set user information in the session
            req.session.user = {
              id: user.user_id,
              username: user.username,
              email: user.email,
            };
            //debugging
            console.log("Session object:", req.session.user);
            res.redirect("/collections");
          } else {
            //incorrect password
            res.status(401).json({ message: "Incorrect password" });
          }
        });
      } else {
        //user not found
        res.status(404).json({ message: "User not found" });
      }
    }
  );
});

module.exports = router;