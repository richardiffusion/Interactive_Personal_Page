

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Portfolio from './Pages/Portfolio.jsx'
import EditProfile from './Pages/EditProfile.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/edit-profile" element={<EditProfile />} />
    </Routes>
  )
}

export default App