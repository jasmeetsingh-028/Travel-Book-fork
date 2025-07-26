import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdInfo, MdCode } from 'react-icons/md';
import { IS_MOCK_MODE } from '../utils/constants';

const MockModeNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show notification only in mock mode and if not previously dismissed
    const dismissed = localStorage.getItem('mock_mode_notification_dismissed');
    if (IS_MOCK_MODE && !dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('mock_mode_notification_dismissed', 'true');
  };

  const handleDontShowAgain = () => {
    localStorage.setItem('mock_mode_notification_dismissed', 'true');
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!IS_MOCK_MODE || isDismissed || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MdCode className="text-xl flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    🎭 Demo Mode Active
                  </p>
                  <p className="text-xs opacity-90">
                    You're viewing Travel Book with mock data. All features work normally but no real data is saved.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={handleDontShowAgain}
                  className="text-xs px-2 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors whitespace-nowrap"
                >
                  Don't show again
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  aria-label="Close notification"
                >
                  <MdClose className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MockModeNotification;
