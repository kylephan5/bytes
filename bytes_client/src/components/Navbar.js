import React, { useState } from "react";
import "./Navbar.css";
import { NavLink } from 'react-router-dom';

function Navbar() {
    const [Menuclick, setMenuclick] = useState(false);
    const toggleMenu = () => setMenuclick(!Menuclick);
    const closemenu = () => setMenuclick(false);

    return (
        <>
            <div className="navbar">
                <div className="navbar-container">
                    <div className='menu-icon' onClick={toggleMenu}>
                        {Menuclick ? (<span className="material-symbols-outlined">close</span>)
                            : (<span className="material-symbols-outlined">menu</span>)}
                    </div>
                    <ul className={Menuclick ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <NavLink to='/profile' className='nav-links' activeClassName='active' onClick={closemenu}>
                                PROFILE
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink to='/' className='nav-links' activeClassName='active' exact onClick={closemenu}>
                                HOME
                            </NavLink>                        </li>
                        <li className='nav-item'>
                            <NavLink to='/inventory' className='nav-links' activeClassName='active' onClick={closemenu}>
                                INVENTORY
                            </NavLink>                        </li>
                        <li className='nav-item'>
                            <NavLink to='/recipes' className='nav-links' activeClassName='active' onClick={closemenu}>
                                RECIPES
                            </NavLink>                        </li>
                        <li className='nav-item'>
                            <NavLink to='/login' className='nav-links' activeClassName='active' onClick={closemenu}>
                                LOGIN
                            </NavLink>                        </li>
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