require("dotenv").config();

//imports express.js library
const express = require("express");

//create an instance of express.js application and assign it to the variable "app"
const app = express();

//Imports connection.js module - database connection
const connection = require("./connection");

//hash passwords
const bcrypt = require("bcrypt");

//sessions
const session = require("express-session");

const oneHour = 60 * 60 * 1000;

//cookies
const cookieParser = require("cookie-parser");

app.use(
  session({
    secret: "stacksofwax",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: oneHour },
  })
);

// app.use((req, res, next) => {
//   console.log("Session info:", req.session);
//   next();
// });

app.set("view engine", "ejs");

app.use(express.json());

//access the css/images
app.use(express.static(__dirname + "/public"));

//parse the form data
app.use(express.urlencoded({ extended: true }));

// index
const landingPage = require("./routes/landingPage");

//index route
app.use("/", landingPage);

// collections
const collections = require("./routes/collections");
app.use("/", collections);

//single collection
app.get("/collection", (req, res) => {
  res.render("collection");
});

//Sign-up
const signUp = require("./routes/signUp");
app.use("/", signUp);

//Login
const loginPage = require("./routes/loginPage");

app.use("/", loginPage);

//logout
const logOut = require("./routes/logOut");

app.use("/", logOut);

//User Profile
const profile = require("./routes/profile");
app.use("/", profile);

//Albums
const albums = require('./routes/albums');
app.use('/',albums);


//Start web server - listen to incoming requests on the specified port
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at port 3000");
});

