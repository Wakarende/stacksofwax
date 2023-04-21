const express = require('express');
const router = express.Router();


router.get("/sign-up", (req, res) => {
  res.render("sign-up");
});


module.exports = router;
