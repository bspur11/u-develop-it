// const router = require("./candidateRoutes");

const express = require('express');
const router = express.Router();
const db = require('../../db/database');


// route for all parties:

router.get('/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
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

// add a second route that includes an id parameter for a single party

router.get('/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
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

//  front end is to delete parties

router.delete('/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
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