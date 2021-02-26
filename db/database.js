const sqlite3 = require('sqlite3').verbose();

//  connect the application to the SQLite database
const db = new sqlite3.Database('./db/election.db', err => {
  if (err) {
    return console.error(err.message);
  }

  console.log('Connected to the election database.');
});



module.exports = db;