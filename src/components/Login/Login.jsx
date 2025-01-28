import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ייבוא ה-CSS של ה-toast

const LoginPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [user_name, setUser_name] = useState("");
  useEffect(() => {
    const toastMessage = localStorage.getItem("showToast");
    if (toastMessage) {
      toast.error(toastMessage, {
        autoClose: 3000,
      });
      localStorage.removeItem("showToast"); // מחיקת ההודעה לאחר ההצגה
    }
  }, []);
  const handleLogin = async (event) => {
    event.preventDefault(); // מניעת רענון דף
    try {
      const response = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: user_name,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token); // שמירת ה-Token
        if (data.user.role === "secretary") {
          navigate('/secretaryList', { state: { user_id: data.user.user_id } });
        } else if (data.user.role === "branch_manager") {
          navigate('/branchManagerList', { state: { user_id: data.user.user_id } });
        } else if (data.user.role === "parent") {
          navigate('/parentList', { state: { user_id: data.user.user_id } });
        } else {
          alert("Role not recognized.");
        }
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
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
