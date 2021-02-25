//  file and import express
const express = require('express');
//  import the module  to prompt for a different user request with a JSON object
const inputCheck = require('./utils/inputCheck');
// import sqlite3 pkg from node_modules
//  sets the execution mode to verbose to produce messages in the terminal regarding the state of the runtime
const sqlite3 = require('sqlite3').verbose();
// Add the PORT designation and the app expression
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

//  connect the application to the SQLite database
const db = new sqlite3.Database('./db/election.db', err => {
  if (err) {
    return console.error(err.message);
  }

  console.log('Connected to the election database.');
});

// create a GET test route 
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
  });
});

// Get single candidate
app.get('/api/candidate/:id', (req, res) => {
  const sql = `SELECT * FROM candidates 
               WHERE id = ?`;
  //  Because params can be accepted in the database call as an array, params is assigned as an array with a single element, req.params.id.12.2.5
  const params = [req.params.id];
  // using the Database method get() to return a single row from the database call 12.2.5
  db.get(sql, params, (err, row) => {
    if (err) {
      //  error status code was changed to 400 to notify the client that their request wasn't accepted and to try a different request.
      res.status(400).json({
        error: err.message
      });
      return;
    }

    res.json({
      message: 'success',
      data: row
    });
  });
});

// Delete a candidate  (?) denotes a placeholder, making this a prepared statement. Prepared statements can have placeholders that can be filled in dynamically with real values12.2.4
// Delete a candidate 12.2.6
app.delete('/api/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.json({
      message: 'successfully deleted',
      changes: this.changes
    });
  });
});

// Create a candidate
// use the HTTP request method post() to insert a candidate into the candidates table12.2.7
app.post('/api/candidate', ({ body }, res) => {
  //  ***Notice that we're using object destructuring to pull the body property out of the request object.***
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  //  database call 12.2.7
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
  VALUES (?,?,?)`;
const params = [body.first_name, body.last_name, body.industry_connected];
// ES5 function, not arrow function, to use `this`
//  no column for the id. SQLite will autogenerate the id 12.2.7
db.run(sql, params, function(err, result) {
if (err) {
  // 400 status code, to prompt for a different user request
res.status(400).json({ error: err.message });
return;
}
//  send the response using the res.json() method with this.lastID, the id of the inserted row 12.2.7
res.json({
message: 'success',
data: body,
id: this.lastID
});
});

});

// callback function captures the responses from the query in two variables: the err, which is the error response, and rows, which is the database query response

// Get all candidates the api in the URL signifies that this is an API endpoint.
// app.get('/api/candidates', (req, res) => {
//   const sql = `SELECT * FROM candidates`;
//   const params = [];
//   db.all(sql, params, (err, rows) => {
//     if (err) {
//       // 500 status code means there was a server error—different than a 404,
//       res.status(500).json({
//         error: err.message
//       });
//       return;
//     }

//     res.json({
//       message: 'success',
//       data: rows
//     });
//   });
// });

// Create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];
// ES5 function, not arrow function, to use this
db.run(sql, params, function(err, result) {
  if (err) {
    console.log(err);
  }
  console.log(result, this.lastID);
});

// Default response for any other request(Not Found) Catch all
//  catchall route, its placement is very important
// This route will override all others—so make sure this is the last one.
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.on('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});