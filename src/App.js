import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login/Login';
import SecretaryList from './components/SecretaryList/SecretaryList';
import BranchManagerList from './components/BranchManagerList/BranchManagerList';
import ParentList from './components/ParentList/ParentList';
import RegisterPage from './components/Register/Register';


function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* דף ה-login יהיה הדף הראשון */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/secretaryList" element={<SecretaryList/>} />
          <Route path="/branchManagerList" element={<BranchManagerList/>} />
          <Route path="/parentlist" element={<ParentList/>} />
          <Route path="/register" element={<RegisterPage />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
