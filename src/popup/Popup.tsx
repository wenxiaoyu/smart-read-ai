import { useState, useEffect } from 'react'
import './popup.css'

function Popup() {
  const [count, setCount] = useState(0)
  const [currentTab, setCurrentTab] = useState<string>('')

  useEffect(() => {
    // Load saved count from storage
    chrome.storage.local.get(['count'], (result) => {
      if (result.count !== undefined && result.count !== null) {
        setCount(result.count as number)
      }
    })

    // Get current tab info
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentTab(tabs[0].url)
      }
    })
  }, [])

  const handleIncrement = () => {
    const newCount = count + 1
    setCount(newCount)
    chrome.storage.local.set({ count: newCount })
  }

  const handleSendMessage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'GREETING',
          payload: { message: 'Hello from popup!' },
        })
      }
    })
  }

  return (
    <div className="popup-container">
      <h1>Demumu Extension</h1>
      <div className="card">
        <p>Current tab:</p>
        <code className="tab-url">{currentTab || 'Loading...'}</code>
      </div>
      <div className="card">
        <p>Counter: {count}</p>
        <button onClick={handleIncrement}>Increment</button>
      </div>
      <div className="card">
        <button onClick={handleSendMessage}>Send Message to Content Script</button>
      </div>
      <p className="footer">Built with React + TypeScript + Vite</p>
    </div>
  )
}

export default Popup
