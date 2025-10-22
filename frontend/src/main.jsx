import React from 'react';

// 20251015修改
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ChatPage from './Pages/ChatPage.jsx'
import './index.css'

import Portfolio from './Pages/Portfolio.jsx';
import EditProfile from './Pages/EditProfile.jsx';
import AdminLogin from './Pages/AdminLogin.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* 默认主页 */}
        <Route path="/" element={<Portfolio />} />
        
        {/* 管理路由 */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        
        {/* Ai Chatbox Router 20251015 */}
        <Route path="/chat" element={<ChatPage />} /> 
        
        {/* 404 Re-route */}
        <Route path="*" element={<Navigate to="/" />} />
      
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

export default App;