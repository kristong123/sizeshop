// Background script for SizeShop extension
// Handles extension lifecycle and message passing

console.log('SizeShop background script loaded')

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'MEASUREMENTS_DETECTED':
      handleMeasurementsDetected(message, sender)
      break
    case 'GET_STORED_DATA':
      getStoredData(message.key, sendResponse)
      return true // Keep message channel open for async response
    case 'SET_STORED_DATA':
      setStoredData(message.key, message.value, sendResponse)
      return true
    default:
      sendResponse({ success: false, error: 'Unknown message type' })
  }
})

// Handle detected measurements
function handleMeasurementsDetected(message: any, sender: chrome.runtime.MessageSender): void {
  console.log('Measurements detected:', message.measurements)
  
  // Store measurements for popup to access
  chrome.storage.local.set({
    lastMeasurements: {
      measurements: message.measurements,
      measurementsBySize: message.measurementsBySize || {},
      availableSizes: message.availableSizes || [],
      url: message.url,
      timestamp: Date.now()
    }
  })
  
  // Notify popup if it's open
  chrome.runtime.sendMessage({
    type: 'NEW_MEASUREMENTS',
    measurements: message.measurements,
    measurementsBySize: message.measurementsBySize,
    availableSizes: message.availableSizes,
    url: message.url
  }).catch(() => {
    // Popup might not be open, ignore error
  })
}

// Get stored data
function getStoredData(key: string, sendResponse: (response: any) => void): void {
  chrome.storage.local.get([key], (result) => {
    sendResponse({ success: true, data: result[key] })
  })
}

// Set stored data
function setStoredData(key: string, value: any, sendResponse: (response: any) => void): void {
  chrome.storage.local.set({ [key]: value }, () => {
    sendResponse({ success: true })
  })
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.local.set({
      settings: {
        darkMode: false,
        sidebarMode: false,
        autoScan: true,
        showConfirmation: true
      }
    })
  }
})

