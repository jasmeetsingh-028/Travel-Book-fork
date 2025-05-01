import React, { useState, useRef, useEffect } from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import { MdFilterList, MdOutlineLocationOn } from 'react-icons/md'

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [location, setLocation] = useState('');
    const advancedRef = useRef(null);

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

    return (
        <div className='relative'>
            <div className='w-80 flex items-center px-4 bg-slate-100 rounded-md'>
                <input 
                    type="text" 
                    placeholder='Search your Stories' 
                    className='w-full text-xs bg-transparent py-[11px] outline-none' 
                    value={value} 
                    onChange={onChange} 
                    onKeyDown={handleKeyDown}
                />

                {value && 
                    <IoMdClose 
                        className='text-xl text-cyan-500 cursor-pointer hover:text-black mr-3' 
                        onClick={onClearSearch}
                    />
                }

                <MdFilterList 
                    className='text-xl text-cyan-500 cursor-pointer hover:text-black mr-3'
                    onClick={() => setShowAdvanced(!showAdvanced)} 
                />

                <FaMagnifyingGlass 
                    className='text-cyan-500 cursor-pointer hover:text-black' 
                    onClick={handleSearch} 
                />
            </div>

            {/* Advanced Search Panel */}
            {showAdvanced && (
                <div 
                    ref={advancedRef}
                    className='absolute top-14 left-0 w-80 bg-white p-4 rounded-md shadow-lg z-10 border border-gray-200'
                >
                    <h3 className='text-sm font-medium mb-3'>Advanced Search</h3>
                    
                    <div className='mb-3'>
                        <label className='block text-xs text-gray-600 mb-1'>Location</label>
                        <div className='flex items-center border rounded-md overflow-hidden'>
                            <span className='bg-cyan-50 p-2'>
                                <MdOutlineLocationOn className='text-cyan-500' />
                            </span>
                            <input
                                type="text"
                                placeholder="Filter by location"
                                className='w-full text-xs p-2 outline-none'
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className='flex justify-end'>
                        <button 
                            className='text-xs bg-cyan-500 text-white px-3 py-1 rounded-md hover:bg-cyan-600'
                            onClick={() => {
                                // Add location to search logic here
                                handleSearch();
                                setShowAdvanced(false);
                            }}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchBar