import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun, FaDesktop } from 'react-icons/fa';

const ThemeToggle = () => {
  // Theme options: 'light', 'dark', 'system'
  const [theme, setTheme] = useState(() => {
    // Check for saved theme preference
    return localStorage.getItem('theme') || 'system';
  });

  // Apply the theme when component mounts or theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = () => {
      if (theme === 'dark') {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        // System preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        localStorage.setItem('theme', 'system');
      }
    };
    
    applyTheme();
    
    // Listen for system preference changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    // Cycle through themes: light -> dark -> system -> light
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  // Determine which icon to show
  const renderThemeIcon = () => {
    if (theme === 'system') {
      return <FaDesktop className="text-gray-600 dark:text-gray-300 text-lg" />;
    } else if (theme === 'dark') {
      return <FaSun className="text-yellow-400 text-lg" />;
    } else {
      return <FaMoon className="text-gray-700 text-lg" />;
    }
  };

return (
  <div className="relative group">
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {renderThemeIcon()}
    </button>

    {/* Clean tooltip shown on hover */}
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs font-medium text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {theme === 'light' ? 'Light Mode' : theme === 'dark' ? 'Dark Mode' : 'System Default'}
    </div>
  </div>
);

};

export default ThemeToggle;