//  file and import express
const express = require('express');
// import sqlite3 pkg from node_modules
//  sets the execution mode to verbose to produce messages in the terminal regarding the state of the runtime
const sqlite3 = require('sqlite3').verbose();
// Add the PORT designation and the app expression
const PORT = process.env.PORT || 3001;
const app =express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
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