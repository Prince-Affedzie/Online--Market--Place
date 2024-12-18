// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faUser, faQuestionCircle,faSearch  } from '@fortawesome/free-solid-svg-icons';
import './Header.css';  // Import your CSS styles

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Prinz Market</h1> {/* You can replace this with your actual logo */}
        </div>

       

        <div className="header-icons">
          <Link to="/cart" className="header-icon">
          <FontAwesomeIcon icon={faShoppingCart} />
            
            <span className="badge">3</span>
          </Link>

          <Link to="/profile" className="header-icon">
          <FontAwesomeIcon icon={faUser} />
            
          </Link>

          <Link to="/help" className="header-icon">
          <FontAwesomeIcon icon={faQuestionCircle} />
           
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
