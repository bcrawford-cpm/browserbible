import React from 'react'
import { Link } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1>inScript Bible Browser</h1>
        
        <ul className="version-links">
          <li>
            <Link to="/reader">Reader</Link>
          </li>
          <li>
            <Link to="/desktop">Desktop</Link>
          </li>
        </ul>
        
        <p>
          Built by the{' '}
          <a href="http://dbsbible.org" target="_blank" rel="noopener noreferrer">
            Digital Bible Society
          </a>
          , available at{' '}
          <a href="http://github.com/digitalbiblesociety" target="_blank" rel="noopener noreferrer">
            github
          </a>
        </p>
      </div>
    </div>
  )
}

export default LandingPage
