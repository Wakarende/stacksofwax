const express = require('express');
const router = express.Router();

const connection = require('../connection');

router.get('/vinyls', (req,res) =>{
    let allAlbums = `SELECT * FROM vinyl`;
    connection.query(allAlbums,(err,data) =>{
        if(err)throw err;
        res.json(data);
    });
});

module.exports = router;