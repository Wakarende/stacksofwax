const express = require('express');
const router = express.Router();

//Imports connection.js module - database connection
const connection = require("../connection");

router.get("/collections", (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  const uid = req.session.user.user_id;
  // console.log(uid);
  const user = "SELECT * FROM users WHERE user_id = ?";
  connection.query(user, [uid], (err, row) => {
    // console.log(uid);
    if (err) throw err;
    const firstrow = row[0];

    // display collection along with their associated vinyls.
    const query = `
      SELECT c.collection_id, c.collection_name, c.image as collection_image, v.vinyl_id, v.title AS vinyl_title
      FROM collection c
      LEFT JOIN vinyl_collections vc ON c.collection_id = vc.collection_id
      LEFT JOIN vinyl v ON vc.vinyl_id = v.vinyl_id;
    `;

    connection.query(query, (err, results) => {
      if (err) {
        console.error(err);
      } else {
        const collections = {};
        results.forEach((result) => {
          if (!collections[result.collection_id]) {
            collections[result.collection_id] = {
              collection_id: result.collection_id,
              collection_name: result.collection_name,
              collection_image: result.collection_image,
              vinyls: [],
            };
          }
        });

        console.log(firstrow);
        res.render("collections", {
          session: req.session,
          collections: Object.values(collections),
        });
      }
    });
  });
});

module.exports = router;