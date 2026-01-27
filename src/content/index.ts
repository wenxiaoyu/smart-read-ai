// Content Script - runs in the context of web pages
console.log('Demumu content script loaded on:', window.location.href)

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Message received in content script:', message)

  if (message.type === 'GREETING') {
    console.log('Greeting message:', message.payload)

    // Show a notification on the page
    showNotification(message.payload.message)

    sendResponse({ success: true, message: 'Message received by content script' })
  }

  return true
})

// Example: Add a visual notification to the page
function showNotification(message: string) {
  const notification = document.createElement('div')
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  `

  // Add animation
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `
  document.head.appendChild(style)

  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Example: Send a message to background on page load
chrome.runtime.sendMessage(
  {
    type: 'PAGE_LOADED',
    payload: { url: window.location.href },
  },
  (response) => {
    if (response) {
      console.log('Response from background:', response)
    }
  }
)

// Example: Observe DOM changes (if needed)
// Uncomment to use:
// const observer = new MutationObserver((_mutations) => {
//   // Handle DOM changes here
//   console.log('DOM changed')
// })
// observer.observe(document.body, { childList: true, subtree: true })
