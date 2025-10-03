import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserProfile, ExtensionSettings, ScanResult, ClothingItem } from '../types'

interface AppState {
  userProfile: UserProfile | null
  settings: ExtensionSettings
  lastScanResult: ScanResult | null
  currentClothingItem: ClothingItem | null
  isLoading: boolean
  error: string | null
}

const initialState: AppState = {
  userProfile: null,
  settings: {
    darkMode: false,
    sidebarMode: false,
    autoScan: true,
    showConfirmation: true
  },
  lastScanResult: null,
  currentClothingItem: null,
  isLoading: false,
  error: null
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.userProfile = action.payload
    },
    updateSettings: (state, action: PayloadAction<Partial<ExtensionSettings>>) => {
      state.settings = { ...state.settings, ...action.payload }
    },
    setLastScanResult: (state, action: PayloadAction<ScanResult>) => {
      state.lastScanResult = action.payload
    },
    setCurrentClothingItem: (state, action: PayloadAction<ClothingItem | null>) => {
      state.currentClothingItem = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  }
})

export const {
  setUserProfile,
  updateSettings,
  setLastScanResult,
  setCurrentClothingItem,
  setLoading,
  setError,
  clearError
} = appSlice.actions

export default appSlice.reducer

