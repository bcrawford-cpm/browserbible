import React, { useState, useEffect } from 'react'
import './ConfigMenu.css'

function ConfigMenu({ isOpen, onClose }) {
  const [fontSize, setFontSize] = useState('medium')
  const [theme, setTheme] = useState('light')
  const [fontFamily, setFontFamily] = useState('serif')

  useEffect(() => {
    const savedFontSize = localStorage.getItem('bible-font-size') || 'medium'
    const savedTheme = localStorage.getItem('bible-theme') || 'light'
    const savedFontFamily = localStorage.getItem('bible-font-family') || 'serif'
    
    setFontSize(savedFontSize)
    setTheme(savedTheme)
    setFontFamily(savedFontFamily)
    
    applySettings(savedFontSize, savedTheme, savedFontFamily)
  }, [])

  const applySettings = (size, themeVal, font) => {
    document.body.className = `font-${size} theme-${themeVal} font-family-${font}`
  }

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize)
    localStorage.setItem('bible-font-size', newSize)
    applySettings(newSize, theme, fontFamily)
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('bible-theme', newTheme)
    applySettings(fontSize, newTheme, fontFamily)
  }

  const handleFontFamilyChange = (newFont) => {
    setFontFamily(newFont)
    localStorage.setItem('bible-font-family', newFont)
    applySettings(fontSize, theme, newFont)
  }

  if (!isOpen) return null

  return (
    <div className="config-overlay" onClick={onClose}>
      <div className="config-window" onClick={(e) => e.stopPropagation()}>
        <div className="config-header">
          <h2>Settings</h2>
          <button className="config-close" onClick={onClose}>×</button>
        </div>
        
        <div className="config-content">
          <div className="config-section">
            <h3>Font Size</h3>
            <div className="config-options">
              <button 
                className={`config-option ${fontSize === 'small' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('small')}
              >
                Small
              </button>
              <button 
                className={`config-option ${fontSize === 'medium' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('medium')}
              >
                Medium
              </button>
              <button 
                className={`config-option ${fontSize === 'large' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('large')}
              >
                Large
              </button>
              <button 
                className={`config-option ${fontSize === 'xlarge' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('xlarge')}
              >
                X-Large
              </button>
            </div>
          </div>

          <div className="config-section">
            <h3>Theme</h3>
            <div className="config-options">
              <button 
                className={`config-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                Light
              </button>
              <button 
                className={`config-option ${theme === 'sepia' ? 'active' : ''}`}
                onClick={() => handleThemeChange('sepia')}
              >
                Sepia
              </button>
              <button 
                className={`config-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                Dark
              </button>
            </div>
          </div>

          <div className="config-section">
            <h3>Font Family</h3>
            <div className="config-options">
              <button 
                className={`config-option ${fontFamily === 'serif' ? 'active' : ''}`}
                onClick={() => handleFontFamilyChange('serif')}
              >
                Serif
              </button>
              <button 
                className={`config-option ${fontFamily === 'sans' ? 'active' : ''}`}
                onClick={() => handleFontFamilyChange('sans')}
              >
                Sans-Serif
              </button>
              <button 
                className={`config-option ${fontFamily === 'mono' ? 'active' : ''}`}
                onClick={() => handleFontFamilyChange('mono')}
              >
                Monospace
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigMenu
