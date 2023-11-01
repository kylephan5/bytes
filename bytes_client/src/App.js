import './App.css';
import React from 'react';
import Navbar from './components/Navbar';
import Inventory from './components/pages/Inventory';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import Login from './components/pages/Login';
import Signup from "./components/pages/Signup";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from "axios";


function App() {
    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://127.0.0.1:8000/bytes_api';
      return (
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/inventory' element={<Inventory />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </Router>
      );
}

export default App;
