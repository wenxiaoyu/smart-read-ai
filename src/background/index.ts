// Background Service Worker
console.log('Background service worker loaded')

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason)

  if (details.reason === 'install') {
    // Initialize storage on first install
    chrome.storage.local.set({ count: 0 })
    console.log('Extension installed, storage initialized')
  } else if (details.reason === 'update') {
    console.log('Extension updated to version:', chrome.runtime.getManifest().version)
  }
})

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message)

  if (message.type === 'GREETING') {
    console.log('Greeting from:', sender.tab?.id || 'popup')
    sendResponse({ success: true, message: 'Hello from background!' })
  }

  // Return true to indicate we will send a response asynchronously
  return true
})

// Listen for tab updates
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url)
  }
})

// Example: Handle browser action click (if needed)
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.id)
})
