//imports express.js library
const express = require("express");

//create an instance of express.js application and assign it to the variable "app"
const app = express();

//Imports connection.js module - database connection
const connection = require("./connection");

//hash passwords
const bcrypt = require('bcrypt');

//sessions
const session = require('express-session');

const oneHour = 60 * 60 * 1000;

//cookies
const cookieParser = require('cookie-parser');

app.use(session({
  secret: "stacksofwax",
  saveUninitialized: true,
  resave: false,
  cookie: {maxAge: oneHour},
}));

// app.use((req, res, next) => {
//   console.log("Session info:", req.session);
//   next();
// });



app.set("view engine", "ejs");

app.use(express.json());

//access the css/images
app.use(express.static(__dirname + "/public"));

//parse the form data
app.use(express.urlencoded({extended: true}));


// index
app.get("/", (req, res) => {
  if (req.session && req.session.authen) {
    const user = "SELECT * FROM users WHERE user_id = ?";
    const userId = req.session.authen;
    connection.query(user, [userId], (err, rows) => {
      if (err) throw err;
      let numRows = rows.length;
      if (numRows > 0) {
        res.redirect("/collections");
      } else {
        res.render("index");
      }
    });
  } else {
    res.render("index");
  }
});


// collections
app.get("/collections", (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  const uid = req.session.user.user_id;
  // console.log(uid);
  const user = "SELECT * FROM users WHERE user_id = ?";
  connection.query(user, [uid], (err, row) => {
    // console.log(uid);
    if (err) throw err;
    const firstrow = row[0];

    // display collection along with their associated vinyls.
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
        });

        console.log(firstrow);
        res.render("collections", {
          session: req.session,
          collections: Object.values(collections),
        });
      }
    });
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
          //set user information in the session
          req.session.user = {
            id: user.user_id,
            username: user.username,
            email: user.email
          }
          //debugging
          console.log("Session object:", req.session.user);
          res.redirect('/collections');
        } else {
          res.status(401).json({ message: "Incorrect password" });
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

//logout
app.get('/logout', (req,res) =>{
  if(req.session){
    req.session.destroy((err) =>{
      if(err)throw err;
      res.redirect("/");  
    });
  }
});


//Start web server - listen to incoming requests on the specified port
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at port 3000");
});



