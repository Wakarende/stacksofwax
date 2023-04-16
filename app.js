//imports express.js library
const express = require("express");

//create an instance of express.js application and assign it to the variable "app"
const app = express();

//Imports connection.js module - database connection
const connection = require("./connection");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/collections", (req, res) => {
  //display collection along with their associated vinyls.
  const query = `
    SELECT c.collection_id, c.collection_name, c.image as collection_image, v.vinyl_id, v.title AS vinyl_title
    FROM collection c
    JOIN vinyl_collections vc ON c.collection_id = vc.collection_id
    JOIN vinyl v ON vc.vinyl_id = v.vinyl_id;
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
        collections[result.collection_id].vinyls.push({
          vinyl_id: result.vinyl_id,
          vinyl_title: result.vinyl_title,
        });
      });

      res.render("collections", { collections: Object.values(collections) });
    }
  });
});

//Start web server - listen to incoming requests on the specified port
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at port 3000");
});

