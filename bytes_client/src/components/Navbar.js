import React, { useState } from "react";
import "./Navbar.css";
import { NavLink } from 'react-router-dom';

function Navbar({ isLoggedIn }) {
    const [Menuclick, setMenuclick] = useState(false);
    const toggleMenu = () => setMenuclick(!Menuclick);
    const closeMenu = () => setMenuclick(false);

    console.log(isLoggedIn)

    return (
        <>
            <div className="navbar">
                <div className="navbar-container">
                    <div className='menu-icon' onClick={toggleMenu}>
                        {Menuclick ? (<span className="material-symbols-outlined">close</span>)
                            : (<span className="material-symbols-outlined">menu</span>)}
                    </div>
                    <ul className={Menuclick ? 'nav-menu active' : 'nav-menu'}>
                        {isLoggedIn && (
                            <li className='nav-item'>
                                <NavLink to='/profile' className='nav-links' activeclassname='active' onClick={closeMenu}>
                                    PROFILE
                                </NavLink>
                            </li>
                        )}
                        <li className='nav-item'>
                            <NavLink to='/' className='nav-links' activeclassname='active' onClick={closeMenu}>
                                HOME
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink to='/inventory' className='nav-links' activeclassname='active' onClick={closeMenu}>
                                INVENTORY
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink to='/recipes' className='nav-links' activeclassname='active' onClick={closeMenu}>
                                RECIPES
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink to='/login' className='nav-links' activeclassname='active' onClick={closeMenu}>
                                LOGIN
                            </NavLink>
                        </li>
                        {/* <li className='nav-item'>
                            <Link to='/signup' className='nav-links' onClick={closemenu}>SIGNUP</Link>
                        </li> */}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Navbar;