import React from 'react';
import { IS_MOCK_MODE } from '../utils/constants';

const MockDataBadge = () => {
  if (!IS_MOCK_MODE) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm bg-opacity-90 border border-white border-opacity-20">
        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
        Demo Mode
      </div>
    </div>
  );
};

export default MockDataBadge;
