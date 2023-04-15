const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "stacksofwax",
  port: "3306",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");

  const sql = `

    INSERT INTO vinyl_collections (vinyl_id, collection_id) VALUES
    (1, 1),
    (2, 1);
  `;

  const statements = sql.trim().split(/;\s*$/gm);

  statements.forEach((statement) => {
    if (statement) {
      connection.query(statement, (err, result) => {
        if (err) throw err;
        console.log("Statement executed:", statement);
      });
    }
  });
});

// INSERT INTO vinyl (title, artist_id, release_year, cover_image, user_id, genre_id, subgenre_id, record_company_id) VALUES
//     ('Channel Orange', 1, 2012, 'https://cdn.shopify.com/s/files/1/0130/8714/6043/products/1_7316932f-9483-468b-83d8-4e2ee2287b0f.jpg?v=1634465044', 1, 1, 1, 1),
//     ('Blonde', 1, 2016, 'https://upload.wikimedia.org/wikipedia/en/2/28/Channel_ORANGE.jpg', 1, 1, 1, 1),
//     ('Thriller', 2, 1982, 'https://upload.wikimedia.org/wikipedia/en/0/09/Thriller_25_cover.jpg', 2, 2, 2, 2),
//     ('Bad', 2, 1987, 'https://www.julienslive.com/images/lot/3414/3414_0.jpg?1634401631', 2, 2, 2, 2),
//     ('Nevermind', 3, 1991, 'https://pyxis.nymag.com/v1/imgs/3d9/4c6/5089c643c841509db84949077b58a9685d-nirvana-nevermind.jpg', 1, 3, 3, 3),
//     ('In Utero', 3, 1993, 'https://upload.wikimedia.org/wikipedia/en/e/e5/In_Utero_%28Nirvana%29_album_cover.jpg', 2, 3, 3, 3);

//     INSERT INTO track (vinyl_id, track_name, track_number) VALUES
//     (1, 'Super Rich Kids', 1),
//     (1, 'Golden Girl', 2),
//     (2, 'Pink+White', 1),
//     (2, 'Ivy', 2),
//     (3, 'Thriller', 1),
//     (4, 'Bad', 1),
//     (5, 'Polly', 1),
//     (5, 'Breed', 2),
//     (6, 'Milk It', 1),
//     (6, 'Tourette''s', 2);

//     INSERT INTO collection (collection_name, collection_description, user_id) VALUES
//     ('Chill', 'Chill tunes to ease your day', 1),
//     ('Pop and Rock Classics', 'Popular and iconic albums in pop and rock', 2);
