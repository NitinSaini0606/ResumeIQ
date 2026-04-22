import './App.css'
import LandingPage from './components/LandingPage'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import RoastPage from './components/Roast'
import MatcherPage from './components/MatcherPage.jsx'
import RoastPage from './components/Roast.jsx'
import CompanyIntelPage from './components/Chatbot.jsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="matcher" element={<MatcherPage />} />
        {/* <Route path="/roast" element={<RoastPage />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="roast" element={<RoastPage />} />
        <Route path="company-intel" element={<CompanyIntelPage />} />

      </Routes>
    </Router>
  )
}

export default App
