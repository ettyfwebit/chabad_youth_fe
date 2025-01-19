import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login/Login';
import SecretaryList from './components/SecretaryList/SecretaryList';
import BranchManagerList from './components/BranchManagerList/BranchManagerList';
import ParentList from './components/ParentList/ParentList';
import RegisterPage from './components/Register/Register';
import NotificationPage from './components/Notification/Notification';
import BranchManagerDetails from './components/BranchManagerDetails/BranchManagerDetails';

function App() {
  useEffect(() => {
    const idleTime = 30* 60 * 1000; // חצי שעה

    const redirectToHome = () => {
        window.location.href = '/'; // מחזיר לדף הבית
    };

    const resetTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(redirectToHome, idleTime);
    };

    // התחלת טיימר
    let timer = setTimeout(redirectToHome, idleTime);

    // איפוס הטיימר בעת פעילות המשתמש
    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keydown', resetTimer);

    // ניקוי מאזינים בעת יציאת הקומפוננטה
    return () => {
        clearTimeout(timer);
        document.removeEventListener('mousemove', resetTimer);
        document.removeEventListener('keydown', resetTimer);
    };
}, []);

  return (
    <div>
      <Router>
        <Routes>
          {/* The login page will be the first page */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/secretaryList" element={<SecretaryList />} />
          <Route path="/branchManagerList" element={<BranchManagerList />} />
          <Route path="/parentlist" element={<ParentList />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/branch-managers" element={<BranchManagerDetails />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
