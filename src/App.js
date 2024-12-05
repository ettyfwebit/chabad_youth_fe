import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login/Login';
import RegisterPage from './components/Register/Register';
import ChildrenList from './components/ChildrenList/ChildrenList';
import ChildrenListByBranch from './components/ChildrenListByBranch/ChildrenListByBranch';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* דף ה-login יהיה הדף הראשון */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/children" element={<ChildrenList/>} />
          <Route path="/childrenListByBranch" element={<ChildrenListByBranch/>} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
