import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import  {AuthContext}  from '../Context/AuthContext'


import './SellerLogin.css';

const SellerLogin = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    if (!email.includes('@')) {
      setErrorMessage('Invalid email format');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validateForm()) return;

    try {
      // Replace with your actual backend endpoint
      const response = await fetch('http://localhost:3000/api/seller/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (response.ok) {
        setIsAuthenticated(true);
        navigate('/seller/dashboard');
      } else {
        setErrorMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setErrorMessage('Login failed. Please try again later.');
    }
  };

  return (
    <div className="seller-login-page">
      <div className="login-container">
        <div className="login-left">
          {/* Replace with your logo or any illustration */}
          <img src="/images/logo.png" alt="Logo" className="logo" />
          <h1>Welcome Back, Seller!</h1>
          <p>Manage your store, products, and orders all in one place.</p>
        </div>
        <div className="login-right">
          <h2>Seller Login</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="input-icon">
                <i className="fas fa-envelope"></i>
              </span>
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-icon">
                <i className="fas fa-lock"></i>
              </span>
            </div>
            <button type="submit">Login</button>
          </form>
          <p className="signup-text">
            Don't have an account?{' '}
            <a href="/seller/signup" className="signup-link">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
