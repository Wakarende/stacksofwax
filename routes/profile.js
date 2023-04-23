const express = require("express");
const router = express.Router();
const axios = require('axios');
const connection = require('../connection');

router.get("/profile", (req, res) => {
  if(!req.session.user){
    res.redirect('/login');
  }
  const userId = req.session.user.id;
  axios
    .get(`http://localhost:3000/api/profile/${userId}`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    })
    .then((response) => {
      const collections = response.data;
      res.render("profile", {
        session: req.session,
        collections,
      });
    })
    .catch((error)=>{
      console.log(error);
    });
});



router.get("/api/profile/:id", (req, res) => {
  const userId = req.session.user.id;
  const query = `
  SELECT  DISTINCT * FROM collection
  INNER JOIN users ON users.user_id = collection.user_id
  INNER JOIN vinyl ON vinyl.user_id = collection.user_id
  INNER JOIN track ON track.vinyl_id = vinyl.vinyl_id
  WHERE users.user_id = ?
  ORDER BY collection.collection_id;
  `;

  connection.query(query, [userId],(err, results) => {
    if (err) {
      console.log(err);
    } else {
      //display vinyls
      const collections = [];
      const uniqueCollectionId = [];

      results.forEach((item) => {
        if (!uniqueCollectionId.includes(item.collection_id)) {
          uniqueCollectionId.push(item.collection_id);
          collections.push(item);
        }
      });

      res.json(collections);
    }
  });
});

module.exports = router;
