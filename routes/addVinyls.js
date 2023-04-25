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
  const subgenre = req.body.subgenre;

  const userId = req.session.user.id;

  //insert artists
  const insertArtist = `INSERT INTO artist(artist_name,artist_image) VALUES (?,?);`;

  connection.query(insertArtist, [artist,coverImage], (err, results) => {
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

      //insert subgenre
      const insertSubgenre = `INSERT INTO vinyl_genres(genre_name,parent_genre_id) VALUES(?,?);`;

      connection.query(insertSubgenre, [subgenre, genreId], (err, results) => {
        if (err) {
          console.log(err);
        }

        const subgenreId = results.insertId;

        //insert vinyl
        const insertVinyl = `INSERT INTO vinyl(title,artist_id,release_year,cover_image,genre_id,subgenre_id,user_id) VALUES(?,?,?,?,?,?,?);`;

        connection.query(
          insertVinyl,
          [
            vinylName,
            artistId,
            releaseYear,
            coverImage,
            genreId,
            subgenreId,
            userId,
          ],
          (err, results) => {
            if (err) {
              console.log(err);
            }

            const vinylId = results.insertId;

            //insert tracks
            const trackName = req.body.trackName;
            const trackNumber = req.body.trackNumber;
            const trackDuration = req.body.trackDuration;

            if (trackName && trackName.length > 0) {
              const insertTrack = `INSERT INTO track(track_name, vinyl_id,track_number,track_duration) VALUES(?,?,?,?);`;

              trackName.forEach((trackName, index) => {
                connection.query(
                  insertTrack,
                  [trackName, vinylId, trackNumber, trackDuration],
                  (err, results) => {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
              });
            }
            res.redirect("/vinyls");
          }
        );
      });
    });
  });
});

module.exports = router;
