const express = require("express");
const router = express.Router();
const connection = require("../connection");
const bcrypt = require("bcrypt");



router.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

router.post("/sign-up", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let birthday = req.body.birthday;
  let genderType = req.body.typeg;

  //hash password
  const saltRounds = 10;
  bcrypt
    .hash(password, saltRounds)
    .then((hashPassword) => {
      try {
        const query = `
    INSERT INTO users (username, email, password, first_name, last_name, birthday, gender) VALUES
      (?, ?, ?, ?, ?, ?, ?)
    `;
        connection.query(
          query,
          [
            username,
            email,
            hashPassword,
            firstName,
            lastName,
            birthday,
            genderType,
          ],
          (err, results) => {
            if (err) {
              console.log(err);
            } else {
              console.log(
                `${firstName} ${lastName} ${username} ${password} ${birthday} ${genderType}`
              );
              //log user in by creating session
              req.session.user = {
                id: results.insertId,
                username: username,
                email: email,
              }
              res.redirect("/profile");
            }
          }
        );
      } catch (err) {
        console.error("Error creating user", err);
      }
    })
    .catch((err) => {
      console.error("Error hashing password", err);
    });
});

module.exports = router;
