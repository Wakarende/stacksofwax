const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.get("/collections/:id", (req, res) => {
  // if (!req.session.user) {
  //   res.redirect("/login");
  //   return;
  // }

  const collectionId = req.params.id;
  const query = `SELECT DISTINCT * 
                    FROM collection 
                    INNER JOIN vinyl_collections ON collection.collection_id = vinyl_collections.collection_id
                    INNER JOIN vinyl on vinyl_collections.vinyl_id = vinyl.vinyl_id
                    INNER JOIN users on collection.user_id = users.user_id
                    WHERE vinyl_collections.collection_id = ?;`;
  //comments query
  const commentsQuery = `SELECT collections_review.*, users.*, COUNT(comment_likes.like_id) AS likes
    FROM collections_review 
    LEFT JOIN users ON users.user_id = collections_review.user_id
    LEFT JOIN comment_likes ON comment_likes.comment_id = collections_review.collections_review_id
    WHERE collections_review.collection_id = ?
    GROUP BY collections_review.collections_review_id;`;


  connection.query(query, [collectionId], (err, results) => {
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
        res.redirect(`/collections/${collectionId}`);
      }
  });
});


//like 
router.post("/collections/:id/comment/:comment_id/like", (req, res) => {
  const { id, comment_id } = req.params;
  const { user } = req.session;
  const query = `INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)`;

  // Avoid duplicate likes by the same user
  const checkQuery = `SELECT * FROM comment_likes WHERE user_id = ? AND comment_id = ?`;

  connection.query(checkQuery, [user.id, comment_id], (err, results) => {
    if (err) {
      console.log(err);
    } else if (results.length > 0) {
      // User has already liked this comment
      res.send("You have already liked this comment!");
    } else {
      connection.query(query, [user.id, comment_id], (err, results) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect(`/collections/${id}`);
        }
      });
    }
  });
});


module.exports = router;
