// Import the necessary Firebase packages
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  TwitterAuthProvider,
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider
} from 'firebase/auth';

import { IS_MOCK_MODE } from './constants';
import { 
  signInWithGooglePopup as mockSignInWithGoogle,
  signInWithGitHubPopup as mockSignInWithGithub,
  signInWithTwitterPopup as mockSignInWithTwitter,
  signOutUser as mockSignOutUser,
  onAuthStateChangedListener as mockOnAuthStateChangedListener
} from './mockFirebase';

// Your Firebase configuration
// Replace these values with your actual Firebase project config
// You'll need to create a Firebase project and get these values from the Firebase console

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if not in mock mode and config is available
let auth, googleProvider, githubProvider, twitterProvider;

if (!IS_MOCK_MODE && firebaseConfig.apiKey) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  githubProvider = new GithubAuthProvider();
  twitterProvider = new TwitterAuthProvider();

  // Configure Google provider (optional settings)
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  // Configure GitHub provider (optional settings)
  githubProvider.setCustomParameters({
    allow_signup: 'true'
  });

  // Configure Twitter provider (optional settings)
  twitterProvider.setCustomParameters({
    'lang': 'en'
  });

  // Add scopes to GitHub provider
  githubProvider.addScope('user:email');
  githubProvider.addScope('read:user');
}

// Google sign-in function
export const signInWithGoogle = async () => {
  if (IS_MOCK_MODE) {
    return await mockSignInWithGoogle();
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Get the Firebase ID token
    const idToken = await user.getIdToken();
    
    // The user info from Google
    return {
      user,
      idToken,
      // The Google OAuth access token (can be used to access Google APIs)
      credential: GoogleAuthProvider.credentialFromResult(result)
    };
  } catch (error) {
    // Handle Errors here.
    console.error("Google sign-in error:", error);
    
    // If the error is about accounts with different credentials,
    // store the pending credential for later linking
    if (error.code === 'auth/account-exists-with-different-credential') {
      const pendingCred = GoogleAuthProvider.credentialFromError(error);
      
      // Store for later use if needed
      if (pendingCred) {
        sessionStorage.setItem('pendingCredential', JSON.stringify({
          providerId: pendingCred.providerId,
          signInMethod: pendingCred.signInMethod,
          email: error.customData?.email
        }));
      }
    }
    
    throw error;
  }
};

// GitHub sign-in function
export const signInWithGithub = async () => {
  if (IS_MOCK_MODE) {
    return await mockSignInWithGithub();
  }

  try {
    // Configure GitHub provider to get email
    githubProvider.addScope('user:email');
    
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    
    // Get the Firebase ID token
    const idToken = await user.getIdToken();
    
    // The user info from GitHub
    return {
      user,
      idToken,
      // The GitHub OAuth access token (can be used to access GitHub APIs)
      credential: GithubAuthProvider.credentialFromResult(result)
    };
  } catch (error) {
    // Handle Errors here.
    console.error("GitHub sign-in error:", error);
    
    // If the error is about accounts with different credentials,
    // store the pending credential for later linking
    if (error.code === 'auth/account-exists-with-different-credential') {
      const pendingCred = GithubAuthProvider.credentialFromError(error);
      
      // Store for later use if needed
      if (pendingCred) {
        sessionStorage.setItem('pendingCredential', JSON.stringify({
          providerId: pendingCred.providerId,
          signInMethod: pendingCred.signInMethod,
          email: error.customData?.email
        }));
      }
    }
    
    throw error;
  }
};

// Twitter sign-in function
export const signInWithTwitter = async () => {
  if (IS_MOCK_MODE) {
    return await mockSignInWithTwitter();
  }

  try {
    const result = await signInWithPopup(auth, twitterProvider);
    const user = result.user;
    
    // Get the Firebase ID token
    const idToken = await user.getIdToken();
    
    // The user info from Twitter
    return {
      user,
      idToken,
      // The Twitter OAuth access token (can be used to access Twitter APIs)
      credential: TwitterAuthProvider.credentialFromResult(result)
    };
  } catch (error) {
    // Handle Errors here.
    console.error("Twitter sign-in error:", error);
    
    // If the error is about accounts with different credentials,
    // store the pending credential for later linking
    if (error.code === 'auth/account-exists-with-different-credential') {
      const pendingCred = TwitterAuthProvider.credentialFromError(error);
      
      // Store for later use if needed
      if (pendingCred) {
        sessionStorage.setItem('pendingCredential', JSON.stringify({
          providerId: pendingCred.providerId,
          signInMethod: pendingCred.signInMethod,
          email: error.customData?.email
        }));
      }
    }
    
    throw error;
  }
};

// Sign out function
export const signOutUser = async () => {
  if (IS_MOCK_MODE) {
    return await mockSignOutUser();
  }

  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChangedListener = (callback) => {
  if (IS_MOCK_MODE) {
    return mockOnAuthStateChangedListener(callback);
  }

  return onAuthStateChanged(auth, callback);
};

// Function to check if an email already exists and return sign-in methods
export const checkExistingAccount = async (email) => {
  if (IS_MOCK_MODE) {
    // Mock implementation - return empty array (no existing methods)
    return [];
  }

  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods;
  } catch (error) {
    console.error("Error checking existing account:", error);
    throw error;
  }
};

/**
 * Gets the provider name from the sign-in method string
 * @param {string} method - The sign-in method string from Firebase
 * @returns {string} The provider name (Google, GitHub, Email, etc.)
 */
export const getProviderFromMethod = (method) => {
  switch(method) {
    case 'google.com':
      return 'Google';
    case 'github.com':
      return 'GitHub';
    case 'twitter.com':
      return 'Twitter';
    case 'password':
      return 'Email/Password';
    case 'phone':
      return 'Phone';
    default:
      return method;
  }
};

/**
 * Attempt to link a new provider to an existing account
 * This is useful when a user has accounts with different providers but the same email
 * @param {object} currentUser - The currently logged-in Firebase user
 * @param {object} credential - The credential from the new provider
 * @returns {Promise<object>} The linked user account
 */
export const linkAccounts = async (currentUser, credential) => {
  if (IS_MOCK_MODE) {
    // Mock implementation - just return the current user
    return currentUser;
  }

  try {
    const result = await linkWithCredential(currentUser, credential);
    return result.user;
  } catch (error) {
    console.error("Error linking accounts:", error);
    throw error;
  }
};

// For all the link functions, add mock mode support
export const linkGithubToGoogleAccount = async (credential) => {
  if (IS_MOCK_MODE) return null;
  
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }
    
    const result = await linkWithCredential(auth.currentUser, credential);
    return result.user;
  } catch (error) {
    console.error('Error linking GitHub account:', error);
    throw error;
  }
};

export const linkGoogleToGithubAccount = async (credential) => {
  if (IS_MOCK_MODE) return null;
  
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }
    
    const result = await linkWithCredential(auth.currentUser, credential);
    return result.user;
  } catch (error) {
    console.error('Error linking Google account:', error);
    throw error;
  }
};

export const linkTwitterToGoogleAccount = async (credential) => {
  if (IS_MOCK_MODE) return null;
  
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }
    
    const result = await linkWithCredential(auth.currentUser, credential);
    return result.user;
  } catch (error) {
    console.error('Error linking Twitter account:', error);
    throw error;
  }
};

export const linkTwitterToGithubAccount = async (credential) => {
  if (IS_MOCK_MODE) return null;
  
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }
    
    const result = await linkWithCredential(auth.currentUser, credential);
    return result.user;
  } catch (error) {
    console.error('Error linking Twitter account:', error);
    throw error;
  }
};

export const linkGoogleToTwitterAccount = async (credential) => {
  if (IS_MOCK_MODE) return null;
  
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }
    
    const result = await linkWithCredential(auth.currentUser, credential);
    return result.user;
  } catch (error) {
    console.error('Error linking Google account:', error);
    throw error;
  }
};

export const linkGithubToTwitterAccount = async (credential) => {
  if (IS_MOCK_MODE) return null;
  
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }
    
    const result = await linkWithCredential(auth.currentUser, credential);
    return result.user;
  } catch (error) {
    console.error('Error linking GitHub account:', error);
    throw error;
  }
};

export { auth, googleProvider, githubProvider, twitterProvider };
