import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Login.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loginStatus, setLoginStatus] = useState(null); // new state variable for login status
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const userLogin = (event) => {
    event.preventDefault();
    const { email, password } = formData;

    axios
      .post(
        'login/',
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        console.log('signed in');
        setIsLoggedIn(true);
        setLoginStatus('success');
        navigate('/profile');
        setTimeout(() => {
          setLoginStatus('');
        }, 3000);

        setFormData({
          email: '',
          password: '',
        });
      })
      .catch(function (error) {
        console.error(error);
        setLoginStatus('error');
        setTimeout(() => {
          setLoginStatus('');
        }, 3000);

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
        onClick={userLogin}
      >
        Submit
      </Button>

      {/* Display login status with fade-out effect */}
      {loginStatus === 'success' && (
        <div className="login-success fade-out">Login successful!</div>
      )}
      {loginStatus === 'error' && (
        <div className="login-error fade-out">Login failed. Please check your credentials.</div>
      )}

    </Form>
  );
}

export default Signup;