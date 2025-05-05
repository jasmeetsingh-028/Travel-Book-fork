import React, { useState, useRef, useEffect } from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import { MdFilterList, MdOutlineLocationOn, MdCalendarToday, MdWifiOff, MdSearch, MdTitle, MdSort, MdFavorite } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

const SearchBar = ({ value, onChange, handleSearch, onClearSearch, onAdvancedSearch }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [location, setLocation] = useState('');
    const [title, setTitle] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [isFavourite, setIsFavourite] = useState(null);
    const [sortBy, setSortBy] = useState('newest');
    const [isFocused, setIsFocused] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const advancedRef = useRef(null);
    const inputRef = useRef(null);
    const searchBarRef = useRef(null);

    // Check online status and screen size
    useEffect(() => {
        function handleOnlineStatus() {
            setIsOnline(navigator.onLine);
        }
        
        function handleResize() {
            setIsMobile(window.innerWidth < 768);
        }
        
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Close advanced search when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (advancedRef.current && !advancedRef.current.contains(event.target)) {
                setShowAdvanced(false);
            }
            
            // For mobile mode, check if click is outside search bar to collapse it
            if (isMobile && isExpanded && searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setIsExpanded(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobile, isExpanded]);

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
            if (isMobile) {
                setIsExpanded(false);
            }
        }
    };

    // Handle advanced search filters
    const handleAdvancedSearch = () => {
        onAdvancedSearch({
            location: location,
            title: title,
            dateRange: {
                start: dateRange.start ? new Date(dateRange.start) : null,
                end: dateRange.end ? new Date(dateRange.end) : null
            },
            isFavourite: isFavourite,
            sortBy: sortBy
        });
        
        setShowAdvanced(false);
        if (isMobile) setIsExpanded(false);
    };

    return (
        <div ref={searchBarRef} className='relative flex items-center'>
            {/* Mobile search toggle */}
            {isMobile && !isExpanded && (
                <motion.button 
                    className='flex items-center justify-center p-2 bg-slate-100 dark:bg-gray-700 rounded-full'
                    onClick={() => setIsExpanded(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Expand search"
                >
                    <FaMagnifyingGlass className="text-cyan-500" />
                </motion.button>
            )}
            
            {/* Search Bar - Expanded on desktop, collapsible on mobile */}
            <AnimatePresence>
                {(!isMobile || isExpanded) && (
                    <motion.div 
                        className={`flex items-center px-4 bg-slate-100 dark:bg-gray-700 rounded-md transition-all duration-200 
                            ${isFocused ? 'ring-2 ring-cyan-500 ring-opacity-50' : ''}
                            ${isMobile ? 'absolute top-0 left-0 right-0 z-20' : 'relative'}`}
                        initial={isMobile ? { opacity: 0, width: '40px', height: '40px', borderRadius: '50%' } : { opacity: 0, y: -10 }}
                        animate={isMobile ? { opacity: 1, width: '100%', height: 'auto', borderRadius: '6px' } : { opacity: 1, y: 0 }}
                        exit={isMobile ? { opacity: 0, width: '40px', height: '40px', borderRadius: '50%' } : { opacity: 0, y: -10 }}
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
                        />
                        
                        <div className='flex items-center ml-2'>
                            {value && 
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400"
                                    onClick={() => {
                                        onClearSearch();
                                        if (isMobile) setIsExpanded(false);
                                    }}
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
                                disabled={!isOnline}
                            >
                                <MdFilterList className={`text-xl ${!isOnline ? 'opacity-50' : ''}`} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-2 ${isOnline ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-gray-400'} rounded-md transition-colors`}
                                onClick={() => {
                                    handleSearch();
                                    if (isMobile) setIsExpanded(false);
                                }}
                                aria-label="Search"
                            >
                                <FaMagnifyingGlass className='text-white' />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Advanced Search Panel */}
            <AnimatePresence>
                {showAdvanced && (
                    <motion.div 
                        ref={advancedRef}
                        className='absolute top-14 left-0 right-0 sm:right-auto sm:w-80 bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg z-30 border border-gray-200 dark:border-gray-700'
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

                        <div className='mb-3'>
                            <label className='block text-xs text-gray-600 dark:text-gray-300 mb-1'>Title</label>
                            <div className='flex items-center border dark:border-gray-600 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-opacity-50'>
                                <span className='bg-cyan-50 dark:bg-cyan-900 p-2'>
                                    <MdTitle className='text-cyan-500' />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Filter by title"
                                    className='w-full text-xs p-2 outline-none dark:bg-gray-700 dark:text-white'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
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

                        <div className='mb-3'>
                            <label className='block text-xs text-gray-600 dark:text-gray-300 mb-1'>Favorites</label>
                            <div className='flex items-center'>
                                <motion.button
                                    className={`p-2 rounded-md ${isFavourite === true ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsFavourite(isFavourite === true ? null : true)}
                                >
                                    <MdFavorite className='text-xl' />
                                </motion.button>
                            </div>
                        </div>

                        <div className='mb-3'>
                            <label className='block text-xs text-gray-600 dark:text-gray-300 mb-1'>Sort By</label>
                            <div className='flex items-center border dark:border-gray-600 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-opacity-50'>
                                <span className='bg-cyan-50 dark:bg-cyan-900 p-2'>
                                    <MdSort className='text-cyan-500' />
                                </span>
                                <select
                                    className='w-full text-xs p-2 outline-none dark:bg-gray-700 dark:text-white'
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                    <option value="popular">Most Popular</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className='flex justify-between'>
                            <motion.button 
                                className='text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md transition-colors'
                                whileHover={{ backgroundColor: '#e5e7eb' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setLocation('');
                                    setTitle('');
                                    setDateRange({ start: '', end: '' });
                                    setIsFavourite(null);
                                    setSortBy('newest');
                                }}
                            >
                                Reset
                            </motion.button>
                            <motion.button 
                                className='text-xs bg-cyan-500 text-white px-3 py-2 rounded-md transition-colors'
                                whileHover={{ backgroundColor: '#0891b2' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAdvancedSearch}
                                disabled={(!location && !title && !dateRange.start && !dateRange.end && isFavourite === null && !sortBy) || !isOnline}
                            >
                                Apply Filters
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {!isOnline && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/70 text-amber-800 dark:text-amber-200 text-xs rounded-md flex items-center shadow-sm border border-amber-200 dark:border-amber-800'
                >
                    <MdWifiOff className='mr-1' /> Limited search while offline
                </motion.div>
            )}
        </div>
    )
}

export default SearchBar