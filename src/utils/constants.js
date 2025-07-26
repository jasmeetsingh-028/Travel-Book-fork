export const BASE_URL = import.meta.env.VITE_BACKEND_URL

// Check if we should use mock data
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// Mock mode indicator for development
export const IS_MOCK_MODE = USE_MOCK_DATA || !import.meta.env.VITE_BACKEND_URL || import.meta.env.DEV

