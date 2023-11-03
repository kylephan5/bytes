import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Inventory from './components/pages/Inventory';
import Recipes from './components/pages/Recipes';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import Login from './components/pages/Login';
import Signup from "./components/pages/Signup";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';
  axios.defaults.withCredentials = true;

  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = 'http://127.0.0.1:8000/bytes_api';
  } else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = 'https://bytes.ndlug.org/bytes_api';
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path='/profile' element={<Profile setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/' element={<Home />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/recipes' element={<Recipes />} />
        <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
