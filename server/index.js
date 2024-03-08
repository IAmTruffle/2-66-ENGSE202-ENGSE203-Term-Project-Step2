                              // Section 1
                              const express = require('express');
                              const axios = require('axios');
                              const path = require('path');
                              const mysql = require('mysql');
                              const bodyParser = require('body-parser');
                              const env = require('../src/components/env.js')
                              const config = require('../src/components/dbconfig.js')[env];
                              
                              const db = mysql.createConnection({
                                  host: config.host,
                                  user: config.user,
                                  password: config.password,
                                  database: config.database
                              }
                              )
                              db.connect((err) => {
                                  if (err) {
                                      console.error('Error connecting to MySQL:', err);
                                  } else {
                                      console.log('Connected to MySQL');
                                  }
                              });
                              
                              
                              // Section 2
                              const app = express();
                              app.use(bodyParser.json());
                              app.use(express.static(path.join(__dirname, '..', 'public')));
                              
                              // Section 3
                              app.get('/', (req, res) => {
                                  res.send("<h1>Home page</h1>");
                              });
                              
                              app.get('/users', (req, res) => {
                                  axios.get('https://randomuser.me/api/?page=1&results=10')
                                      .then(response => {
                                          res.send(response.data);
                                       });
                              });
                              
                              app.post('/insertData', (req, res) => {
                                  const user_data = req.body;
                                  console.log(user_data);
                              
                                  db.query('INSERT INTO users SET ?', user_data, (err, result) => {
                                      if (err) {
                                          console.error('Error inserting data:', err);
                                          res.status(500).send('Error inserting data');
                                      } else {
                                          console.log('Data inserted successfully');
                                          res.status(200).send('Data inserted successfully');
                                      }
                                  });
                              });
                              
                              // Section 4
                              app.listen(3000, () => {
                                  console.log('server started on port 3000');
                              });