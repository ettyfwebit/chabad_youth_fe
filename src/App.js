import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/Login/Login';
import SecretaryList from './components/SecretaryList/SecretaryList';
import BranchManagerList from './components/BranchManagerList/BranchManagerList';
import ParentList from './components/ParentList/ParentList';
import RegisterPage from './components/Register/Register';
import NotificationPage from './components/Notification/Notification';
import BranchManagerDetails from './components/BranchManagerDetails/BranchManagerDetails';
import ChildrenList from './components/ChildrenList/ChildrenList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ייבוא ה-CSS של ה-toast
// פונקציה כללית לביצוע בקשות API עם Token
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  }
  );
  if (response.status === 403) {
    localStorage.setItem("showToast", "You do not have permission to access this page.");
    window.location.href = "/";
  }
  
  


  if (response.status === 401) {
    alert("Session expired. Please log in again.");
    window.location.href = "/"; // הפניה לעמוד ההתחברות
  }

  return response;
};

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // אם אין טוקן, מפנים לעמוד הראשי
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // מחזירים את הרכיב אם יש טוקן
  return element;
};

function App() {
  return (
    <Router>
<ToastContainer 
    position="top-right" 
    autoClose={3000} 
    hideProgressBar={false} 
    newestOnTop={false} 
    closeOnClick 
    rtl={false} 
    pauseOnFocusLoss 
    draggable 
    pauseOnHover 
  />      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/secretaryList" element={<ProtectedRoute element={<SecretaryList />} />} />
        <Route path="/branchManagerList" element={<ProtectedRoute element={<BranchManagerList />} />} />
        <Route path="/parentlist" element={<ProtectedRoute element={<ParentList />} />} />
        <Route path="/notification" element={<ProtectedRoute element={<NotificationPage />} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/branch-managers" element={<ProtectedRoute element={<BranchManagerDetails />} />} />
        <Route path="/childrenList" element={<ProtectedRoute element={<ChildrenList />} />} />
        {/* נתיב עבור שגיאות 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;