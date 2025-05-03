import React, { useState } from 'react';
import { useSignIn, useAuth } from '@clerk/clerk-react';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const GoogleOAuthButton = ({ mode = 'sign-in', className = '' }) => {
  const { signIn, isLoaded } = useSignIn();
  const { isSignedIn, signOut } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isLoaded || isAuthenticating) return;

    try {
      setIsAuthenticating(true);
      
      // Check if user is already signed in
      if (isSignedIn) {
        // Sign out the current user first
        await signOut();
        toast.info("Signed out of previous session");
      }
      
      // Use the EXACT redirect URL that is configured in Google OAuth credentials
      // This MUST match what's in your Google Cloud Console
      // The URL should be one of the authorized redirect URIs in your Google OAuth client configuration
      
      // Use window.location.origin to dynamically determine the base URL in different environments
      const origin = window.location.origin;
      // Map of possible origins and their respective redirect URIs
      const redirectMap = {
        'http://localhost:5173': 'https://hardy-cat-12.clerk.accounts.dev/v1/oauth_callback',
        'https://travel-book-opal.vercel.app': 'https://hardy-cat-12.clerk.accounts.dev/v1/oauth_callback',
        'https://travelbook.sahilportfolio.me': 'https://hardy-cat-12.clerk.accounts.dev/v1/oauth_callback',
        'https://travelbook.sahilfolio.live': 'https://hardy-cat-12.clerk.accounts.dev/v1/oauth_callback'
      };
      
      // Get the appropriate redirect URI for the current origin
      const redirectUrl = redirectMap[origin] || 'https://hardy-cat-12.clerk.accounts.dev/v1/oauth_callback';
      
      console.log("Using redirect URL:", redirectUrl);
      
      // Now proceed with Google authentication
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: redirectUrl,
        // Remove redirectUrlComplete to avoid conflicts
      });
    } catch (error) {
      console.error('OAuth error:', error);
      
      // Display more specific error message based on the error
      if (error.message && error.message.includes('single session mode')) {
        toast.error('You need to sign out of your current account first');
      } else {
        toast.error('Authentication failed. Please try again.');
      }
      
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
      disabled={!isLoaded || isAuthenticating}
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