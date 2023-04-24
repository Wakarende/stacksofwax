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

     const query = `INSERT INTO collection (collection_name, collection_description, user_id, image) VALUES (? ? ? ?);
     `;
    connection.query(query [collectionName, collectionDescription,collectionImage,userId], (err,results) => {
      if(err){
        console.log(err);
        res.status(500).json({error: "Error adding collection"});
      }else{
        res.redirect('/collections/${result.insertId}/add-vinyls'); //redirect to add vinyl for newly created collection
      }
    });  
  });   

module.exports = router;