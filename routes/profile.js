const express = require("express");
const router = express.Router();

router.get("/profile", (req, res) => {
  const userId = req.session.user_id;
  axios
    .get("http://localhost:3000/api/profile/${userId}", {
      headers: {
        Cookie: req.headers.cookie,
      },
    })
    .then((response) => {
      const collections = response.data;
      res.render("profile", {
        session: collections,
      });
    });

  router.get("/profile/:id", (req, res) => {
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

    connection.query(query, (err, results) => {
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

        res.render("profile", {
          collections,
        });
      }
    });
  });
});

module.exports = router;
