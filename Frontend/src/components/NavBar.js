import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" style={{textDecoration:"none",color:"#fff",fontWeight:"bold", fontSize:"30px"}}>Prinz Market</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/stores">Stores</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
