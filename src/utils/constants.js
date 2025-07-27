export const BASE_URL = import.meta.env.VITE_BACKEND_URL

// Check if we should use mock data
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// Mock mode indicator for development
// In production, never use mock mode if VITE_BACKEND_URL is properly set
export const IS_MOCK_MODE = (
  import.meta.env.DEV && (USE_MOCK_DATA || !import.meta.env.VITE_BACKEND_URL)
) || (
  !import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA === 'true'
)

// Admin mode - never use mock for admin functions in production
export const USE_REAL_ADMIN_API = import.meta.env.VITE_BACKEND_URL && !import.meta.env.DEV

