import React, { useState, useEffect } from 'react'
import { BOOK_DATA } from '../data/bibleData.js'
import versionsLoader from '../utils/versionsLoader.js'
import './DesktopApp.css'

function DesktopApp() {
  const [documents, setDocuments] = useState([
    { id: 1, version: 'eng_nasb', location: 'John.3.1', linked: true },
    { id: 2, version: 'eng_kjv', location: 'John.3.1', linked: true }
  ])
  const [activeDoc, setActiveDoc] = useState(1)
  const [availableVersions, setAvailableVersions] = useState([])

  // Load available versions on mount
  useEffect(() => {
    const loadVersions = async () => {
      await versionsLoader.loadAllVersions()
      const versionOptions = versionsLoader.getVersionOptions()
      setAvailableVersions(versionOptions)
    }
    loadVersions()
  }, [])

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
    const [showBookList, setShowBookList] = useState(false)
    const [showChapterList, setShowChapterList] = useState(false)
    const [selectedBook, setSelectedBook] = useState('')
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

    const handleVersionChange = (e) => {
      const newVersion = e.target.value
      setDocuments(documents.map(d => 
        d.id === doc.id ? { ...d, version: newVersion } : d
      ))
    }

    const handleBookSelect = (bookOsis) => {
      setSelectedBook(bookOsis)
      setShowBookList(false)
      setShowChapterList(true)
    }

    const handleChapterSelect = (chapterNum) => {
      const newLocation = `${selectedBook || book}.${chapterNum}.1`
      setDocuments(documents.map(d => 
        d.id === doc.id ? { ...d, location: newLocation } : d
      ))
      setShowChapterList(false)
      
      // Sync other documents if they are linked
      if (doc.linked) {
        setDocuments(prevDocs => prevDocs.map(d => 
          d.id !== doc.id && d.linked ? { ...d, location: newLocation } : d
        ))
      }
    }

    const toggleLock = () => {
      setDocuments(documents.map(d => 
        d.id === doc.id ? { ...d, linked: !d.linked } : d
      ))
    }

    return (
      <div className={`document-pane ${activeDoc === doc.id ? 'active' : ''}`}>
        <div className="doc-header">
          <div className="doc-header-left">
            <button 
              className="doc-nav-button"
              onClick={() => setShowBookList(!showBookList)}
              title="Select book and chapter"
            >
              {bookName} {chapter}
            </button>
            
            <select 
              className="doc-version-selector"
              value={doc.version}
              onChange={handleVersionChange}
              title="Select Bible version"
            >
              {availableVersions.map(group => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          
          <div className="doc-header-right">
            <button 
              className={`doc-lock-button ${doc.linked ? 'locked' : 'unlocked'}`}
              onClick={toggleLock}
              title={doc.linked ? 'Linked (click to unlink)' : 'Unlinked (click to link)'}
            >
              {doc.linked ? '🔒' : '🔓'}
            </button>
          </div>
        </div>

        {showBookList && (
          <div className="doc-navigation-popup book-list">
            <h3>Select Book</h3>
            <div className="nav-scroller">
              <div className="book-group">
                <h4>Old Testament</h4>
                {Object.keys(BOOK_DATA).filter(key => {
                  const bookIndex = Object.keys(BOOK_DATA).indexOf(key)
                  return bookIndex < 39 // First 39 books are OT
                }).map(bookOsis => {
                  const bookInfo = BOOK_DATA[bookOsis]
                  return (
                    <button
                      key={bookOsis}
                      className="book-button"
                      onClick={() => handleBookSelect(bookOsis)}
                    >
                      {bookInfo.names.eng[0]}
                    </button>
                  )
                })}
              </div>
              <div className="book-group">
                <h4>New Testament</h4>
                {Object.keys(BOOK_DATA).filter(key => {
                  const bookIndex = Object.keys(BOOK_DATA).indexOf(key)
                  return bookIndex >= 39 // Books 39+ are NT
                }).map(bookOsis => {
                  const bookInfo = BOOK_DATA[bookOsis]
                  return (
                    <button
                      key={bookOsis}
                      className="book-button"
                      onClick={() => handleBookSelect(bookOsis)}
                    >
                      {bookInfo.names.eng[0]}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {showChapterList && selectedBook && (
          <div className="doc-navigation-popup chapter-list">
            <h3>Select Chapter - {BOOK_DATA[selectedBook]?.names.eng[0]}</h3>
            <div className="nav-scroller">
              {Array.from({ length: BOOK_DATA[selectedBook]?.chapters.length || 0 }, (_, i) => (
                <button
                  key={i + 1}
                  className="chapter-button"
                  onClick={() => handleChapterSelect(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        
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
