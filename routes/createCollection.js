const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.get('/createCollection', (req,res)=>{
     if (!req.session.user) {
       res.redirect("/login");
       return;
     }
    res.render('createCollection');
});

module.exports = router;