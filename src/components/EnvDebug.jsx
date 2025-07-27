import React from 'react';

const EnvDebug = () => {
  const envInfo = {
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    VITE_USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA,
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs font-mono max-w-md z-50">
      <h3 className="font-bold mb-2">Environment Debug</h3>
      {Object.entries(envInfo).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="text-gray-300">{key}:</span>
          <span className="text-green-300 ml-2">{String(value)}</span>
        </div>
      ))}
    </div>
  );
};

export default EnvDebug;
