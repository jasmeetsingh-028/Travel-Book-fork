import { toast } from 'sonner';
import { checkExistingAccount, getProviderFromMethod } from './firebase';
import React from 'react';

/**
 * Handles authentication errors and provides user-friendly messages
 * @param {Error} error - The error object from Firebase
 * @param {string} providerName - The name of the provider (e.g., 'Google', 'GitHub')
 */
export const handleAuthError = async (error, providerName = 'this') => {
  console.error(`${providerName} sign-in error:`, error);
  
  switch(error.code) {
    case 'auth/account-exists-with-different-credential':
      const email = error.customData?.email;
      
      if (email) {
        try {
          // Check which providers are available for this email
          const methods = await checkExistingAccount(email);
          
          if (methods && methods.length > 0) {
            const availableProviders = methods.map(method => getProviderFromMethod(method)).join(' or ');
            
            toast.error(`Account already exists with email ${email}. Please sign in with ${availableProviders} first.`, {
              duration: 8000,
              description: `This email is already associated with another sign-in method.`
            });
          } else {
            // Fallback if we can't determine the provider
            const suggestion = providerName.toLowerCase() === 'github' ? 'Google' : 
                              providerName.toLowerCase() === 'twitter' ? 'Google' : 'GitHub';
            
            toast.error(`Account already exists with email ${email}`, {
              duration: 8000,
              description: `Please try signing in with ${suggestion} or your email/password.`
            });
          }
        } catch (checkError) {
          console.error("Error checking existing account:", checkError);
          toast.error("Account already exists", {
            duration: 6000,
            description: "This email is already associated with another sign-in method. Please try signing in with a different method."
          });
        }
      } else {
        toast.error("Account already exists", {
          duration: 6000,
          description: "This email is already associated with another sign-in method. Please sign in with your original method."
        });
      }
      break;
      
    case 'auth/popup-closed-by-user':
      // User closed the popup, no need for an error message
      break;
      
    case 'auth/cancelled-popup-request':
      // Multiple popups, no need for an error message
      break;
      
    case 'auth/popup-blocked':
      toast.error("Popup Blocked", {
        duration: 6000,
        description: "The sign-in popup was blocked by your browser. Please allow popups for this site and try again."
      });
      break;
      
    case 'auth/timeout':
      toast.error("Authentication timeout", {
        duration: 5000,
        description: "The authentication process timed out. Please try again with a better internet connection."
      });
      break;
      
    default:
      toast.error(`${providerName} sign-in failed`, {
        duration: 4000,
        description: "Please try again or use a different sign-in method."
      });
  }
};
