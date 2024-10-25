
//import dependencies/packages
const express = require('express');
const app = express();
// DBMS: MySQL
const mysql = require('mysql2');
// Cross-Origin Resource Sharing
const cors = require('cors');
// Environment variable doc (stores private info)
const dotenv = require('dotenv');

// Middleware
app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Check if there is a connection
db.connect((err) => {
  if (err) {
    return console.log('Error connecting to MySQL:', err);
  }
  console.log("Connected to MySQL with ID:", db.threadId);
});


//Set the view engine to EJS and define views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//code start



//Question 1 Route to render data from the database
app.get('/data', (req, res) => {
  // Retrieve data from the 'patients' table
  db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving data');
    }
    res.render('data', { results: results });
  });
});

//question 2
app.get('/providers', (req, res) => {
  // Retrieve data from the 'providers' table
  db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving data');
    }
    res.render('providers', { results: results });
  });
});


// Question 3, Endpoint to retrieve and optionally filter patients by first name
app.get('/data', (req, res) => {
  
  db.query('SELECT * FROM patients WHERE first_name = "Ted"', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('error: retreiving data' );
    }
    
    // Render data.ejs with the filtered (or unfiltered) patient data
    res.render('data', { results: results });
  });
});

//Question 4
app.get('/providers', (req, res) => {
  
  db.query('SELECT first_name,provider_specialty FROM providers ORDER BY provider_specialty', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('error: retreiving data' );
    }
    
    
    res.render('providers', { results: results });
  });
});
//code end

// Route for testing server response
app.get('/', (req, res) => {
  res.send('Server started successfully!');
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

