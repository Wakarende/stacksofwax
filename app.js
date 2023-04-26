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

app.set("view engine", "ejs");

//access the css/images
app.use(express.static(__dirname + "/public"));

//parse the form data
app.use(express.urlencoded({ extended: true }));

// index
const landingPage = require("./routes/landingPage");
app.use("/", landingPage);

// collections
const collections = require("./routes/collections");
app.use("/", collections);

// single collection
const singleCollection = require('./routes/singleCollection');
app.use("/", singleCollection);

//create collection
const createCollection = require('./routes/createCollection');
app.use('/',createCollection);

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

//display all vinyls
const vinyls = require('./routes/vinyls');
app.use('/',vinyls);

//add vinyls
const addVinyls = require('./routes/addVinyls');
app.use('/',addVinyls);

//display single vinyl
const singleVinyl= require('./routes/singleVinyl');
app.use('/', singleVinyl);


//Start web server - listen to incoming requests on the specified port
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at port 3000");
});



