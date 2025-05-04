import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaCheckCircle, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "sonner";
import { Helmet } from "react-helmet";
import logo from "../../assets/images/logo.png";
import PasswordInput from "../../components/Input/PasswordInput";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [validating, setValidating] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get("token");
    
    if (!urlToken) {
      setTokenValid(false);
      setValidating(false);
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }
    
    setToken(urlToken);
    
    // Verify token validity
    const verifyToken = async () => {
      try {
        const response = await axiosInstance.get(`/verify-reset-token?token=${urlToken}`);
        if (response.data && !response.data.error) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setError("This password reset link has expired or is invalid.");
        }
      } catch (error) {
        setTokenValid(false);
        setError("This password reset link has expired or is invalid.");
      } finally {
        setValidating(false);
      }
    };
    
    verifyToken();
  }, [location]);
  
  const validatePassword = (password) => {
    // Minimum 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password strength
    if (!validatePassword(newPassword)) {
      setError("Password must be at least 8 characters long and include at least one letter and one number");
      return;
    }
    
    // Validate password match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const response = await axiosInstance.post("/reset-password", {
        token,
        newPassword
      });
      
      if (response.data && !response.data.error) {
        setSuccess(true);
        toast.success("Your password has been successfully changed!");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to change password. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const renderContent = () => {
    if (validating) {
      return (
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <svg className="animate-spin h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Validating your reset link...</p>
        </div>
      );
    }
    
    if (!tokenValid) {
      return (
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center text-red-500">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Link Invalid</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full py-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium transition-all duration-300"
            onClick={() => navigate("/forgot-password")}
          >
            <span>Request New Link</span>
            <FaArrowRight />
          </motion.button>
        </div>
      );
    }
    
    if (success) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-8"
        >
          <div className="flex justify-center">
            <FaCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Password Changed
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full py-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium transition-all duration-300"
            onClick={() => navigate("/login")}
          >
            <span>Login Now</span>
            <FaArrowRight />
          </motion.button>
        </motion.div>
      );
    }
    
    return (
      <>
        <h4 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          Create New Password
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
          Please enter a new password for your account.
        </p>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-6"
            >
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password Input */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">New Password</label>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Password must be at least 8 characters with letters and numbers
            </p>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">Confirm Password</label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Change Password</span>
                <FaArrowRight />
              </>
            )}
          </motion.button>
        </form>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative flex items-center justify-center py-10 px-4"
    >
      <Helmet>
        <title>Reset Password | Travel Book</title>
      </Helmet>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md rounded-xl p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/20"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-6"
        >
          <Link to="/">
            <img
              src={logo}
              alt="Travel Book Logo"
              className="h-20 mx-auto hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </motion.div>

        {renderContent()}
      </motion.div>
    </motion.div>
  );
};

export default ChangePassword;