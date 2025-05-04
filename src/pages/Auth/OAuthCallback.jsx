import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const OAuthCallback = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // OAuth callback functionality has been removed
    toast.error("OAuth functionality has been disabled");
    navigate('/login');
  }, [navigate]);

  // Simple loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <div className="animate-spin mb-4 mx-auto h-12 w-12 border-4 border-cyan-500 dark:border-cyan-400 border-t-transparent dark:border-t-transparent rounded-full"></div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Redirecting...</h2>
        <p className="text-gray-600 dark:text-gray-300">OAuth functionality has been disabled.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;