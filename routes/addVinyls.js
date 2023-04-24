const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.get("/addVinyls", (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }
  res.render("addVinyls");
});

router.post("/addVinyls", (req, res) => {
  const vinylName = req.body.vinylName;
  const artist = req.body.artist;
  const releaseYear = req.body.releaseYear;
  const coverImage = req.body.coverImage;
  const genre = req.body.genre;
  const subgenre = req.body.genre;

  const userId = req.session.user.id;

  //insert artists
  const insertArtist = `INSERT INTO artist(artist_name) VALUES (?);`;

  connection.query(insertArtist, [artist], (err, results) => {
    if (err) {
      console.log(err);
    }
    const artistId = results.insertId;

    //insert genre
    const insertGenres = `INSERT INTO vinyl_genres (genre_name) VALUES(?);`;

    connection.query(insertGenres, [genre], (err, results) => {
      if (err) {
        console.log(err);
      }
      const genreId = results.insertId;
    });

    //insert subgenre
    const insertSubgenre = `INSERT INTO vinyl_genres(genre_name,parent_genre_id) VALUES(?,?);`;

    connection.query(insertSubgenre, [subgenre, genre_id], (err, results) => {
      if (err) {
        console.log(err);
      }

      const subgenreId = results.insertId;

      //insert vinyl
      const insertVinyl = `INSERT INTO vinyl(title,artist_id,release_year,cover_image,genre_id,subgenre_id,user_id) VALUES(?,?,?,?,?,?,?);`;

      connection.query(
        insertVinyl,
        [vinylName, artist, releaseYear, coverImage, genre, subgenre, userId],
        (err, results) => {
          if (err) {
            console.log(err);
          }
          res.redirect("/vinyls");
        }
      );
    });
  });
});

module.exports = router;
