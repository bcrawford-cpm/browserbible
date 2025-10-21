import React, { useState, useEffect, useRef } from 'react'
import { BOOK_DATA } from '../data/bibleData.js'
import './ReaderApp.css'

function ReaderApp() {
  const [version1, setVersion1] = useState('eng_kjv')
  const [version2, setVersion2] = useState('')
  const [currentReference, setCurrentReference] = useState('John.1')
  const [chapters, setChapters] = useState([])
  const [showVersionNav, setShowVersionNav] = useState(false)
  const [showReferenceNav, setShowReferenceNav] = useState(false)

  // Parse reference to get book and chapter
  const parseReference = (ref) => {
    const parts = ref.split('.')
    return {
      book: parts[0],
      chapter: parseInt(parts[1]) || 1
    }
  }

  const { book, chapter } = parseReference(currentReference)
  const bookData = BOOK_DATA[book]
  const bookName = bookData ? bookData.names.eng[0] : 'Unknown'

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

  useEffect(() => {
    const loadChapters = async () => {
      const chapterData = []
      
      // Load current chapter and adjacent chapters for smooth scrolling
      for (let i = Math.max(1, chapter - 1); i <= Math.min(chapter + 1, bookData?.chapters.length || chapter); i++) {
        const html1 = await loadChapter(book, i, version1)
        const html2 = version2 ? await loadChapter(book, i, version2) : null
        
        chapterData.push({
          chapter: i,
          osis: `${book}.${i}`,
          html1,
          html2
        })
      }
      
      setChapters(chapterData)
    }

    if (book && chapter) {
      loadChapters()
    }
  }, [book, chapter, version1, version2])

  const navigateToReference = (newRef) => {
    setCurrentReference(newRef)
    setShowReferenceNav(false)
  }

  const toggleVersion = (versionNum) => {
    if (versionNum === 1) {
      setShowVersionNav(showVersionNav === 1 ? false : 1)
    } else {
      setShowVersionNav(showVersionNav === 2 ? false : 2)
    }
    setShowReferenceNav(false)
  }

  return (
    <div className="reader-app">
      <div className="reader-container">
        <div className="reader-header">
          {version2 && (
            <span 
              className="version-selector" 
              onClick={() => toggleVersion(2)}
            >
              {version2 || 'V2'}
            </span>
          )}
          <span 
            className="version-selector" 
            onClick={() => toggleVersion(1)}
          >
            {version1}
          </span>
          <span className="logo">Bible</span>
          <span 
            className="reference-selector"
            onClick={() => {
              setShowReferenceNav(!showReferenceNav)
              setShowVersionNav(false)
            }}
          >
            {bookName} {chapter}
          </span>
        </div>
        
        <div className="reader-main">
          <div className="reader-content">
            <table>
              <tbody>
                {chapters.map((chap) => (
                  <tr key={chap.osis} data-osis={chap.osis}>
                    <td 
                      className="bible-text"
                      dangerouslySetInnerHTML={{ __html: chap.html1 }}
                    />
                    {chap.html2 && (
                      <td 
                        className="bible-text"
                        dangerouslySetInnerHTML={{ __html: chap.html2 }}
                      />
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showReferenceNav && (
          <div className="reference-navigation">
            <h3>Go to Reference</h3>
            <div className="book-list">
              {Object.keys(BOOK_DATA).slice(0, 10).map((bookKey) => (
                <button 
                  key={bookKey}
                  onClick={() => navigateToReference(`${bookKey}.1`)}
                >
                  {BOOK_DATA[bookKey].names.eng[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReaderApp
