import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Login.css';
import axios from 'axios';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const userRegister = (event) => {
    event.preventDefault();
    const { email, password } = formData;

    axios
      .post('register/', {
        email: email,
        password: password,
      })
      .then(function (response) {
        setRegistrationSuccess(true);

        setFormData({
          email: '',
          password: '',
        });

        axios
          .post('login/', {
            email: email,
            password: password,
          })
          .then(function (response) {
            console.log('signed in!');
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Form className="login-form">
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        className="login-button"
        onClick={(event) => userRegister(event)}
      >
        Submit
      </Button>

      {registrationSuccess && (
        <div className="registration-success-message">
          <p>
            Registration successful! Please go to the login page.
          </p>
        </div>
      )}
    </Form>
  );
}
export default Signup;