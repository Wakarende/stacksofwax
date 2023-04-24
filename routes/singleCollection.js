const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.get("/collections/:id", (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  const collectionId = req.params.id;
  const query = `SELECT DISTINCT * 
                    FROM collection 
                    INNER JOIN vinyl_collections ON collection.collection_id = vinyl_collections.collection_id
                    INNER JOIN vinyl on vinyl_collections.vinyl_id = vinyl.vinyl_id
                    INNER JOIN users on collection.user_id = users.user_id
                    WHERE vinyl_collections.collection_id = ?;`;
  //comments query
  const commentsQuery = `SELECT * FROM collections_review 
    INNER JOIN users ON users.user_id = collections_review.user_id
    WHERE collection_id = ?;`;

  connection.query(query, [collectionId, commentsQuery], (err, results) => {
    if (err) {
      console.log(err);
    } else if (results.length === 0) {
      // res.render('collection');
    } else {
      const collection = results[0];

      //display vinyls
      const vinyls = [];
      const uniqueVinylId = [];

      results.forEach((item) => {
        if (!uniqueVinylId.includes(item.vinyl_id)) {
          uniqueVinylId.push(item.vinyl_id);
          vinyls.push(item);
        }
      });

      //fetch comments
      connection.query(commentsQuery, [collectionId], (err, results) => {
        if (err) {
          console.log(err);
        } else {
          const comments = results;
          res.render("collection", {
            session: req.session,
            collection,
            vinyls,
            comments,
          });
        }
      });
    }
  });
});

//add comments
router.post('/collections/:id/comment', (req,res)=>{
  const collectionId = req.params.id;
  const comment = req.body.comment;
  const userId = req.session.user.id;

  const query = `INSERT INTO collections_review(collection_id,user_id,comment) VALUES (?,?,?);`;

  connection.query(query,[collectionId,userId,comment],(err,results)=>{
      if(err){
        console.log(err);
      }else{
        res.redirect('/collections/:id');
      }
  });
});


module.exports = router;
