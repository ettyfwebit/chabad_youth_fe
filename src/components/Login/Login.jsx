import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [user_name, setUser_name] = useState("");

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
      // Navigate to the NotificationPage with the user_id
      navigate('/notification', { state: { user_id: data.user_id } });
      console.log(data.user_id)
      // Additional navigation based on user role
      if (data.role === "secretary") {
        navigate('/secretaryList',{ state: { user_id: data.user_id } });
      } else if (data.role === "branch_manager") {
        navigate('/branchmanagerList', { state: { user_id: data.user_id } });
      } else if (data.role === "parent") {
        navigate('/parentList', { state: { user_id: data.user_id } });
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="wrapper">
      <div className="dialog-box">
        <h2>YouthAc</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">User Name</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={user_name}
              onChange={(e) => setUser_name(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
