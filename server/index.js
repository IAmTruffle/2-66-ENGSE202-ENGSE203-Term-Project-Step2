const express = require('express');
const axios = require('axios');
const path = require('path'); 
const mysql = require('mysql');
const bodyParser = require('body-parser');

const env = require('../env.js');
const config = require('../dbconfig.js')[env];

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  port: config.port,
  password: config.password,
  database: config.database
})
connection.connect((err) => {
  if (err) {
      console.error('Error connecting to MySQL:', err);
  } else {
      console.log('Connected to MySQL');
  }
});

console.log('Running Environment: ' + env);

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/users', (req, res) => {
  axios.get('https://randomuser.me/api/?page=1&results=10')
      .then(response => {
          res.send(response.data);
       })
       .catch(error => {
          console.error('Error fetching user data:', error);
          res.status(500).send('Error fetching user data');
       });
});


app.post('/saveuser', (req, res) => {
  const userData = req.body;
  if (!userData) {
    return res.status(400).send('Invalid user data');
  }
  console.log(userData);
  saveUserData(userData);
});


// ฟังก์ชันสำหรับบันทึกข้อมูลผู้ใช้ในฐานข้อมูล
function saveUserData(userData) {
  const { gender, name, location, email, login, picture ,dob} = userData;
  const { title, first, last } = name;
  const { country } = location;
  const { username, password, md5, sha1, sha256, uuid } = login;
  const { medium, large, thumbnail } = picture;
  const dateOfBirth = new Date(dob.date).toISOString().slice(0, 19).replace('T', ' '); // แปลงรูปแบบของวันเกิด

  console.log(userData);

  const sql = 'INSERT INTO users SET ?';
  const values = {gender, title, first, last, country,dob:dateOfBirth, uuid, email, username, password, md5, sha1, sha256, picture_large:large, picture_medium:medium, picture_thumbnail:thumbnail};

  connection.query(sql, values, (error, results, fields) => {
    if (error) {
      return console.error('Error saving user data:', error.message);
    }
    console.log('User data saved successfully!');
  });
}


app.listen(3008, () => {
    console.log('Server started on port 3008');
});
