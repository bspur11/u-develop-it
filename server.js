//  file and import express
const express = require('express');
// Add the PORT designation and the app expression
const PORT = process.env.PORT || 3001;
const app =express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



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

//  add the function that will start the Express.js server on port 3001
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});