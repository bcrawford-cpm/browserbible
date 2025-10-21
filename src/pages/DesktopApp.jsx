import React, { useState, useEffect } from 'react'
import { BOOK_DATA } from '../data/bibleData.js'
import './DesktopApp.css'

function DesktopApp() {
  const [documents, setDocuments] = useState([
    { id: 1, version: 'eng_nasb', location: 'John.3.1', linked: true },
    { id: 2, version: 'eng_kjv', location: 'John.3.1', linked: true }
  ])
  const [activeDoc, setActiveDoc] = useState(1)

  const parseReference = (ref) => {
    const parts = ref.split('.')
    return {
      book: parts[0],
      chapter: parseInt(parts[1]) || 1,
      verse: parseInt(parts[2]) || 1
    }
  }

  const loadChapter = async (bookOsis, chapterNum, versionId) => {
    try {
      const response = await fetch(`/app/content/bibles/${versionId}/${bookOsis}_${chapterNum}.html`)
      if (response.ok) {
        const html = await response.text()
        return html
      }
    } catch (error) {
      console.error('Error loading chapter:', error)
    }
    return '<div class="chapter-error">Chapter not available</div>'
  }

  const DocumentPane = ({ doc }) => {
    const [content, setContent] = useState('')
    const { book, chapter } = parseReference(doc.location)
    const bookData = BOOK_DATA[book]
    const bookName = bookData ? bookData.names.eng[0] : 'Unknown'

    useEffect(() => {
      const load = async () => {
        const html = await loadChapter(book, chapter, doc.version)
        setContent(html)
      }
      load()
    }, [book, chapter, doc.version])

    return (
      <div className={`document-pane ${activeDoc === doc.id ? 'active' : ''}`}>
        <div className="doc-header">
          <h3>{bookName} {chapter}</h3>
          <span className="version-tag">{doc.version}</span>
        </div>
        <div 
          className="doc-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    )
  }

  const addDocument = () => {
    const newDoc = {
      id: Math.max(...documents.map(d => d.id)) + 1,
      version: 'eng_kjv',
      location: 'John.1.1',
      linked: true
    }
    setDocuments([...documents, newDoc])
  }

  const removeDocument = (id) => {
    if (documents.length > 1) {
      setDocuments(documents.filter(d => d.id !== id))
      if (activeDoc === id) {
        setActiveDoc(documents[0].id)
      }
    }
  }

  return (
    <div className="desktop-app">
      <div className="site-header">
        <img 
          src="/app/css/images/top-logo.png" 
          alt="Logo" 
          className="top-logo"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <div className="header-nav">
          <button onClick={addDocument} className="btn-add-doc">
            + Add Document
          </button>
        </div>
      </div>
      
      <div className="content-area">
        <div className="documents-container">
          {documents.map(doc => (
            <div key={doc.id} className="document-wrapper">
              <DocumentPane doc={doc} />
              {documents.length > 1 && (
                <button 
                  className="btn-close-doc"
                  onClick={() => removeDocument(doc.id)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="site-footer">
        <a href="http://digitalbiblesociety.com/bibles/" target="_blank" rel="noopener noreferrer">
          <img 
            src="/app/css/images/inscript-logo.png" 
            alt="Inscript" 
            className="footer-logo"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </a>
      </div>
    </div>
  )
}

export default DesktopApp
