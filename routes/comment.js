const query = `SELECT * FROM comments
INNER JOIN users ON users.user_id = comments.user_id;`;

