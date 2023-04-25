// const express = require('express');
// const router = express.Router();
// const connection = require('../connection');


// router.get('/collections/:id/add-vinyls', (req,res) =>{
//     if (!req.session.user) {
//        res.redirect("/login");
//        return;
//     }
//     const collection_id = req.params.collection_id;
//     res.render('addVinylsToCollection',collection_id);
// });


//  //add  vinyls
//   router.post('/collections/:id/add-vinyls', (req,res) =>{
//     const collection_id = req.params.collection_id;
//     const {vinyl_ids} = req.body;

//     const query = `
//     INSERT INTO vinyl_collections (vinyl_id, collection_id) VALUES (?,?);
//     `;
//     vinyl_ids.forEach(vinyl_id =>{
//         connection.query(insertVinylCollectionQuery, [vinyl_id, collection_id], (err,results)=>{
//             if(err){
//                 console.log(err);
//             }
//         });
//     });

//     res.json(200).status({message: "Vinyls added to collection successfully"});
//   });

// module.exports = router;
