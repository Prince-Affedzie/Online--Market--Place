import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Backend = 'http://localhost:3000'

const SignUp = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    if (name.trim() === '') {
      setErrorMessage('Name is required');
      return false;
    }
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!validateForm()) return;

    try {
      const response = await fetch(`${Backend}/api/user/register`,
        {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({name,email,phoneNumber,password}),
            credentials: 'include',
        }
         );
         if(response.ok){
      setSuccessMessage('Account created successfully!');
      navigate('/home')
    }else{
        setErrorMessage('Sign-up failed. Please try again.');
    }
      // Handle redirection after successful sign-up
    } catch (error) {
      console.log(error)
      setErrorMessage('Sign-up failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <h2>Sign Up</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Log in here</a></p>
    </div>
  );
};

export default SignUp;
