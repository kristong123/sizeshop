# SizeShop Development Guide

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Firebase (optional for now):**
   - Create a Firebase project at https://console.firebase.google.com
   - Add your Firebase config to `src/firebase/config.ts` (create this file)

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Load extension in browser:**
   - Open Chrome/Edge and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder
   - The extension should now appear in your browser toolbar

## Project Structure

```
src/
├── components/          # Reusable React components
├── content/            # Content scripts (run on web pages)
├── background/         # Background service worker
├── popup/              # Extension popup UI
├── options/            # Extension options/settings page
├── sidebar/            # Sidebar mode UI
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global CSS styles
```

## Key Features to Implement

### 1. User Profile Setup
- Minimal measurement input (height, weight, chest, waist)
- Optional measurements (hip, shoulder, inseam)
- Body type selection (unisex/male/female)

### 2. Measurement Detection
- Automatic page scanning for clothing measurements
- Manual measurement input
- Measurement validation and confirmation

### 3. Body Visualization
- SVG-based body outline
- Clothing overlay visualization
- Fit score calculation

### 4. Extension Interface
- Popup mode (default)
- Sidebar mode (optional)
- Settings page
- Dark/light mode toggle

## Development Notes

- Use TypeScript for type safety
- Follow React functional component patterns
- Use Redux Toolkit for state management
- Implement responsive design with Tailwind CSS
- Test on multiple clothing websites

## Next Steps

1. Create Firebase configuration
2. Implement user authentication
3. Build body visualization component
4. Create measurement detection algorithms
5. Add clothing overlay functionality
6. Implement settings persistence
7. Add comprehensive testing

