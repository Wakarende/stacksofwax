const express = require("express");
const router = express.Router();
const connection = require("../connection");
const session = require("express-session");



//add tracks to existing albums
router.get('/vinyls/:vinylId/add-tracks',(req,res)=>{
    if(!req.session.user){
        res.redirect('/login');
        return;
    }


    const vinylId = req.params.vinylId;
    const userId = req.session.user.id;

    console.log("vinylId: ", vinylId);
    console.log("userId: ", userId);

    const query = `SELECT user_id FROM vinyl WHERE vinyl_id = ?;`;

    //check to make sure that the user who wants to add vinyl created the vinyl
    connection.query(query, [vinylId], (err,results)=>{
        if(err){
            console.log(err);
        }else{
            if(results.length && results[0].user_id === userId){
                 res.render("addTrackToVinyl", {
                   vinylId,
                   session: req.session,
                 });
            }else{
                res.send('Unauthorized');
            }
        }
    });
   
    
});



router.post('/vinyls/:vinylId/add-tracks',(req,res)=>{
    const vinylId  = req.params.vinylId;

    const trackName = req.body.trackName;
    const trackNumber =req.body.trackNumber;
    const trackDuration = req.body.trackDuration;

    if(Array.isArray(trackName) && Array.isArray(trackNumber) && Array.isArray(trackDuration)){
        const tracks = trackName.map((name, index) =>{
            return{
                trackName: name,
                trackNumber: trackNumber[index],
                trackDuration: trackDuration[index],
            }
        });


         console.log("Tracks:", tracks);
         tracks.forEach((track) => {
           const query = `INSERT INTO track(track_name, vinyl_id,track_number,track_duration) VALUES(?,?,?,?);`;

           connection.query(
             query,
             [track.trackName, vinylId, track.trackNumber, track.trackDuration],
             (err, results) => {
               if (err) {
                 console.log(err);
               } else {
                 res.redirect(`/vinyls/${vinylId}`);
               }
             }
           );
         });
    }
   
});

module.exports = router;