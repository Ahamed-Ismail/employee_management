import React, { useState } from 'react';
import './adminLogin.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await axios.post('https://task-emp.onrender.com/login', { username, password });
      console.log(response.data); // Log response from server
      // Reset input fields after successful submission
      setUsername('');
      setPassword('');
      // Redirect to employee form upon successful login
      window.location.href = '/employee-form';
      
    } catch (error) {
      alert("Invalid Credentials");
      console.error('Error logging in:', error);
      // Handle error here, such as displaying an error message to the user
    }
  };

  return (
    <div className="admin-login-container">
      <h2 className="form-title">Admin Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        {/* <Link to='/employee-form' className="register-link">Register</Link> */}
      </form>
    </div>
  );
};

export default AdminLogin;
