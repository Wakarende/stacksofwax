let mysql = require('mysql');
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'stacksofwax',
    port:'3306'
});

db.connect((err)=>{
    if (err) throw err;
    console.log('database connected successfully');
});