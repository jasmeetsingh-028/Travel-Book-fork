import React from 'react';
import { motion } from 'framer-motion';
import SocialButtonCircle from './SocialButtonCircle';
import GithubButtonCircle from './GithubButtonCircle';

const SocialLoginButtons = ({ isSignUp = false, redirectPath = '/dashboard' }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full relative flex items-center justify-center mb-6">
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">
          {isSignUp ? 'or sign up with' : 'or sign in with'}
        </span>
        <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
      </div>
      
      <motion.div 
        className="flex items-center justify-center gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.3,
          staggerChildren: 0.1,
          delayChildren: 0.1
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SocialButtonCircle 
            provider="google" 
            isSignUp={isSignUp} 
            redirectPath={redirectPath}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <GithubButtonCircle 
            isSignUp={isSignUp} 
            redirectPath={redirectPath}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SocialLoginButtons;
