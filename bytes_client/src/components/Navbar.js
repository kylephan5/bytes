import React, {useState} from "react";
import"./Navbar.css"; 
import {Link} from 'react-router-dom';

function Navbar(){

    const [Menuclick, setMenuclick] = useState(false);
    const toggleMenu = () => setMenuclick(!Menuclick);
    const closemenu = () => setMenuclick(false);

    return (
        <>
            <div className="navbar">
                <div className="navbar-container">
                    <Link to='/' className="navbar-logo">
                        <img src='/images/BytesLogo.jpg' alt="Bytes" />
                    </Link>
                    <div className='menu-icon' onClick={toggleMenu}>
                        {Menuclick ? (<span class="material-symbols-outlined">close</span>)
                            : (<span class="material-symbols-outlined">menu</span>)}
                    </div>
                    <ul className={Menuclick ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link to='/' className='nav-links' onClick={closemenu}>HOME</Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/inventory' className='nav-links' onClick={closemenu}>INVENTORY</Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/profile' className='nav-links' onClick={closemenu}>PROFILE</Link>
                        </li>
                    </ul>
                </div>
            </div>
        
        </>
    )
}

export default Navbar;