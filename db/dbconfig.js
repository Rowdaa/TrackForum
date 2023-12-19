const mysql = require("mysql2");

const dbConnection = mysql.createPool({
  user: "trackforum-admin",
  database: "track_forum",
  host: "localhost",
  password: "123456",
  connectionLimit: 10,
});

// dbConnection.execute("select'test'", (err, result) => {
//   if (err) {
//     console.log(err.message);
//   } else {
//     console.log(result);
//   }
// });
module.exports = dbConnection.promise();
