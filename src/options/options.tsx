import React from 'react'
import ReactDOM from 'react-dom/client'
import '../styles/globals.css'

const Options: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">SizeShop Settings</h1>
        
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Your Measurements</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Enter your basic measurements to get started. Only 3 measurements required!
            </p>
            
            <div className="space-y-4">
              {/* Essential Measurements */}
              <div className="border-b pb-4">
                <h3 className="text-sm font-semibold text-blue-600 mb-3">Essential Measurements *</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Height (cm) *
                    </label>
                    <input 
                      type="number" 
                      placeholder="170"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Shoulder Width (cm) *
                    </label>
                    <input 
                      type="number" 
                      placeholder="45"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Waist (cm) *
                    </label>
                    <input 
                      type="number" 
                      placeholder="80"
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
                    <label className="block text-sm font-medium mb-2">Chest (cm)</label>
                    <input 
                      type="number" 
                      placeholder="Optional"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hip (cm)</label>
                    <input 
                      type="number" 
                      placeholder="Optional"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inseam (cm)</label>
                    <input 
                      type="number" 
                      placeholder="Optional"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight (kg)</label>
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
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <span>Dark Mode</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <span>Sidebar Mode (instead of popup)</span>
              </label>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Measurement Detection</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <span>Auto-scan pages for measurements</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <span>Show confirmation dialog before applying measurements</span>
              </label>
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