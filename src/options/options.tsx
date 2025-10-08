import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import '../styles/globals.css'

// Toggle Switch Component
interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label: string
  description?: string
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        {description && (
          <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

interface Settings {
  measurementUnit: 'cm' | 'inch'
  darkMode: boolean
  sidebarMode: boolean
  autoScan: boolean
  showConfirmation: boolean
}

const Options: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    measurementUnit: 'cm',
    darkMode: false,
    sidebarMode: false,
    autoScan: true,
    showConfirmation: false
  })
  const [saveStatus, setSaveStatus] = useState('')

  // Load settings on mount
  useEffect(() => {
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings({ ...settings, ...result.settings })
      }
    })
  }, [])

  // Save setting immediately when changed
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    chrome.storage.sync.set({ settings: newSettings }, () => {
      setSaveStatus('Saved!')
      setTimeout(() => setSaveStatus(''), 2000)
    })
  }

  const unitLabel = settings.measurementUnit === 'cm' ? 'cm' : 'in'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">SizeShop Settings</h1>
          {saveStatus && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              {saveStatus}
            </span>
          )}
        </div>
        
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Your Measurements</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Enter your basic measurements to get started. Only 3 measurements required!
            </p>
            
            <div className="space-y-4">
              {/* Unit Selection */}
              <div className="flex items-center gap-4 pb-4 border-b dark:border-gray-700">
                <span className="text-sm font-medium">Measurement Unit:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSetting('measurementUnit', 'cm')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      settings.measurementUnit === 'cm'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Centimeters (cm)
                  </button>
                  <button
                    onClick={() => updateSetting('measurementUnit', 'inch')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      settings.measurementUnit === 'inch'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    Inches (in)
                  </button>
                </div>
              </div>

              {/* Essential Measurements */}
              <div className="border-b pb-4 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-blue-600 mb-3">Essential Measurements *</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Height ({unitLabel}) *
                    </label>
                    <input 
                      type="number" 
                      placeholder={settings.measurementUnit === 'cm' ? '170' : '67'}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Shoulder Width ({unitLabel}) *
                    </label>
                    <input 
                      type="number" 
                      placeholder={settings.measurementUnit === 'cm' ? '45' : '18'}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Waist ({unitLabel}) *
                    </label>
                    <input 
                      type="number" 
                      placeholder={settings.measurementUnit === 'cm' ? '80' : '31'}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    />
                  </div>
                </div>
              </div>
              
              {/* Optional Measurements */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  Optional (for better accuracy)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chest ({unitLabel})</label>
                    <input 
                      type="number" 
                      placeholder="Optional"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hip ({unitLabel})</label>
                    <input 
                      type="number" 
                      placeholder="Optional"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inseam ({unitLabel})</label>
                    <input 
                      type="number" 
                      placeholder="Optional"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Weight ({settings.measurementUnit === 'cm' ? 'kg' : 'lbs'})
                    </label>
                    <input 
                      type="number" 
                      placeholder="Optional"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    />
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                Save Measurements
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
            <div className="divide-y dark:divide-gray-700">
              <ToggleSwitch
                enabled={settings.darkMode}
                onChange={(value) => updateSetting('darkMode', value)}
                label="Dark Mode"
                description="Enable dark theme across the extension"
              />
              <ToggleSwitch
                enabled={settings.sidebarMode}
                onChange={(value) => updateSetting('sidebarMode', value)}
                label="Sidebar Mode"
                description="Show measurements in a sidebar instead of popup"
              />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Measurement Detection</h2>
            <div className="divide-y dark:divide-gray-700">
              <ToggleSwitch
                enabled={settings.autoScan}
                onChange={(value) => updateSetting('autoScan', value)}
                label="Auto-scan pages"
                description="Automatically detect measurements when visiting product pages"
              />
              <ToggleSwitch
                enabled={settings.showConfirmation}
                onChange={(value) => updateSetting('showConfirmation', value)}
                label="Show confirmations"
                description="Display a dialog before applying detected measurements"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
)