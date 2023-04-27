const express = require('express');
const router = express.Router();
const axios = require('axios');
const connection = require('../connection');

//vinyls api
router.get('/vinyls',(req,res)=>{
  let genreParam = "";

  if(req.query.genre){
    genreParam = '?genre=' + req.query.genre;
  }
    axios
      .get("http://localhost:3000/api/vinyls" + genreParam, {
        headers: {
          Cookie: req.headers.cookie,
        },
      })
      .then((response) => {
        const vinyls = response.data;
        res.render("vinyls", { vinyls: vinyls });
      })
      .catch((err) => {
        console.log(err);
        return;
      });
});


//get all vinyls
router.get('/api/vinyls', (req,res) =>{
    //display all albums
    let query = `SELECT * FROM vinyl 
LEFT JOIN vinyl_genres AS vg1 ON vinyl.genre_id = vg1.genre_id 
LEFT JOIN vinyl_genres AS vg2 ON vinyl.subgenre_id = vg2.genre_id `;

    //check if sort parameter is provided
    if(req.query.genre){
      query += `WHERE (vg1.genre_name = '${req.query.genre}' OR vg2.genre_name = '${req.query.genre}');`;
    }
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