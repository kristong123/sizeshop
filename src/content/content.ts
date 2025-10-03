// Content script for SizeShop extension
// This script runs on web pages to detect clothing measurements

import { detectAllMeasurements } from '../utils/measurementDetector'

console.log('SizeShop content script loaded')

// Function to scan page for clothing measurements using enhanced detection
function scanForMeasurements(): void {
  try {
    const measurements = detectAllMeasurements(document, window.location.href)
    
    console.log('SizeShop: Found', measurements.length, 'measurements')
    
    // Send measurements to background script
    if (measurements.length > 0) {
      chrome.runtime.sendMessage({
        type: 'MEASUREMENTS_DETECTED',
        measurements: measurements,
        url: window.location.href
      })
    }
  } catch (error) {
    console.error('SizeShop: Error scanning for measurements', error)
  }
}

// Function to highlight measurement text on page
function highlightMeasurements(): void {
  const textNodes = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  )
  
  const measurementPattern = /\b(\d+(?:\.\d+)?)\s*(?:cm|centimeter|inch|in)\b/g
  
  let node: Text | null
  while (node = textNodes.nextNode() as Text) {
    const text = node.textContent
    if (text && measurementPattern.test(text)) {
      const highlightedText = text.replace(
        measurementPattern,
        '<span style="background-color: yellow; padding: 2px;">$&</span>'
      )
      
      const wrapper = document.createElement('div')
      wrapper.innerHTML = highlightedText
      
      node.parentNode?.replaceChild(wrapper, node)
    }
  }
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'SCAN_PAGE':
      scanForMeasurements()
      sendResponse({ success: true })
      break
    case 'HIGHLIGHT_MEASUREMENTS':
      highlightMeasurements()
      sendResponse({ success: true })
      break
    default:
      sendResponse({ success: false })
  }
})

// Auto-scan on page load (can be disabled in settings)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scanForMeasurements)
} else {
  scanForMeasurements()
}

