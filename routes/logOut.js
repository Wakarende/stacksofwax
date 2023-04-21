const express = require('express');
const router = express.Router();


router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/");
    });
  }
});

module.exports = router;