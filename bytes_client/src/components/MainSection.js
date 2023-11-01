import React from 'react';
import '../App.css';
import './MainSection.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';


function MainSection() {

  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <>
      <div className='main-container'>
        <div className='about-container'>
          <div className='about-section'>
            <div className='about-section'>
              <img src='/images/bytes_logo.png' alt="Bytes" className="main-section-image" />
              <div className="text-box">
                <p className="box-title">Your Personalized Recipe Assistant</p>
                <p className="box-description">
                  Bytes is your go-to app for hassle-free meal planning and cooking. It's designed with your convenience in mind, making your culinary journey a breeze.
                </p>
                <button className="sign-up-button" onClick={handleSignUpClick}>
                  Sign Up
                </button>

              </div>
              {/* <p>Bytes is an app designed for user convenience. It enables users to set up a personalized profile by specifying dietary restrictions and preferences, and capture images of their ingredients to seamlessly build an inventory. By analyzing this inventory, Bytes provides tailored recipe recommendations that align with the user's current ingredients and preferences, offering the flexibility to follow their preferred recipe with ease. </p> */}
              <div className='logo'>
                <img src="/images/foodImage.jpeg" alt="FoodImage" />
              </div>
              <div className='inventory-list'>Inventory List</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainSection;