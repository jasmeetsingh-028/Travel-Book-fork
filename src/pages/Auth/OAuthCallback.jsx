import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { toast } from 'sonner';
import axiosInstance from '../../utils/axiosInstance';

const OAuthCallback = () => {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const navigate = useNavigate();
  const { handleRedirectCallback } = useClerk();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Handle the OAuth callback when the component mounts
    const handleCallback = async () => {
      if (!isLoaded) return;

      try {
        console.log("Processing OAuth callback...");
        // Process the OAuth callback
        const result = await handleRedirectCallback({
          onRedirectError: (error) => {
            console.error('Redirect error:', error);
            setError('Authentication failed. Please try again.');
          },
        });
        
        if (isSignedIn && userId) {
          console.log("User is signed in with Clerk, userId:", userId);
          // Get user details from Clerk
          const user = result?.userData || {};
          console.log("User data from Clerk:", user);
          
          try {
            // Prepare user data from Google OAuth
            const userData = {
              email: user.emailAddresses?.[0]?.emailAddress,
              fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              profileImageUrl: user.imageUrl,
              clerkId: userId
            };
            
            console.log("Sending data to backend:", userData);
            
            // Make the request to your backend
            const response = await axiosInstance.post("/oauth/google", userData);
            
            console.log("Backend response:", response.data);
            
            if (response.data && response.data.accessToken) {
              // Save token to localStorage
              localStorage.setItem("token", response.data.accessToken);
              
              // Success message
              toast.success("Successfully authenticated!");
              
              // Force a complete page reload to refresh the authentication state
              // This ensures axiosInstance will use the new token for all future requests
              window.location.href = '/dashboard';
            } else {
              console.error("No access token in response:", response.data);
              setError("Authentication successful, but no access token received.");
            }
          } catch (apiError) {
            console.error("Backend API error:", apiError);
            setError(`Could not connect to our servers. Error: ${apiError.message}`);
          }
        } else {
          console.error("User not signed in with Clerk after redirect");
          setError("Authentication incomplete. Please try again.");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setError("Authentication failed. Please try again later.");
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [isLoaded, isSignedIn, userId, navigate, handleRedirectCallback]);

  // If there's an error, provide option to go back to login
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Authentication Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/login')} 
            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <div className="animate-spin mb-4 mx-auto h-12 w-12 border-4 border-cyan-500 dark:border-cyan-400 border-t-transparent dark:border-t-transparent rounded-full"></div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Completing authentication...</h2>
        <p className="text-gray-600 dark:text-gray-300">Please wait while we securely sign you in.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;