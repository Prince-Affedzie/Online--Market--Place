// src/components/SellerNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './SellerNavbar.css'; // Create a CSS file to style the navbar

const SellerNavbar = () => {
  return (
    <nav className="seller-navbar">
      <ul>
        <li><Link to="/seller/dashboard">Dashboard</Link></li>
        <li><Link to="/seller/stores">Your Stores</Link></li>
        <li><Link to="/seller/products">Products</Link></li>
        <li><Link to="/seller/orders">Orders</Link></li>
        <li><Link to="/seller/settings">Settings</Link></li>
        <li><Link to="/seller/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default SellerNavbar;
