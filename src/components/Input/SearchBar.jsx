import React, { useState, useRef, useEffect } from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import { MdFilterList, MdOutlineLocationOn, MdCalendarToday } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [location, setLocation] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [isFocused, setIsFocused] = useState(false);
    const advancedRef = useRef(null);
    const inputRef = useRef(null);

    // Close advanced search when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (advancedRef.current && !advancedRef.current.contains(event.target)) {
                setShowAdvanced(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Focus the input when component mounts or when advanced is closed
    useEffect(() => {
        if (!showAdvanced && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showAdvanced]);

    return (
        <div className='relative w-full'>
            <motion.div 
                className={`flex items-center px-4 bg-slate-100 dark:bg-gray-700 rounded-md transition-all duration-200 ${isFocused ? 'ring-2 ring-cyan-500 ring-opacity-50' : ''}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
                <motion.div
                    animate={{ scale: isFocused ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <FaMagnifyingGlass className='text-gray-400 dark:text-gray-500 mr-2' />
                </motion.div>
                
                <input 
                    ref={inputRef}
                    type="text" 
                    placeholder='Search your Stories' 
                    className='w-full text-sm bg-transparent py-3 outline-none dark:text-white placeholder-gray-400 dark:placeholder-gray-500' 
                    value={value} 
                    onChange={onChange} 
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    aria-label="Search stories"
                />

                <div className="flex items-center gap-1">
                    {value && 
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400"
                            onClick={onClearSearch}
                            aria-label="Clear search"
                        >
                            <IoMdClose className='text-xl transition-colors' />
                        </motion.button>
                    }

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1 transition-colors ${showAdvanced ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400'}`}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        aria-label="Advanced search"
                        aria-expanded={showAdvanced}
                    >
                        <MdFilterList className='text-xl' />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-cyan-500 hover:bg-cyan-600 rounded-md transition-colors"
                        onClick={handleSearch}
                        aria-label="Search"
                    >
                        <FaMagnifyingGlass className='text-white' />
                    </motion.button>
                </div>
            </motion.div>

            {/* Advanced Search Panel */}
            <AnimatePresence>
                {showAdvanced && (
                    <motion.div 
                        ref={advancedRef}
                        className='absolute top-14 left-0 right-0 sm:right-auto sm:w-80 bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700'
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3 className='text-sm font-medium mb-3 dark:text-white'>Advanced Search</h3>
                        
                        <div className='mb-3'>
                            <label className='block text-xs text-gray-600 dark:text-gray-300 mb-1'>Location</label>
                            <div className='flex items-center border dark:border-gray-600 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-opacity-50'>
                                <span className='bg-cyan-50 dark:bg-cyan-900 p-2'>
                                    <MdOutlineLocationOn className='text-cyan-500' />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Filter by location"
                                    className='w-full text-xs p-2 outline-none dark:bg-gray-700 dark:text-white'
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className='mb-4'>
                            <label className='block text-xs text-gray-600 dark:text-gray-300 mb-1'>Date Range</label>
                            <div className='grid grid-cols-2 gap-2'>
                                <div className='flex items-center border dark:border-gray-600 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-opacity-50'>
                                    <span className='bg-cyan-50 dark:bg-cyan-900 p-2'>
                                        <MdCalendarToday className='text-cyan-500' />
                                    </span>
                                    <input
                                        type="date"
                                        className='w-full text-xs p-2 outline-none dark:bg-gray-700 dark:text-white'
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                        aria-label="Start date"
                                    />
                                </div>
                                <div className='flex items-center border dark:border-gray-600 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-opacity-50'>
                                    <span className='bg-cyan-50 dark:bg-cyan-900 p-2'>
                                        <MdCalendarToday className='text-cyan-500' />
                                    </span>
                                    <input
                                        type="date"
                                        className='w-full text-xs p-2 outline-none dark:bg-gray-700 dark:text-white'
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                        aria-label="End date"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className='flex justify-between'>
                            <motion.button 
                                className='text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md transition-colors'
                                whileHover={{ backgroundColor: '#e5e7eb' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setLocation('');
                                    setDateRange({ start: '', end: '' });
                                }}
                            >
                                Reset
                            </motion.button>
                            <motion.button 
                                className='text-xs bg-cyan-500 text-white px-3 py-2 rounded-md transition-colors'
                                whileHover={{ backgroundColor: '#0891b2' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    // Add location and date to search logic here
                                    handleSearch();
                                    setShowAdvanced(false);
                                }}
                            >
                                Apply Filters
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SearchBar