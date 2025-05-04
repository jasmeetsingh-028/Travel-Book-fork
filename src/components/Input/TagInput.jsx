import React, { useState, useEffect, useRef } from "react";
import { MdAdd, MdClose, MdLocationOn, MdMyLocation } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const TagInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Mock location suggestions - in a real app, you'd use Google Places API
    const mockLocations = [
        "Paris, France", 
        "New York, USA", 
        "Tokyo, Japan", 
        "London, UK", 
        "Rome, Italy",
        "Barcelona, Spain",
        "Sydney, Australia",
        "Dubai, UAE",
        "Bangkok, Thailand",
        "Amsterdam, Netherlands"
    ];

    useEffect(() => {
        // Simulate API call for location suggestions
        if (inputValue.trim().length > 1) {
            setIsLoading(true);
            // This timeout simulates an API call delay
            const timer = setTimeout(() => {
                const filtered = mockLocations.filter(location => 
                    location.toLowerCase().includes(inputValue.toLowerCase())
                );
                setSuggestions(filtered.slice(0, 5));
                setIsLoading(false);
            }, 300);
            
            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
        }
    }, [inputValue]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) && 
                inputRef.current && !inputRef.current.contains(e.target)) {
                setIsFocused(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const addNewTag = (location = inputValue) => {
        if (location.trim() !== "" && !tags.includes(location.trim())) {
            setTags([...tags, location.trim()]);
            setInputValue("");
            setSuggestions([]);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addNewTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleSelectSuggestion = (suggestion) => {
        addNewTag(suggestion);
        setIsFocused(false);
    };

    const handleCurrentLocation = () => {
        // In a real app, you'd use the Geolocation API to get the user's location
        // and then reverse geocode it to get the location name
        setIsLoading(true);
        setTimeout(() => {
            addNewTag("Current Location");
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="relative">                 
            {tags.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 flex-wrap mt-2 mb-4"
                >
                    {tags.map((tag, index) => (
                        <motion.span 
                            key={index} 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2 text-sm text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/40 px-3 py-1.5 rounded-full border border-cyan-200 dark:border-cyan-800"
                        >
                            <MdLocationOn className="text-sm text-cyan-600 dark:text-cyan-400"/> 
                            {tag}
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="ml-1 bg-cyan-200 dark:bg-cyan-800 rounded-full p-0.5"
                                onClick={() => handleRemoveTag(tag)}
                            >
                                <MdClose className="text-xs text-cyan-700 dark:text-cyan-300"/>
                            </motion.button>
                        </motion.span>
                    ))}
                </motion.div>
            )}
            
            <div className="flex items-start gap-2">
                <div className="relative flex-1">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            className="w-full text-sm bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 px-4 py-3 pl-10 rounded-lg outline-none focus:border-cyan-400 dark:focus:border-cyan-600 transition-all shadow-sm"
                            placeholder="Type a location..."
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                        />
                        <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg text-slate-400 dark:text-slate-500" />
                    </div>
                    
                    <AnimatePresence>
                        {isFocused && (suggestions.length > 0 || isLoading) && (
                            <motion.div 
                                ref={suggestionsRef}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 max-h-60 overflow-auto"
                            >
                                {isLoading ? (
                                    <div className="p-4 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Finding locations...
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    <ul>
                                        {suggestions.map((suggestion, index) => (
                                            <motion.li 
                                                key={index}
                                                whileHover={{ backgroundColor: "rgba(14, 165, 233, 0.1)" }}
                                                className="p-3 text-sm cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/30 border-b border-slate-100 dark:border-gray-700 flex items-center"
                                                onClick={() => handleSelectSuggestion(suggestion)}
                                            >
                                                <MdLocationOn className="mr-2 text-cyan-500" />
                                                {suggestion}
                                            </motion.li>
                                        ))}
                                    </ul>
                                ) : null}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                <div className="flex gap-2">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-[46px] px-3 flex items-center justify-center rounded-lg border border-cyan-500 hover:bg-cyan-500 dark:hover:bg-cyan-600 transition-colors group" 
                        onClick={() => addNewTag()}
                        disabled={inputValue.trim() === ""}
                    >
                        <MdAdd className="text-xl text-cyan-500 group-hover:text-white dark:text-cyan-400" />
                    </motion.button>
                    
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-[46px] px-3 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors" 
                        onClick={handleCurrentLocation}
                        title="Use current location"
                    >
                        <MdMyLocation className="text-lg text-slate-600 dark:text-slate-300" />
                    </motion.button>
                </div>
            </div>
            
            {tags.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    Add locations you visited during your trip
                </p>
            )}
        </div>
    );
};

export default TagInput;