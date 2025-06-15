// Import the necessary Firebase packages
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider (optional settings)
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Google sign-in function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // The user info from Google
    return {
      user: result.user,
      // The Google OAuth access token (can be used to access Google APIs)
      credential: GoogleAuthProvider.credentialFromResult(result)
    };
  } catch (error) {
    // Handle Errors here.
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Sign out function
export const signOutUser = async () => {
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
  return onAuthStateChanged(auth, callback);
};

export { auth, googleProvider };
