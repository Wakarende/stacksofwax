const express = require("express");
const router = express.Router();
const axios = require("axios");
const connection = require("../connection");

router.get("/profile", (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
  }else{
    const userId = req.session.user.id;
    axios
      .get(`http://localhost:3000/api/profile/${userId}`, {
        headers: {
          Cookie: req.headers.cookie,
        },
      })
      .then((response) => {
        const {collections, uniqueVinyls}= response.data;
        res.render("profile", {
          session: req.session,
          collections,
          uniqueVinyls,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
});

router.get("/api/profile/:id", (req, res) => {
  const userId = req.session.user.id;
  const query = `
  SELECT  DISTINCT * FROM collection
  INNER JOIN users ON users.user_id = collection.user_id
  INNER JOIN vinyl ON vinyl.user_id = collection.user_id
  INNER JOIN track ON track.vinyl_id = vinyl.vinyl_id
  INNER JOIN artist ON artist.artist_id = vinyl.artist_id
  WHERE users.user_id = ?
  ORDER BY collection.collection_id;
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      //display vinyls and collections
      const collections = [];

      //unique ids to remove duplicates in array
      const uniqueCollectionId = [];
      const uniqueVinylId = [];
      const uniqueVinyls = [];

      results.forEach((item) => {
        if (!uniqueCollectionId.includes(item.collection_id)) {
          uniqueCollectionId.push(item.collection_id);
          collections.push({
            collection_id: item.collection_id,
            collection_name: item.collection_name,
            collection_image: item.image,
            vinyls: [],
          });
        }
        if (item.vinyl_id && !uniqueVinylId.includes(item.vinyl_id)) {
           uniqueVinylId.push(item.vinyl_id);
           uniqueVinyls.push({
             vinyl_id: item.vinyl_id,
             vinyl_title: item.title,
             vinyl_image: item.cover_image,
           });
         }
      });

      res
        .status(200)
        .json({
          collections: Object.values(collections),
          uniqueVinyls: uniqueVinyls,
        });

    }
  });
});

module.exports = router;
