import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer-h">
      <div className="footer-h">
        <div className="footer-section-h">
          <h3>About Us</h3>
          <p>
           Prinz Market is a marketplace platform where buyers and sellers connect. Our goal is to provide the best products and services for our users.
          </p>
        </div>
        <div className="footer-section-h">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer-section-h">
          <h3>Contact Us</h3>
          <p>Email: support@helloandassistance.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2024 Hello and Assistance. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
