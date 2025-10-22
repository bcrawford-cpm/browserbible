import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import DesktopApp from './pages/DesktopApp.jsx'
import ReaderApp from './pages/ReaderApp.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/desktop" element={<DesktopApp />} />
        <Route path="/reader" element={<ReaderApp />} />
      </Routes>
    </Router>
  )
}

export default App
