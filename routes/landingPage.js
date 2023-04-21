const express = require('express');
const router = express.Router();

// index
router.get("/", (req, res) => {
  if (req.session && req.session.authen) {
    const user = "SELECT * FROM users WHERE user_id = ?";
    const userId = req.session.authen;
    connection.query(user, [userId], (err, rows) => {
      if (err) throw err;
      let numRows = rows.length;
      if (numRows > 0) {
        res.redirect("/collections");
      } else {
        res.render("index");
      }
    });
  } else {
    res.render("index");
  }
});


module.exports = router;