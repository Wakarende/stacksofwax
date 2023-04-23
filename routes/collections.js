const express = require("express");
const router = express.Router();
const connection = require("../connection");
const axios = require("axios");
require("dotenv").config();

router.get("/collections", (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  axios
    .get("http://localhost:3000/api/collections", {
        headers: {
        'Cookie': req.headers.cookie
        }
    })
    .then((response) => {
      const collections = response.data;
      res.render("collections", {
        session: req.session,
        collections,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error fetching collections");
    });
});


router.get("/api/collections", (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Query to display all collections along with their associated vinyls.
  const query = `
    SELECT c.collection_id, c.collection_name, c.image as collection_image, v.vinyl_id, v.title AS vinyl_title
    FROM collection c
    LEFT JOIN vinyl_collections vc ON c.collection_id = vc.collection_id
    LEFT JOIN vinyl v ON vc.vinyl_id = v.vinyl_id;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {

      //display collections
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
        if (result.vinyl_id) {
          collections[result.collection_id].vinyls.push({
            vinyl_id: result.vinyl_id,
            vinyl_title: result.vinyl_title,
            vinyl_image: result.cover_image,
          });
        }
      });
      res.status(200).json(Object.values(collections));
    }
  });
});

module.exports = router;
