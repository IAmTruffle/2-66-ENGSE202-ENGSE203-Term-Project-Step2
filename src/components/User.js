import React from 'react';
import axios from 'axios';
 
const User = ({ gender, name, location, email, picture, login ,dob}) => {
    // Function to handle saving user data to the database
    const handleSave = () => {
        const userData = { gender, name, location, email, picture, login ,dob};
        // Assuming you have a function to save user data to the database
        saveUserData(userData);
    };
 
    
    const handleInsertData = async () => {
        try {
            var data = JSON.stringify({
                name_title: name.title,
                name_first: name.first,
                name_last: name.last,
                country: location.country,
                email: email,
                gender: gender, 
                dob: dob.age, 
                login_username: login.username,
                login_password: login.password,
                picture_large: picture.large,
                picture_medium: picture.medium,
                picture_thumbnail: picture.thumbnail
            })
            console.log(data);
            const response = await axios.post('/insertData',data,{
                headers: {
                    // Overwrite Axios's automatically set Content-Type
                    'Content-Type': 'application/json'
                  }
                });
              if(response.status === 200){
                  alert(name.title +" "+name.first +" "+name.last+" "+response.data);
              }
            console.log(response);
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    };
 
    return (
<div className="random-user">
<div className="user-image">
<img src={picture.medium} alt={name.first} />
</div>
<div><strong>Country:</strong> {location.country}</div>
<div><strong>Email:</strong> {email}</div>
<div><strong>Login:</strong> {login.username}</div>
<div><strong>Password:</strong> {login.password}</div>
<div><strong>Name:</strong> {name.first} {name.last}</div>
            {/* Button to trigger saving user data */}
<button onClick={handleInsertData}>INSERT</button>
</div>
    );
};
 
export default User;