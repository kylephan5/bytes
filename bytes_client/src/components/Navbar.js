import React, { useState } from "react";
import "./Navbar.css";
import { NavLink } from 'react-router-dom';

function Navbar({ isLoggedIn }) {
    const [menuClick, setMenuClick] = useState(false);
    const toggleMenu = () => setMenuClick(!menuClick);
    const closeMenu = () => setMenuClick(false);

    return (
        <>
            <div className="navbar">
                <div className="navbar-container">
                    <div className='menu-icon' onClick={toggleMenu}>
                        {menuClick ? (<span className="material-symbols-outlined">close</span>)
                            : (<span className="material-symbols-outlined">menu</span>)}
                    </div>
                    <ul className={menuClick ? 'nav-menu active' : 'nav-menu'}>
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
                        {isLoggedIn && (
                            <li className='nav-item'>
                                <NavLink to='/inventory' className='nav-links' activeclassname='active' onClick={closeMenu}>
                                    INVENTORY
                                </NavLink>
                            </li>
                        )}
                        <li className='nav-item'>
                            <NavLink to='/recipes' className='nav-links' activeclassname='active' onClick={closeMenu}>
                                RECIPES
                            </NavLink>
                        </li>
                        {isLoggedIn && (
                            <li className='nav-item'>
                                <NavLink to='/recommendations' className='nav-links' activeClassName='active' onClick={closeMenu}>
                                    RECOMMENDATIONS
                                </NavLink>
                            </li>
                        )}
                        {!isLoggedIn && (
                            <li className='nav-item'>
                                <NavLink to='/login' className='nav-links' activeClassName='active' onClick={closeMenu}>
                                    LOGIN
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Navbar;