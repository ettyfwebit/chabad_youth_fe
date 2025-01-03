import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login/Login';
import SecretaryList from './components/SecretaryList/SecretaryList';
import BranchManagerList from './components/BranchManagerList/BranchManagerList';
import ParentList from './components/ParentList/ParentList';
import RegisterPage from './components/Register/Register';
import NotificationPage from './components/Notification/Notification';
import BranchManagerDetails from './components/BranchManagerDetails/BranchManagerDetails';

function App() {
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
