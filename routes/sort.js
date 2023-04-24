router.get("/api/vinyls", (req, res) => {
  const sortBy = req.query.sort || "vinyl_id"; // Default sort by vinyl_id

  let query;

  if (sortBy === "genre") {
    query = `SELECT * FROM vinyl ORDER BY genre_id`;
  } else if (sortBy === "year") {
    query = `SELECT * FROM vinyl ORDER BY release_year`;
  } else {
    query = `SELECT * FROM vinyl`;
  }

  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching vinyls");
      return;
    }
    res.json(results);
  });
});
