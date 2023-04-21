const express = require('express');
const router = express.Router();

router.get("/profile", (req, res) => {
  res.render("profile", { session: req.session });

  const query = `SELECT
    c.collection_id,
    c.collection_name,
    c.image
  FROM
    users u
JOIN
    collection c ON u.user_id = c.user_id
WHERE
    u.user_id = 1
ORDER BY
    c.collection_id;`;
});


module.exports = router;