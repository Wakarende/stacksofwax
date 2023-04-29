const express = require("express");
const router = express.Router();
const connection = require("../connection");
const session = require("express-session");



//add tracks to existing albums
router.get('/:vinylId/add-tracks',(req,res)=>{
    if(!req.session.user){
        res.redirect('/login');
        return;
    }


    const vinylId = req.params.vinylId;
    const userId = req.session.user.id;

    res.render("addTrackToVinyl", { vinylId, session: req.session });
    
});



router.post('/:vinylId/add-tracks',(req,res)=>{
    const vinylId  = req.params.vinylId;

    const query = `INSERT INTO track(track_name, vinyl_id,track_number,track_duration) VALUES(?,?,?,?);`;


    connection.query(query,[vinylId],(err,results)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect(`/vinyls/${vinylID}`);
        }
    });
});