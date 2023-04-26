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

  //route to add vinyls to newly created collection. Also displays existing user vinyls.
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


  //router to add vinyls to collection. Both existing vinyls and new vinyls
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


  //add new vinyls to a specific collection
  // Add new vinyls to a specific collection
router.post('/collections/:collectionId/addVinyls', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }

  const collectionId = req.params.collectionId;
  const { vinylName, artist, releaseYear, coverImage, genre, subgenre, trackName, trackNumber, trackDuration } = req.body;
  const userId = req.session.user.id;

  const query = `INSERT INTO vinyl (vinyl_name, artist, release_year, cover_image, genre, subgenre, user_id) VALUES (?, ?, ?, ?, ?, ?, ?);`;
  connection.query(query, [vinylName, artist, releaseYear, coverImage, genre, subgenre, userId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error adding vinyl' });
    } else {
      const vinylId = results.insertId;
      const insertTracks = (index) => {
        if (index < trackName.length) {
          const trackQuery = `INSERT INTO tracks (track_name, track_number, track_duration, vinyl_id) VALUES (?, ?, ?, ?);`;
          connection.query(trackQuery, [trackName[index], trackNumber[index], trackDuration[index], vinylId], (err) => {
            if (err) {
              console.log(err);
              res.status(500).json({ error: 'Error adding tracks' });
            } else {
              insertTracks(index + 1);
            }
          });
        } else {
          const addToCollectionQuery =`INSERT INTO vinyl_collections (vinyl_id, collection_id) VALUES (?, ?);`;
          connection.query(addToCollectionQuery, [vinylId, collectionId], (err) => {
            if (err) {
              console.log(err);
              res.status(500).json({ error: 'Error adding vinyl to collection' });
            } else {
              res.redirect(`/collections/${collectionId}/add-vinyls`);
            }
          });
        }
      };

      insertTracks(0);
    }
  });
});

module.exports = router;