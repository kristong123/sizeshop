// TypeScript type definitions for SizeShop

export interface UserProfile {
  id?: string
  bodyType: 'unisex' // Simplified to unisex only
  // Essential measurements
  height: number // in cm
  shoulderWidth: number // in cm
  waist: number // in cm
  // Optional measurements for better accuracy
  chest?: number // in cm
  hip?: number // in cm
  inseam?: number // in cm
  weight?: number // in kg
}

export interface ClothingItem {
  id: string
  type: 'shirt' | 'pants' | 'dress' | 'jacket' | 'other'
  brand?: string
  measurements: {
    chest?: number
    waist?: number
    length?: number
    sleeve?: number
    inseam?: number
    shoulder?: number
  }
  url: string
  imageUrl?: string
}

export interface DetectedMeasurement {
  text: string
  value: number
  unit: 'cm' | 'inch'
  type: 'chest' | 'waist' | 'length' | 'sleeve' | 'inseam' | 'shoulder' | 'unknown'
  confidence: number // 0-1
}

export interface ExtensionSettings {
  darkMode: boolean
  sidebarMode: boolean
  autoScan: boolean
  showConfirmation: boolean
}

export interface ScanResult {
  measurements: DetectedMeasurement[]
  url: string
  timestamp: number
  clothingType?: string
}

export interface BodyVisualization {
  userProfile: UserProfile
  clothingItem?: ClothingItem
  fitScore?: number // 0-100
}

// Chrome extension message types
export interface ChromeMessage {
  type: string
  [key: string]: any
}

export interface MeasurementDetectedMessage extends ChromeMessage {
  type: 'MEASUREMENTS_DETECTED'
  measurements: DetectedMeasurement[]
  url: string
}

export interface ScanPageMessage extends ChromeMessage {
  type: 'SCAN_PAGE'
}

export interface HighlightMeasurementsMessage extends ChromeMessage {
  type: 'HIGHLIGHT_MEASUREMENTS'
}

