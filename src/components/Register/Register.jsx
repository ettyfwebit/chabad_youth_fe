import React, { useState } from 'react';
import './Register.css';  // Reusing the same CSS file for consistent styling
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../App';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [user_name, setuser_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("default"); // Default to a role ID for the user
  const [error, setError] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
  
    const userData = {
      user_name: user_name,
      email: email,
      password: password,
      role_id: roleId-1,
    };
  
    try {
      const response = await fetchWithAuth("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Get error details from the response
        // Check if the error has a detail message to provide better feedback
        throw new Error(errorData.detail || "Registration failed!"); 
      }
  
      const data = await response.json();
  
      if (data && data.user_name) {
        navigate('/');  // Redirect to the login page after successful registration
      } else {
        setError("Registration failed: Unexpected response data");
      }
    } catch (error) {
      // If the error is an object, try to extract the message
      const errorMessage = error.response?.detail || error.message || "An unknown error occurred.";
      setError("Error during registration: " + errorMessage);
    }
    

  };

  // Similar function for "Login" redirection, if needed
  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <div className="wrapper">
      <div className="dialog-box">
        <h2>YouthAc</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="user_name">User Name</label>
            <input
              type="text"
              id="user_name"
              placeholder="Enter your user_name"
              value={user_name}
              onChange={(e) => setuser_name(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="input-group">
            <label htmlFor="role_id">Role</label>
            <select
              id="role_id"
              value={roleId}
              onChange={(e) => setRoleId(Number(e.target.value))}
              className={roleId === "default" ? "placeholder" : ""}

            >
          <option value="default" disabled hidden>
    Select your role
  </option>
              <option value={2}>Parent</option>
              <option value={3}>Branch Manager</option>
              <option value={4}>Secretary</option>
            </select>
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button type="submit" className="login-button">Register</button>
        </form>
        <div className="separator">
          <div className="line"></div>
          <span>or</span>
          <div className="line"></div>
        </div>
        <button type="button" className="signup-button" onClick={handleLoginRedirect}>
          Already have an account? Login
        </button>
      </div>
      <div className="circle"></div>
    </div>
  );
};

export default RegisterPage;
