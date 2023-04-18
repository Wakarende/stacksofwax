//imports express.js library
const express = require("express");

//create an instance of express.js application and assign it to the variable "app"
const app = express();

//Imports connection.js module - database connection
const connection = require("./connection");

//hash passwords
const bcrypt = require('bcrypt');



app.set("view engine", "ejs");

app.use(express.json());

//access the css/images
app.use(express.static(__dirname + "/public"));

//parse the form data
app.use(express.urlencoded({extended: true}));

//index 
app.get("/", (req, res) => {
  res.render("index");
});

//collections
app.get("/collections", (req, res) => {
  //display collection along with their associated vinyls.
  const query = `
    SELECT c.collection_id, c.collection_name, c.image as collection_image, v.vinyl_id, v.title AS vinyl_title
    FROM collection c
    LEFT JOIN vinyl_collections vc ON c.collection_id = vc.collection_id
    LEFT JOIN vinyl v ON vc.vinyl_id = v.vinyl_id;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching data");
    } else {
      // console.log(results);
      const collections = {};
      results.forEach((result) => {
        if (!collections[result.collection_id]) {
          collections[result.collection_id] = {
            collection_id: result.collection_id,
            collection_name: result.collection_name,
            collection_image: result.collection_image,
            vinyls: [],
          };
        }
        collections[result.collection_id].vinyls.push({
          vinyl_id: result.vinyl_id,
          vinyl_title: result.vinyl_title,
        });
      });

      res.render("collections", { collections: Object.values(collections) });
    }
  });
});

//single collection
app.get("/collection",(req,res)=>{
  res.render("collection");
  
});

//Sign-up
app.get("/sign-up",(req,res) =>{
  res.render("sign-up");
});

//Login
app.get("/login",(req,res) =>{
  // let usernameOrEmail = req.body.usernameOrEmail;
  // let password = req.body.password;

  // let checkuser = 'SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?';

  // connection.query(checkuser, [usernameOrEmail],[password],(err,results) =>{
  //   if(err) throw (err);
  //   let numResults = results.length;
  //   if(numResults > 0){
  //     res.send('<code>logged in</code>');
  //   }else{
  //     res.send('<code>access denied</code>');
  //   }
  // });
  res.render("login");
});

//check login
app.post("/login", (req, res) => {
  const usernameOrEmail = req.body.usernameOrEmail;
  const password = req.body.password;

  const query = "SELECT * FROM users WHERE email = ? OR username = ?";

  connection.query(query, [usernameOrEmail, usernameOrEmail], (err, rows, fields) => {
    if (err) {
      console.error(err);
    }

    if (rows.length > 0) {
      const user = rows[0];

      // Compare the provided password with the stored hash using bcrypt
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Internal server error" });
          return;
        }
        
        if (match) {
          res.status(200).json({ message: "Authentication successful" });
        } else {
          res.status(401).json({ message: "Incorrect password" });
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});


//Start web server - listen to incoming requests on the specified port
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at port 3000");
});



