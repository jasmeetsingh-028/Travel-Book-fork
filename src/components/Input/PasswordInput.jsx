import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder, onFocus, className = "" }) => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    }
    
    return (
        <div className="relative w-full">
            <input
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                placeholder={placeholder || "Password"}
                type={isShowPassword ? "text" : "password"}
                className={`w-full pr-10 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-cyan-500 focus:border-transparent focus:ring-2 transition-all duration-200 outline-none text-gray-800 dark:text-white ${className}`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isShowPassword ? (
                    <FaRegEye
                        size={18}
                        className="text-cyan-500 dark:text-cyan-400 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                        onClick={() => toggleShowPassword()}
                        aria-label="Hide password"
                    />
                ) : (
                    <FaRegEyeSlash
                        size={18}
                        className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                        onClick={() => toggleShowPassword()}
                        aria-label="Show password"
                    />
                )}
            </div>
        </div>
    );
};

export default PasswordInput;
