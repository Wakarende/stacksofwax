const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.get('/create-collection', (req,res)=>{
     if (!req.session.user) {
       res.redirect("/login");
       return;
     }
    res.render('createCollection');
});

//create collection
router.post('/create-collection',(req,res) => {
  if (!req.session.user) {
       res.redirect("/login");
       return;
     }
    
  const collectionName = req.body.collectionName;
     const collectionDescription = req.body.description;
     const collectionImage = req.body.collectionImage;
     const userId = req.session.user.id;

    const query = `INSERT INTO collection (collection_name, collection_description, user_id, image) VALUES (?, ?, ?, ?);`;

    connection.query(query, [collectionName, collectionDescription,userId, collectionImage], (err,results) => {
      if(err){
        console.log(err);
        res.status(500).json({error: "Error adding collection"});
      }else{
        const collectionId = results.insertId;
        res.redirect(`/collections/${collectionId}/add-vinyls`);
      }
    });  
  });   

  //route to add vinyls to created collection. Also displays existing user vinyls.
  router.get('/collections/:collectionId/add-vinyls',(req,res)=>{

    if(!req.session.user){
      res.redirect('/login');
      return;
    }

    const collectionId =req.params.collectionId;
    const userId = req.session.user.id;

    //get vinyls owned by user;
    const query = `SELECT * FROM vinyl INNER JOIN artist ON artist.artist_id = vinyl.artist_id WHERE user_id = ?;`;

    connection.query(query,[userId],(err,results)=>{
      if(err){
        console.log(err);
      }else{
        res.render('addVinylsToCollection', {vinyls:results,collectionId,session: req.session});
      }
    }); 
  });


  //router to add vinyls to collection
  router.post(`/collections/:collectionId/add-vinyls`, (req, res) => {
    if (!req.session.user) {
      res.redirect("/login");
      return;
    }

    const collectionId = req.params.collectionId;
    let vinylIds = req.body.existingVinyls;

    if (!Array.isArray(vinylIds)) {
      vinylIds = [vinylIds];
    }

    const query = `INSERT INTO vinyl_collections (vinyl_id,collection_id) VALUES(?,?);`;

    connection.query(query, [vinylIds, collectionId], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect(`/collections/${collectionId}`);
      }
    });
  });


module.exports = router;