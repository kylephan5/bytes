import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Login.css';
import axios from "axios"; // Import your CSS file
import React, { useState } from 'react';

function Signup({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  //
  // const changePassword = (old_password, new_password, confirm_password) => {
  //   axios.put('change_password/', {
  //     old_password: old_password,
  //     new_password: new_password,
  //     confirm_password: confirm_password,
  //   }).then(function (response) {
  //     console.log(response);
  //   }).catch(function (error) {
  //     console.error(error);
  //   })
  // }

  const userLogin = (event, setIsLoggedIn) => {
    event.preventDefault();
    const { email, password } = formData;

    axios.post('login/', {
      email: email,
      password: password,
    }, {
      withCredentials: true,
    }).then(function (response) {
      console.log('signed in');
      setIsLoggedIn(true);
    }).catch(function (error) {
      console.error(error);
    })
  }

  return (
    <Form className="login-form"> {/* Apply the login-form class */}
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" name="email" value={formData.email} onChange={handleInputChange} />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleInputChange} />
      </Form.Group>
      <Button variant="primary" type="submit" className="login-button" onClick={(event) => userLogin(event, setIsLoggedIn)}>
        Submit
      </Button>
      {/* <a href="#" className="forgot-password-button">Forgot Password?</a> */}

    </Form>
  );
}

export default Signup;