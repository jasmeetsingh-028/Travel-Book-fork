import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const GoogleOAuthButton = ({ mode = 'sign-in', className = '' }) => {
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthenticating(true);
      toast.info("Google OAuth is currently disabled");
      // Removed Clerk implementation
      setTimeout(() => {
        setIsAuthenticating(false);
      }, 1000);
    } catch (error) {
      console.error('OAuth error:', error);
      toast.error('Authentication method not available');
      setIsAuthenticating(false);
    }
  };

  return (
    <motion.button
      type="button"
      className={`w-full py-3 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
      rounded-lg font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 
      transition-colors duration-300 flex items-center justify-center gap-3 ${className}`}
      onClick={handleGoogleSignIn}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isAuthenticating}
    >
      {isAuthenticating ? (
        <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
      ) : (
        <FcGoogle size={20} />
      )}
      <span>{mode === 'sign-in' ? 'Sign in with Google' : 'Sign up with Google'}</span>
    </motion.button>
  );
};

export default GoogleOAuthButton;