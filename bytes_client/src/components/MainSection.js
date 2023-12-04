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
            <img src='/images/bytes_logo.png' alt="Bytes" className="main-section-image" />
            <div className="text-box">
              <p className="box-title">Your Personalized Recipe Assistant</p>
              <p className="box-description">
                Bytes is your go-to app for hassle-free meal planning and cooking. It's designed with your convenience in mind, making your culinary journey a breeze.
              </p>
              <div className="how-does-it-work">
                <p className="how-does-it-work-title">How Does It Work?</p>
                <ol className="numbered-list">
                  <li>Create Your Profile: Specify dietary restrictions and preferences.</li>
                  <li>Build Your Digital Pantry: Snap ingredient images to create an inventory.</li>
                  <li>Get Personalized Recipes: Bytes recommends recipes based on your ingredients.</li>
                  <li>Cook with Ease: Follow your preferred recipes effortlessly.</li>
                </ol>
              </div>
              <button className="sign-up-button" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
        <div className='food-image'>
          {/* <img src="/images/foodImage.jpeg" alt="FoodImage" /> */}
          <video src='/images/bytes_vid.mp4' loop autoPlay muted className="BytesVid" />
        </div>
      </div>
    </>

  );
}


export default MainSection;