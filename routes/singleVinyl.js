const express = require('express');
const connection = require('../connection');
const router = express.Router();

router.get('/vinyls/:id',(req,res)=>{
    if(!req.session.user){
        res.redirect('/login');
        return;
    }


    const vinylId = req.params.id;
    const query = `SELECT DISTINCT * 
                    FROM vinyl INNER JOIN track ON track.vinyl_id = vinyl.vinyl_id INNER join users ON users.user_id = vinyl.user_id;`;


    connection.query(query,[vinylId],(err,results)=>{
        if(err){
            console.log(err);
        }else{
            const vinyl = results[0];
            res.render('singleVinyl',vinyl);
        }
    });
});

module.exports = router;

