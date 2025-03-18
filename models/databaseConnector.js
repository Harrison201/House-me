const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'house_me',
    password:'5950'
});




module.exports = pool.promise();