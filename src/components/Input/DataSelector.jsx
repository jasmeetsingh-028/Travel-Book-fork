import React, { useState, useRef, useEffect } from 'react';
import { format, isToday, isThisMonth, isThisYear } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-day-picker/dist/style.css';
import { MdOutlineDateRange, MdClose, MdToday } from 'react-icons/md';

const DataSelector = ({ date, setDate }) => {
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const dayPickerRef = useRef(null);
    const buttonRef = useRef(null);

    // Format display date in a more natural way
    const formatDisplayDate = (date) => {
        if (!date) return 'Select a date';
        
        if (isToday(date)) {
            return 'Today';
        } else if (isThisMonth(date) && isThisYear(date)) {
            return format(date, 'EEEE, do'); // e.g. "Monday, 3rd"
        } else if (isThisYear(date)) {
            return format(date, 'MMMM d'); // e.g. "June 3"
        } else {
            return format(date, 'MMM d, yyyy'); // e.g. "Jun 3, 2023"
        }
    };

    // Handle outside click to close the date picker
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dayPickerRef.current && 
                !dayPickerRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setOpenDatePicker(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Select today's date
    const selectToday = () => {
        setDate(new Date());
        setOpenDatePicker(false);
    };

    const toggleDatePicker = () => {
        setOpenDatePicker(!openDatePicker);
    };

    // Custom styles for selected day
    const selectedDayStyle = { 
        backgroundColor: '#06b6d4', 
        color: 'white',
        borderRadius: '999px'
    };

    // Custom styles for today
    const todayStyle = { 
        border: '2px solid #06b6d4',
        borderRadius: '999px'
    };

    return (
        <div className="relative">
            <motion.button
                ref={buttonRef}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-[15px] bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 shadow-sm hover:border-cyan-400 dark:hover:border-cyan-600 transition-all w-full"
                onClick={toggleDatePicker}
            >
                <MdOutlineDateRange className="text-lg text-cyan-600 dark:text-cyan-400" />
                <span className="text-slate-800 dark:text-white font-medium">
                    {date ? formatDisplayDate(new Date(date)) : 'When did you visit?'}
                </span>
            </motion.button>

            <AnimatePresence>
                {openDatePicker && (
                    <motion.div
                        ref={dayPickerRef}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-20 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-slate-200 dark:border-gray-700"
                    >
                        <div className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-gray-700">
                            <h3 className="font-medium text-slate-700 dark:text-white">
                                Select Date
                            </h3>
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-800"
                                    onClick={selectToday}
                                    title="Set to today"
                                >
                                    <MdToday className="text-lg" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1.5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                                    onClick={() => setOpenDatePicker(false)}
                                >
                                    <MdClose className="text-lg" />
                                </motion.button>
                            </div>
                        </div>
                        
                        <div className="p-2 date-picker-custom">
                            <DayPicker
                                mode="single"
                                selected={date ? new Date(date) : undefined}
                                onSelect={(day) => {
                                    setDate(day);
                                    setOpenDatePicker(false);
                                }}
                                modifiersStyles={{
                                    selected: selectedDayStyle,
                                    today: todayStyle
                                }}
                                showOutsideDays
                                fixedWeeks
                                captionLayout="dropdown-buttons"
                                fromYear={2000}
                                toYear={2030}
                            />
                        </div>
                        
                        <div className="border-t border-slate-200 dark:border-gray-700 p-3 flex justify-end">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-300 text-sm font-medium"
                                onClick={() => setOpenDatePicker(false)}
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DataSelector;