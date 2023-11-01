import React from 'react';
import '../App.css';
import './MainSection.css';
import axios from "axios";


function MainSection(){
    return (
        <>
        <div className='main-container'>
        <div className='about-container'>
          <div className='about-section'>
            <p>Bytes is an app designed for user convenience. It enables users to set up a personalized profile by specifying dietary restrictions and preferences, and capture images of their ingredients to seamlessly build an inventory. By analyzing this inventory, Bytes provides tailored recipe recommendations that align with the user's current ingredients and preferences, offering the flexibility to follow their preferred recipe with ease. </p>
            <div className='logo'>
                <img src="/images/foodImage.jpeg" alt="FoodImage" />
            </div>
            <div className='inventory-list'>Inventory List</div>
          </div>
        </div>
        </div>
        </>
    )
}

export default MainSection;