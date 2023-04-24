const express = require('express');
const router = express.Router();
const axios = require('axios');
const connection = require('../connection');

//vinlys api
router.get('/vinyls',(req,res)=>{
    
    axios
      .get("http://localhost:3000/api/vinyls", {
        headers: {
          Cookie: req.headers.cookie,
        },
      })
      .then((response) => {
        const vinyls = response.data;
        res.render("vinyls", vinyls);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
});



//get all vinyls
router.get('/api/vinyls', (req,res) =>{
    //display all albums
    const query = `SELECT * FROM vinyl`;
    connection.query(query,(err,results) =>{
        if(err){
            console.log(err);
            return;
        }

        const vinyls = {};
        results.forEach((result) =>{
            if(!vinyls[result.vinyl_id]) {
                vinyls[result.vinyl_id] = {
                    vinyl_id: result.vinyl_id,
                    title:result.title,
                    artist_id: result.artist_id,
                    release_year: result.release_year,
                    cover_image: result.cover_image,
                    genre: result.genre_id,
                    subgenre: result.subgenre_id
                }
            }
        });
        res.json(Object.values(vinyls));
    });
});


module.exports = router;