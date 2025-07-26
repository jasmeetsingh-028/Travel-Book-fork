// Mock Firebase services for development/testing
// This provides mock implementations of Firebase auth functionality

import { IS_MOCK_MODE } from './constants';
import { getDefaultMockUser } from './mockData';

// Mock user object
const createMockFirebaseUser = (userData = {}) => ({
  uid: userData.uid || 'mock_firebase_uid_123',
  email: userData.email || 'demo@travelbook.com',
  displayName: userData.displayName || 'Demo User',
  photoURL: userData.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  emailVerified: true,
  providerId: userData.providerId || 'google.com'
});

// Mock Firebase Auth methods
export const mockFirebaseAuth = {
  // Mock Google Sign In
  signInWithGooglePopup: async () => {
    if (!IS_MOCK_MODE) return null;
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
    
    const mockUser = createMockFirebaseUser({
      email: 'demo@travelbook.com',
      displayName: 'Demo User (Google)',
      providerId: 'google.com'
    });
    
    return {
      user: mockUser,
      _tokenResponse: {
        idToken: 'mock_google_id_token',
        accessToken: 'mock_google_access_token'
      }
    };
  },

  // Mock GitHub Sign In
  signInWithGitHubPopup: async () => {
    if (!IS_MOCK_MODE) return null;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = createMockFirebaseUser({
      email: 'demo@travelbook.com',
      displayName: 'Demo User (GitHub)',
      providerId: 'github.com',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    });
    
    return {
      user: mockUser,
      _tokenResponse: {
        idToken: 'mock_github_id_token',
        accessToken: 'mock_github_access_token'
      }
    };
  },

  // Mock Twitter Sign In
  signInWithTwitterPopup: async () => {
    if (!IS_MOCK_MODE) return null;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = createMockFirebaseUser({
      email: 'demo@travelbook.com',
      displayName: 'Demo User (Twitter)',
      providerId: 'twitter.com',
      photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    });
    
    return {
      user: mockUser,
      _tokenResponse: {
        idToken: 'mock_twitter_id_token',
        accessToken: 'mock_twitter_access_token'
      }
    };
  },

  // Mock Sign Out
  signOutUser: async () => {
    if (!IS_MOCK_MODE) return null;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  },

  // Mock Auth State Change Listener
  onAuthStateChangedListener: (callback) => {
    if (!IS_MOCK_MODE) return () => {};
    
    // Simulate auth state change after a delay
    setTimeout(() => {
      const token = localStorage.getItem('token');
      if (token && token.startsWith('mock_')) {
        callback(createMockFirebaseUser());
      } else {
        callback(null);
      }
    }, 100);
    
    // Return unsubscribe function
    return () => {};
  }
};

// Mock Firebase Storage methods
export const mockFirebaseStorage = {
  uploadFile: async (file, path) => {
    if (!IS_MOCK_MODE) return null;
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
    
    // Return a mock download URL
    const randomId = Math.floor(Math.random() * 1000000);
    return `https://images.unsplash.com/photo-${1500000000000 + randomId}?w=800&h=600&fit=crop`;
  },

  deleteFile: async (url) => {
    if (!IS_MOCK_MODE) return null;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  }
};

// Export individual functions for compatibility with existing code
export const signInWithGooglePopup = mockFirebaseAuth.signInWithGooglePopup;
export const signInWithGitHubPopup = mockFirebaseAuth.signInWithGitHubPopup;
export const signInWithTwitterPopup = mockFirebaseAuth.signInWithTwitterPopup;
export const signOutUser = mockFirebaseAuth.signOutUser;
export const onAuthStateChangedListener = mockFirebaseAuth.onAuthStateChangedListener;

export default mockFirebaseAuth;
