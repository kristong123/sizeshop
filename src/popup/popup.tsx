import React from 'react'
import ReactDOM from 'react-dom/client'
import '../styles/globals.css'

const Popup: React.FC = () => {
  return (
    <div className="w-80 h-96 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">SizeShop</h1>
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Click to login/signup</p>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Quick Actions</h2>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm">
              Scan Current Page
            </button>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Settings</h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Dark Mode</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Sidebar Mode</span>
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
    <Popup />
  </React.StrictMode>
)