import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [user_name, setuser_name] = useState("");
  
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: user_name,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed!");
      }

      const data = await response.json();
      if (data.role === "secretary")
        navigate('/children');
      if (data.role === "branch_manager")
        navigate('/childrenListByBranch');
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  // Function to navigate to the register page
  const handleSignUp = () => {
    navigate('/register'); // Navigate to the register page
  };

  return (
    <div className="wrapper">
      <div className="dialog-box">
        <h2>YouthAc</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="user_name">User Name</label>
            <input type="text" id="user_name" placeholder="Enter your user_name" value={user_name} onChange={(e) => setuser_name(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="login-button">Login</button>
          <div className="separator">
            <div className="line"></div>
            <span>or</span>
            <div className="line"></div>
          </div>
        </form>
        <button type="button" className="signup-button" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
      <div className="circle"></div>
    </div>
  );
};

export default LoginPage;
