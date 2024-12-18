import React from 'react';
import './HomeNavBar.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faUser, faQuestionCircle,faSearch,faShoppingBag  } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  return (
    <nav className="home-navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">Prinz Market</a>
        <ul className="nav-links">
          {/*<li><a href="/home">Home</a></li>*/}
          {/*<li><a href="/products">Products</a></li>*/}
         
          <li className="dropdown">
        </li>
          
        
          
         
          
        
        </ul>
        <form className="nav-search-form">
          <input type="text" placeholder="Search for products or stores..." />
          <button type="submit" style={{width:"5rem"}}>Search</button>
        </form>
        <ul className="nav-links">
        <li><a href="/stores">Stores</a></li>
        <Link to="/cart" className="header-icon">
          <FontAwesomeIcon icon={faShoppingCart} />
            
            <span className="badge">3</span>
          </Link >

          <Link to="/orders" className="header-icon">
          <FontAwesomeIcon icon={faShoppingBag} />
          <span className="badge">10</span>
          </Link>
          
          

          <Link to="/user/profile" className="header-icon">
          <FontAwesomeIcon icon={faUser} />
            
          </Link>
        <li><a href="/sell">Sell</a></li>

       
        
        <li><a href="/logout">Logout</a></li>
        </ul>
       
      </div>
    </nav>
  );
};

export default NavBar;
