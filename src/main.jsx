import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "react-day-picker/style.css"
import './scrollbar.css'; 
import { registerSW } from 'virtual:pwa-register'
import { ClerkProvider } from '@clerk/clerk-react'

// Get your Clerk publishable key from environment variables
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error("Missing Clerk publishable key. Make sure VITE_CLERK_PUBLISHABLE_KEY is set in your .env file.");
}

// Initialize dark mode based on local storage preference
const initializeDarkMode = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Run before app renders to prevent flash
initializeDarkMode();

// Register service worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={publishableKey}
      navigate={(to) => window.location.href = to}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
