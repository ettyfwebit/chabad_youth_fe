import React from 'react';
import './ManagerSideBar.css'; // קובץ ה-CSS לעיצוב ה-SideBar

const ManagerSideBar = () => {
  return (
    <div className="side-bar">
      <button className="side-bar-button">Home</button>
      <button className="side-bar-button">Profile</button>
      <button className="side-bar-button">Settings</button>
      <button className="side-bar-button">Logout</button>
    </div>
  );
};

export default ManagerSideBar;