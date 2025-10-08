import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { User, Ruler } from 'lucide-react'
import '../styles/globals.css'

interface MeasurementData {
  text: string
  value: number
  unit: 'cm' | 'inch'
  type: string
  size?: string
}

const Popup: React.FC = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')
  const [scanMessage, setScanMessage] = useState('')
  const [availableSizes, setAvailableSizes] = useState<string[]>([])
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [measurementsBySize, setMeasurementsBySize] = useState<{ [size: string]: MeasurementData[] }>({})

  const handleScanPage = async () => {
    setScanStatus('scanning')
    setScanMessage('Scanning page for measurements...')
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      if (!tab.id) {
        setScanStatus('error')
        setScanMessage('Unable to access current tab')
        setTimeout(() => setScanStatus('idle'), 3000)
        return
      }

      const response = await chrome.tabs.sendMessage(tab.id, { type: 'SCAN_PAGE' })
      
      if (response && response.success) {
        setScanStatus('success')
        const count = response.count || 0
        setScanMessage(`✓ Found ${count} measurement${count !== 1 ? 's' : ''}!`)
        
        // Store measurements by size
        if (response.measurementsBySize && response.availableSizes) {
          setMeasurementsBySize(response.measurementsBySize)
          setAvailableSizes(response.availableSizes)
          // Auto-select first size
          if (response.availableSizes.length > 0) {
            setSelectedSize(response.availableSizes[0])
          }
        }
      } else {
        setScanStatus('error')
        setScanMessage('No measurements found on this page. Try a product page with a size chart.')
        setAvailableSizes([])
        setMeasurementsBySize({})
      }
    } catch (error) {
      setScanStatus('error')
      setScanMessage('Failed to scan page. Make sure the content script is loaded.')
      console.error('Scan error:', error)
      setAvailableSizes([])
      setMeasurementsBySize({})
    }
    
    setTimeout(() => {
      setScanStatus('idle')
      setScanMessage('')
    }, 4000)
  }

  // Get measurements for selected size
  const currentMeasurements = selectedSize ? measurementsBySize[selectedSize] || [] : []
  
  const getMeasurementValue = (type: string): string => {
    const measurement = currentMeasurements.find(m => m.type === type)
    return measurement ? `${measurement.value}${measurement.unit === 'inch' ? '"' : 'cm'}` : '-'
  }

  return (
    <div className="w-80 h-96 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-4">
        {/* Header with Profile Icon */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">SizeShop</h1>
          
          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="py-2">
                  <button
                    onClick={() => chrome.runtime.openOptionsPage()}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Login/Signup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Size Selector - Only show if sizes are available */}
          {availableSizes.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Select Size</h3>
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-blue-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Body Figure Visualization with Measurements */}
          {selectedSize ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                  </div>
                </div>
                
                {/* Measurements */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Size {selectedSize} Measurements
                  </h3>
                  <div className="space-y-1.5">
                    {getMeasurementValue('shoulder') !== '-' && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Shoulder Width</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {getMeasurementValue('shoulder')}
                        </span>
                      </div>
                    )}
                    {getMeasurementValue('chest') !== '-' && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Chest</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {getMeasurementValue('chest')}
                        </span>
                      </div>
                    )}
                    {getMeasurementValue('waist') !== '-' && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Waist</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {getMeasurementValue('waist')}
                        </span>
                      </div>
                    )}
                    {getMeasurementValue('sleeve') !== '-' && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Sleeve Length</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {getMeasurementValue('sleeve')}
                        </span>
                      </div>
                    )}
                    {getMeasurementValue('length') !== '-' && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Total Length</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {getMeasurementValue('length')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                <Ruler className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Scan a product page to see measurements
              </p>
            </div>
          )}

          {/* Scan Button */}
          <div>
            <button
              onClick={handleScanPage}
              disabled={scanStatus === 'scanning'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              {scanStatus === 'scanning' ? 'Scanning...' : 'Scan Current Page'}
            </button>
            
            {/* Status Message */}
            {scanMessage && (
              <div className={`mt-2 text-sm text-center p-2 rounded ${
                scanStatus === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                scanStatus === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
              }`}>
                {scanMessage}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="border-t pt-4 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Click "Scan Current Page" on clothing sites to detect measurements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
)