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
      res.redirect(`/collections/${collectionId}/add-vinyls`);
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
            comments, collectionId
          });
        }
      });
    }
  });
});

//add comments
router.post('/collections/:id/comment', (req,res)=>{

  if(!req.session.user){
    res.redirect('/login');
    return;
  }

  const collectionId = req.params.id;
  const comment = req.body.comment;
  const userId = req.session.user.id;

  const query = `INSERT INTO collections_review(collection_id,user_id,comment,likes) VALUES (?,?,?,0);`;

  connection.query(query,[collectionId,userId,comment],(err,results)=>{
      if(err){
        console.log(err);
        res.send('cannot add comment');
      }else{
        res.redirect(`/collections/${collectionId}`);
      }
  });
});

//like
router.post("/collections/:id/comment/:comment_id/like", (req, res) => {

  if (!req.session.user) {
    res.redirect("/login");
    return;
  }


  const {comment_id } = req.params;
  const { user } = req.session;

  // SQL queries
  const checkQuery = `SELECT * FROM comment_likes WHERE user_id = ? AND comment_id = ?`;
  const insertQuery = `INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)`;
  const updateLikesQuery = `UPDATE collections_review SET likes = likes + 1 WHERE collections_review_id = ?`;

  // Check if user has already liked this comment
  connection.query(checkQuery, [user.id, comment_id], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server error");
      return;
    }
    if (results.length > 0) {
      // User has already liked this comment
      res.send("You have already liked this comment");
      return;
    }

    // Insert like into comment_likes
    connection.query(insertQuery, [user.id, comment_id], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Server error");
        return;
      }

      // Update like count in comments
      connection.query(updateLikesQuery, [comment_id], (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send("Server error");
          return;
        }

        // All successful
        res.send("OK");
      });
    });
  });
});


// Update collection name
router.put('/collections/:collectionId', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }

  const collectionId = req.params.collectionId;
  const newCollectionName = req.body.name; // new name

  const updateCollection = `UPDATE collection SET collection_name = ? WHERE collection_id = ? AND user_id = ?;`;

  connection.query(updateCollection, [newCollectionName, collectionId, req.session.user.id], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect(`/collections/${collectionId}`);
    }
  });
});


//Delete collection
router.delete('/collections/:collectionId',(req,res)=>{
  if(!req.session.user){
    res.redirect('/login');
    return;
  }


  const collectionId = req.params.collectionId;
  //query to delete collection from vinyl_collections table
  const deleteVinylCollections= `DELETE FROM vinyl_collections WHERE collection_id = ?`;

  connection.query(deleteVinylCollections, collectionId, (err,results) =>{
    if(err){
      console.log(err);
    }else{
      //query to delete collection from collection table
      const deleteCollection = `DELETE FROM collection where collection_id = ? AND user_id = ?;`;

      connection.query(deleteCollection, [collectionId,req.session.user.id],(err,results)=>{
        if(err){
          console.log(err);
        }else{
          // res.send('Collection deleted successfully');
          res.redirect('/profile');
        }
      });
    }
  });
});


module.exports = router;
