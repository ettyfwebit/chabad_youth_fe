import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const handleLogin = async (event) => {
    event.preventDefault(); 
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name:username,
          password:password,
        }), 
      });

      if (!response.ok) {
        throw new Error("Login failed!");
      }

      const data =await response.json();
      if(data.role==="secretary")
       navigate('/children');
      if(data.role==="branch_manager")
        navigate('/childrenListByBranch')
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };


// פונקציה לטיפול בלחיצה על "Sign Up"
const handleSignUp = () => {
  console.log('Sign Up button clicked!');
  // הוסיפי כאן את הלוגיקה לניווט/פתיחת טופס הרשמה
};




return (
  <div className="wrapper">
    <div className="dialog-box">
      <h2>YouthAc</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">User Name</label>
          <input type="text" id="username" placeholder="Enter your username" value={username} onChange={(e)=>setUsername(e.target.value) } />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
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
