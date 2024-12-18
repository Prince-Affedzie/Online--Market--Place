import React, {useContext, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

import './Login.css';

const Backend = 'http://localhost:3000';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
        setSuccessMessage('');
        if (!validateForm()) return;

        try {
            const response = await fetch(`${Backend}/api/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            if (response.ok) {
                setSuccessMessage('Login successful!');
                navigate('/home');
            } else {
                setErrorMessage('Login failed. Please check your credentials.');
            }
        } catch (error) {
            setErrorMessage('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
           
                <h2>Login to Your Account</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p>
                    Don't have an account?{' '}
                    <a href="/signup" className="signup-link">
                        Sign up here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
