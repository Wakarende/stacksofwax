const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.get("/collections/:id", (req, res) => {
  const collectionId = req.params.id;
    const query = `SELECT DISTINCT * 
                    FROM collection 
                    INNER JOIN vinyl_collections ON collection.collection_id = vinyl_collections.collection_id
                    INNER JOIN vinyl on vinyl_collections.vinyl_id = vinyl.vinyl_id
                    INNER JOIN users on collection.user_id = users.user_id
                    WHERE vinyl_collections.collection_id = ?;`;
  connection.query(query,[collectionId],(err, results) => {
      if (err) {
        console.log(err);
      } else if (results.length === 0) {
        res.status(404).json({ error: "Collection not found." });
      } else {
        const collection = results[0];
        
        //display vinyls
        const vinyls = [];
        const uniqueVinylId = [];

        results.forEach((item) =>{
          if(!uniqueVinylId.includes(item.vinyl_id)){
            uniqueVinylId.push(item.vinyl_id);
            vinyls.push(item);
          }
        });

        res.render("collection", {
          session: req.session,
          collection,
          vinyls
        });
      }
    }
  );
});

module.exports = router;
