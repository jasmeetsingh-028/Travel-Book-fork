import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus on first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    // Take only the last character if multiple are pasted/entered
    const digit = value.substring(value.length - 1);
    
    // Create a copy of the current OTP array
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    
    // If a digit was entered (not deleted) and not the last input, focus next
    if (digit && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
    
    // Check if OTP is complete
    if (newOtp.every(v => v) && newOtp.length === length) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      // If current input is empty and not the first input, focus the previous input
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted content contains only digits
    if (!/^\d+$/.test(pastedData)) return;
    
    const digits = pastedData.split('').slice(0, length);
    
    // Fill the OTP array with pasted digits
    const newOtp = [...otp];
    digits.forEach((digit, idx) => {
      if (idx < length) {
        newOtp[idx] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Focus the input after the last pasted digit
    const focusIndex = Math.min(digits.length, length - 1);
    inputRefs.current[focusIndex].focus();
    
    // Check if OTP is complete
    if (newOtp.every(v => v) && newOtp.length === length) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <div className="flex justify-center space-x-3 sm:space-x-4 w-full">
      {otp.map((digit, index) => (
        <motion.input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          ref={(ref) => (inputRefs.current[index] = ref)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-14 rounded-lg border-2 text-center text-xl font-bold border-gray-300 dark:border-gray-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [0, -5, 0],
            transition: { 
              delay: index * 0.1,
              y: { delay: index * 0.1 + 0.3, duration: 0.3 }
            }
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;