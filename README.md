# SizeShop

A web extension that helps users visualize how clothing will fit based on their measurements while online shopping.

## Overview

SizeShop provides a visual interface that overlays clothing measurements onto a personalized body outline, helping users make better purchasing decisions when shopping online.

## Features

### Core Functionality
- **User Profile Setup**: Minimal measurement input (essential measurements only)
- **Body Visualization**: Scaled body outline based on user measurements
- **Clothing Measurement Detection**: Automatic scanning of web pages for clothing measurements
- **Fit Visualization**: Overlay clothing measurements on user's body outline
- **Manual Adjustment**: Users can confirm or adjust detected measurements

### User Experience
- **Flexible Interface**: Option to display as sidebar or popup window
- **Clean Design**: Modern, minimal interface with light/dark mode support
- **Efficient Setup**: Streamlined onboarding process to minimize user friction

## Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for styling and responsive design
- **Redux Toolkit** for state management
- **Framer Motion** for smooth animations

### Backend & Database
- **Firebase** (free tier) for:
  - Authentication (Firebase Auth)
  - Database (Firestore)
  - Hosting (Firebase Hosting)

### Extension Development
- **Web Extension Manifest V3** for Chrome/Firefox compatibility
- **Chrome Extension APIs** for web page interaction
- **Content Scripts** for measurement detection

### Development Tools
- **ESLint** + **Prettier** for code quality
- **TypeScript** for type safety
- **Jest** + **React Testing Library** for testing

## Project Structure

```
sizeshop/
├── src/
│   ├── components/          # React components
│   ├── content/            # Content scripts for web page interaction
│   ├── background/         # Background scripts
│   ├── popup/              # Extension popup UI
│   ├── options/            # Extension options page
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── manifest.json           # Extension manifest
└── package.json
```

## Getting Started

1. Install dependencies: `npm install`
2. Set up Firebase project and add configuration
3. Run development server: `npm run dev`
4. Load extension in browser for testing

## Design Decisions

- **Body Type**: Simplified to unisex figure for ease of use and inclusivity
- **Essential Measurements**: Only 3 required measurements (height, shoulder width, waist) with optional fields for better accuracy
- **Measurement Detection**: Enhanced multi-website support including:
  - Amazon, ASOS, Zara, H&M, Uniqlo, Nike, Adidas
  - Generic detection for any shopping site
  - Table-based size chart parsing
  - Text pattern matching with confidence scoring
- **Database**: Firebase (free tier) for authentication and cloud sync

---

*This project is in active development. Feel free to ask questions or suggest improvements!*