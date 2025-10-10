import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Portfolio from './Pages/Portfolio.jsx';
import EditProfile from './Pages/EditProfile.jsx';
import AdminLogin from './Pages/AdminLogin.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;