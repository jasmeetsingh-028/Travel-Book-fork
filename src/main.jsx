import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "react-day-picker/style.css"
import './scrollbar.css'; 
import { registerSW } from 'virtual:pwa-register'

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

// Suppress specific UNSAFE lifecycle warnings in development
// This helps with third-party libraries that haven't been updated
if (process.env.NODE_ENV === 'development') {
  const originalConsoleWarn = console.warn;
  console.warn = function filterWarnings(msg, ...args) {
    if (typeof msg === 'string' && msg.includes('UNSAFE_componentWillMount') && 
        msg.includes('SideEffect(NullComponent2)')) {
      return;
    }
    return originalConsoleWarn(msg, ...args);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)