const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

// Get single candidate
router.get('/candidate/:id', (req, res) => {
  const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id 
             WHERE candidates.id = ?`;
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


// Create a candidate
// use the HTTP request method post() to insert a candidate into the candidates table12.2.7
router.post('/candidate', ({body}, res) => {
  //  ***Notice that we're using object destructuring to pull the body property out of the request object.***
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({
      error: errors
    });
    return;
  }
  //  database call 12.2.7
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
  VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];
  // ES5 function, not arrow function, to use `this`
  //  no column for the id. SQLite will autogenerate the id 12.2.7
  db.run(sql, params, function (err, result) {
    if (err) {
      // 400 status code, to prompt for a different user request
      res.status(400).json({
        error: err.message
      });
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

// Get all candidates the in the URL signifies that this is an endpoint.
router.get('/candidates', (req, res) => {
  const sql = `SELECT candidates.*, parties.name 
              AS party_name 
              FROM candidates 
              LEFT JOIN parties 
              ON candidates.party_id = parties.id`;
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      // 500 status code means there was a server error—different than a 404,
      res.status(500).json({
        error: err.message
      });
      return;
    }

    res.json({
      message: 'success',
      data: rows
    });
  });
});

//  routes to handle updates

router.put('/candidate/:id', (req, res) => {
  const errors = inputCheck(req.body, 'party_id');

  if (errors) {
    res.status(400).json({
      error: errors
    });
    return;
  }
  const sql = `UPDATE candidates SET party_id = ? 
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({
        error: err.message
      });
      return;
    }

    res.json({
      message: 'success',
      data: req.body,
      changes: this.changes
    });
  });
});

// Delete a candidate  (?) denotes a placeholder, making this a prepared statement. Prepared statements can have placeholders that can be filled in dynamically with real values12.2.4
// Delete a candidate 12.2.6
router.delete('/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({
        error: res.message
      });
      return;
    }

    res.json({
      message: 'successfully deleted',
      changes: this.changes
    });
  });
});

module.exports = router;