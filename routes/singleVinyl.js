const express = require('express');
const connection = require('../connection');
const router = express.Router();

router.get('/vinyls/:id',(req,res)=>{
    if(!req.session.user){
        res.redirect('/login');
        return;
    }

    const vinylId = req.params.id;
    const query = `SELECT * 
                    FROM vinyl INNER JOIN track ON track.vinyl_id = vinyl.vinyl_id INNER join users ON users.user_id = vinyl.user_id
                    INNER join artist ON artist.artist_id = vinyl.artist_id
                    WHERE vinyl.vinyl_id = ?;`;


    connection.query(query,[vinylId],(err,results)=>{
        if(err){
            console.log(err);
        }else{
            const vinyl = results[0];
            console.log(vinyl)
            // display tracks 
            const tracks = [];
            const uniqueTrackId = [];

            results.forEach((item) =>{
                if(!uniqueTrackId.includes(item.track_id)){
                    uniqueTrackId.push(item.track_id);
                    tracks.push(item);
                }
            });

            console.log("vinylId:", vinylId);
            console.log("results:", results);

            if(results.length > 0 ) {
                 res.render("singleVinyl", {
                   session: req.session,
                   vinyl,
                   tracks,vinylId
                 });
            }else{
                console.log("No results found for this vinyl id.");
            }
        }
    });
});

// Delete vinyl
router.delete('/vinyls/:vinylId', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }

  const vinylId = req.params.vinylId;
  const userId = req.session.user.id;

  //delete tracks associated with the vinyl
  const deleteTracks = `DELETE FROM track WHERE vinyl_id = ?;`;

  connection.query(deleteTracks, [vinylId], (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
 
    //delete from vinyl_collections 
    const deleteVinylCollections = `DELETE FROM vinyl_collections WHERE vinyl_id = ?;`;

    connection.query(deleteVinylCollections, [vinylId], (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      // delete vinyl from vinyl table
      const deleteVinyl = `DELETE FROM vinyl WHERE vinyl_id = ? AND user_id = ?;`;

      connection.query(deleteVinyl, [vinylId, userId], (err, results) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/profile');
        }
      });
    });
  });
});


module.exports = router;

