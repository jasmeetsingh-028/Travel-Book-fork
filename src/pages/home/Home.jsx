import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import { MdAdd, MdQueryStats, MdFilterAlt, MdClose, MdCalendarMonth, MdWavingHand, MdOutlineExplore, MdFavorite, MdSort, MdOfflinePin, MdRefresh, MdCloudOff, MdEdit, MdDeleteOutline, MdWarning, MdInfo } from 'react-icons/md';
import Modal from 'react-modal';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../../components/Cards/EmptyCard';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle';
import { getEmptyCardMessage, getEmptyImg } from '../../utils/helper';
import { toast } from 'sonner';
import Toaster from '../../components/Toaster';
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import TravelAnalytics from '../../components/Cards/TravelAnalytics';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dataRange, setDataRange] = useState({ from: null, to: null });
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // New state variables for confirmation dialogs
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    story: null
  });
  const [editConfirmation, setEditConfirmation] = useState({
    isOpen: false,
    story: null
  });
  
  const calendarRef = useRef(null);
  const sortRef = useRef(null);
  const filterMenuRef = useRef(null);

  // Handle online/offline status
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      toast.success('You are back online');
      syncOfflineData();
    }

    function handleOffline() {
      setIsOnline(false);
      toast.error('You are currently offline. Limited functionality available.');
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if we have cached data
    const checkOfflineData = async () => {
      try {
        if ('indexedDB' in window) {
          const openRequest = indexedDB.open('TravelBookOfflineDB', 1);
          
          openRequest.onupgradeneeded = function(e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('stories')) {
              db.createObjectStore('stories', { keyPath: '_id' });
            }
          };
          
          openRequest.onsuccess = function(e) {
            const db = e.target.result;
            // Only try to check the store if it exists
            if (db.objectStoreNames.contains('stories')) {
              const transaction = db.transaction('stories', 'readonly');
              const store = transaction.objectStore('stories');
              const countRequest = store.count();
              
              countRequest.onsuccess = function() {
                setHasOfflineData(countRequest.result > 0);
              };
            } else {
              setHasOfflineData(false);
            }
          };
        }
      } catch (err) {
        console.error('Error checking offline data', err);
        setHasOfflineData(false);
      }
    };

    checkOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Function to get user info
  const getUserInfo = async () => {
    try {
      const user = await axiosInstance.get('/get-user');
      setUserInfo(user.data.user);
    } catch (error) {
      localStorage.clear();
      navigate('/login');
    }
  };

  // Function to save stories to IndexedDB for offline access
  const saveStoriesToIndexedDB = (stories) => {
    if (!('indexedDB' in window)) {
      console.log('IndexedDB not supported');
      return;
    }

    const openRequest = indexedDB.open('TravelBookOfflineDB', 1);

    openRequest.onupgradeneeded = function(e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('stories')) {
        db.createObjectStore('stories', { keyPath: '_id' });
      }
    };

    openRequest.onsuccess = function(e) {
      const db = e.target.result;
      try {
        // Check if the object store exists before proceeding
        if (!db.objectStoreNames.contains('stories')) {
          // Close the current database connection
          db.close();
          
          // Increment the database version to trigger onupgradeneeded
          const reopenRequest = indexedDB.open('TravelBookOfflineDB', 2);
          
          reopenRequest.onupgradeneeded = function(event) {
            const newDb = event.target.result;
            if (!newDb.objectStoreNames.contains('stories')) {
              newDb.createObjectStore('stories', { keyPath: '_id' });
            }
          };
          
          reopenRequest.onsuccess = function(event) {
            const newDb = event.target.result;
            // Now we know the store exists, proceed with saving
            const transaction = newDb.transaction('stories', 'readwrite');
            const store = transaction.objectStore('stories');
            
            // Clear existing data then add all stories
            store.clear();
            
            stories.forEach(story => {
              store.add(story);
            });

            // Update state after transaction is complete
            transaction.oncomplete = function() {
              setHasOfflineData(stories.length > 0);
            };
          };
          
          return;
        }
        
        // If store exists, proceed normally
        const transaction = db.transaction('stories', 'readwrite');
        const store = transaction.objectStore('stories');
        
        // Clear existing data then add all stories
        store.clear();
        
        stories.forEach(story => {
          store.add(story);
        });

        // Update state after transaction is complete
        transaction.oncomplete = function() {
          setHasOfflineData(stories.length > 0);
        };
      } catch (err) {
        console.error('IndexedDB transaction error:', err);
      }
    };

    openRequest.onerror = function(e) {
      console.error('IndexedDB error:', e.target.error);
    };
  };

  // Function to get stories from IndexedDB when offline
  const getStoriesFromIndexedDB = () => {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject('IndexedDB not supported');
        return;
      }

      const openRequest = indexedDB.open('TravelBookOfflineDB', 1);
      
      // Add the onupgradeneeded handler to ensure store exists
      openRequest.onupgradeneeded = function(e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('stories')) {
          db.createObjectStore('stories', { keyPath: '_id' });
        }
      };

      openRequest.onsuccess = function(e) {
        const db = e.target.result;
        try {
          // Check if the store exists before trying to access it
          if (!db.objectStoreNames.contains('stories')) {
            return resolve([]); // Return empty array if store doesn't exist
          }
          
          const transaction = db.transaction('stories', 'readonly');
          const store = transaction.objectStore('stories');
          const request = store.getAll();

          request.onsuccess = function() {
            resolve(request.result);
          };

          request.onerror = function(e) {
            reject(e.target.error);
          };
        } catch (err) {
          console.error('Error accessing IndexedDB:', err);
          resolve([]); // Resolve with empty array on error
        }
      };

      openRequest.onerror = function(e) {
        reject(e.target.error);
      };
    });
  };

  // Function to sync offline changes when back online
  const syncOfflineData = async () => {
    // In a real implementation, you would sync any offline changes 
    // that were made while the user was offline
    await getAllTravelStories();
  };

  // Function to get all travel stories
  const getAllTravelStories = async () => {
    setIsLoading(true);
    try {
      if (isOnline) {
        const { data } = await axiosInstance.get('/get-all-stories');
        setAllStories(data.stories);
        setFilterType('');
        
        // Cache stories for offline use
        saveStoriesToIndexedDB(data.stories);
      } else {
        // Use cached data when offline
        try {
          const offlineStories = await getStoriesFromIndexedDB();
          setAllStories(offlineStories);
          setFilterType('offline');
        } catch (err) {
          console.error('Error retrieving offline stories:', err);
          setAllStories([]);
        }
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // On search
  const onSearchNote = async (query) => {
    setIsLoading(true);
    if (!query) {
      await getAllTravelStories();
      return;
    }

    try {
      if (isOnline) {
        const { data } = await axiosInstance.get(`/search?query=${query}`);
        setAllStories(data.stories);
        setFilterType('search');
      } else {
        // Search in cached data
        try {
          const offlineStories = await getStoriesFromIndexedDB();
          const searchResults = offlineStories.filter(story => 
            story.title.toLowerCase().includes(query.toLowerCase()) ||
            story.story.toLowerCase().includes(query.toLowerCase()) ||
            story.visitedLocation.some(loc => loc.toLowerCase().includes(query.toLowerCase()))
          );
          setAllStories(searchResults);
          setFilterType(searchResults.length > 0 ? 'search' : 'no-results');
        } catch (err) {
          console.error('Error searching offline stories:', err);
        }
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle advanced search
  const handleAdvancedSearch = async (filters) => {
    setIsLoading(true);
    
    try {
      if (isOnline) {
        // Online implementation
        // If no location is provided, show all stories instead of searching
        if (!filters.location || filters.location.trim() === '') {
          await getAllTravelStories();
          return;
        }
        
        let queryParams = [];
        queryParams.push(`query=${encodeURIComponent(filters.location)}`);
        
        const queryString = `?${queryParams.join('&')}`;
        const { data } = await axiosInstance.get(`/search${queryString}`);
        
        if (data.stories && data.stories.length > 0) {
          setAllStories(data.stories);
          setFilterType('advanced');
        } else {
          setAllStories([]);
          setFilterType('no-results');
          toast.info('No stories found matching your filters');
        }
      } else {
        // Offline implementation
        try {
          const offlineStories = await getStoriesFromIndexedDB();
          let filteredStories = [...offlineStories];
          
          // If no filters are provided, just return all stories
          if ((!filters.location || filters.location.trim() === '') && 
              (!filters.dateRange.start && !filters.dateRange.end)) {
            setAllStories(filteredStories);
            setFilterType('');
            return;
          }
          
          // Filter by location if provided
          if (filters.location && filters.location.trim() !== '') {
            const locationLower = filters.location.toLowerCase();
            filteredStories = filteredStories.filter(story => 
              story.visitedLocation.some(loc => loc.toLowerCase().includes(locationLower))
            );
          }
          
          // Filter by date range if provided
          if (filters.dateRange.start || filters.dateRange.end) {
            if (filters.dateRange.start) {
              filteredStories = filteredStories.filter(story => {
                const storyDate = new Date(story.visitedDate);
                return storyDate >= filters.dateRange.start;
              });
            }
            
            if (filters.dateRange.end) {
              filteredStories = filteredStories.filter(story => {
                const storyDate = new Date(story.visitedDate);
                return storyDate <= filters.dateRange.end;
              });
            }
          }
          
          if (filteredStories.length > 0) {
            setAllStories(filteredStories);
            setFilterType('advanced');
          } else {
            setAllStories([]);
            setFilterType('no-results');
            toast.info('No stories found matching your filters');
          }
        } catch (err) {
          console.error('Error filtering offline stories with advanced search:', err);
          toast.error('Failed to apply filters');
        }
      }
    } catch (error) {
      console.error('Error with advanced search:', error);
      toast.error('Failed to apply filters');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter travel stories by date range
  const filterStoriesByDateRange = async () => {
    if (!dataRange.from || !dataRange.to) {
      toast.error('Please select a date range');
      return;
    }

    setIsLoading(true);
    
    try {
      if (isOnline) {
        // Make sure we're sending dates in a consistent format for the API
        // When converting to ISO string, set the time to start of day for from date and end of day for to date
        const fromDate = new Date(dataRange.from);
        fromDate.setHours(0, 0, 0, 0);
        
        const toDate = new Date(dataRange.to);
        toDate.setHours(23, 59, 59, 999);
        
        // Format the dates consistently (ISO string is safest for API calls)
        const formattedFromDate = fromDate.toISOString();
        const formattedToDate = toDate.toISOString();
        
        const { data } = await axiosInstance.get(`/travel-stories-filter?startDate=${formattedFromDate}&endDate=${formattedToDate}`);
        
        if (data.stories && data.stories.length > 0) {
          setAllStories(data.stories);
          setFilterType('date');
          setShowCalendar(false);
        } else {
          setAllStories([]);
          setFilterType('no-results');
          toast.info('No stories found in the selected date range');
        }
      } else {
        // Offline implementation
        try {
          const offlineStories = await getStoriesFromIndexedDB();
          const filteredStories = offlineStories.filter(story => {
            const storyDate = new Date(story.visitedDate);
            // Set story date to midnight for date-only comparison
            storyDate.setHours(0, 0, 0, 0);
            
            // Set time boundaries for comparison
            const fromDate = new Date(dataRange.from);
            fromDate.setHours(0, 0, 0, 0);
            
            const toDate = new Date(dataRange.to);
            toDate.setHours(23, 59, 59, 999);
            
            return storyDate >= fromDate && storyDate <= toDate;
          });
          
          if (filteredStories.length > 0) {
            setAllStories(filteredStories);
            setFilterType('date');
            setShowCalendar(false);
          } else {
            setAllStories([]);
            setFilterType('no-results');
            toast.info('No stories found in the selected date range');
          }
        } catch (err) {
          console.error('Error filtering offline stories by date:', err);
          toast.error('Failed to filter stories by date');
        }
      }
    } catch (error) {
      console.error('Error filtering by date range:', error);
      toast.error('Failed to filter stories by date');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle showing favorite stories
  const handleFavoriteFilter = async () => {
    if (activeFilter === 'favorites') {
      setActiveFilter('all');
      getAllTravelStories();
    } else {
      setActiveFilter('favorites');
      
      if (isOnline) {
        // Online implementation
        const favoriteStories = allStories.filter(story => story.isFavourite);
        setAllStories(favoriteStories);
        setFilterType('favorites');
      } else {
        // Offline implementation
        try {
          const offlineStories = await getStoriesFromIndexedDB();
          const favoriteStories = offlineStories.filter(story => story.isFavourite);
          setAllStories(favoriteStories);
          setFilterType('favorites');
        } catch (err) {
          console.error('Error filtering offline favorites:', err);
        }
      }
    }
  };

  // Handle mobile swipe for traveling between tabs
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeFilter === 'all') setActiveFilter('favorites');
      else if (activeFilter === 'favorites') setActiveFilter('recent');
    },
    onSwipedRight: () => {
      if (activeFilter === 'recent') setActiveFilter('favorites');
      else if (activeFilter === 'favorites') setActiveFilter('all');
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  // Function to handle add/edit travel story
  const handleAddOrEditStory = () => {
    if (!isOnline) {
      toast.error('You need to be online to add or edit stories');
      return;
    }
    
    setOpenAddEditModal({
      isShown: true,
      type: 'add',
      data: null,
    });
  };

  // Get displayed stories based on current filters and sorting
  const getDisplayedStories = () => {
    let stories = [...allStories];
    
    // Filter by favorites if active
    if (activeFilter === 'favorites') {
      stories = stories.filter(story => story.isFavourite);
    } else if (activeFilter === 'recent') {
      // Show only recent stories (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      stories = stories.filter(story => new Date(story.visitedDate) >= thirtyDaysAgo);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        return stories.sort((a, b) => new Date(b.visitedDate) - new Date(a.visitedDate));
      case 'oldest':
        return stories.sort((a, b) => new Date(a.visitedDate) - new Date(b.visitedDate));
      case 'az':
        return stories.sort((a, b) => a.title.localeCompare(b.title));
      case 'za':
        return stories.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return stories;
    }
  };

  // Handle day selection in the calendar
  const handleDayClick = (selectedDay) => {
    setDataRange(selectedDay);
  };

  // Handle view story
  const handleViewStory = (story) => {
    setOpenViewModal({
      isShown: true,
      data: story,
    });
  };

  // Handle edit story confirmation
  const handleEditClick = (story) => {
    if (!isOnline) {
      toast.error('You need to be online to edit stories');
      return;
    }
    
    // Show confirmation dialog
    setEditConfirmation({
      isOpen: true,
      story: story
    });
  };

  // Proceed with edit after confirmation
  const confirmEdit = () => {
    setOpenViewModal({
      isShown: false,
      data: null,
    });
    
    setOpenAddEditModal({
      isShown: true,
      type: 'edit',
      data: editConfirmation.story,
    });
    
    // Close the confirmation dialog
    setEditConfirmation({
      isOpen: false,
      story: null
    });
  };

  // Handle delete story confirmation
  const handleDeleteClick = (story) => {
    if (!isOnline) {
      toast.error('You need to be online to delete stories');
      return;
    }
    
    // Show confirmation dialog
    setDeleteConfirmation({
      isOpen: true,
      story: story
    });
  };

  // Proceed with delete after confirmation
  const confirmDelete = async () => {
    try {
      const { data } = await axiosInstance.delete(`/delete-story/${deleteConfirmation.story._id}`);
      
      setOpenViewModal({
        isShown: false,
        data: null,
      });
      
      // Close the confirmation dialog
      setDeleteConfirmation({
        isOpen: false,
        story: null
      });
      
      getAllTravelStories();
      toast.success("Travel Story deleted successfully!");
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete the story');
      
      // Close the confirmation dialog even on error
      setDeleteConfirmation({
        isOpen: false,
        story: null
      });
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []);

  // Handle clicks outside of menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }
      
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Your Travel Book</title>
        <meta name="description" content="Your personal collection of travel memories" />
      </Helmet>
      
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchNote}
        handleClearSearch={() => {
          getAllTravelStories();
        }}
        onAdvancedSearch={handleAdvancedSearch}
      />
      
      {/* Offline banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div 
            className="bg-amber-500 text-white p-2 text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <div className="flex items-center justify-center gap-2">
              <MdCloudOff />
              <span>You are offline. Some features may be limited.</span>
              {hasOfflineData && (
                <span className="ml-2 inline-flex items-center text-xs bg-amber-600 px-2 py-1 rounded-full">
                  <MdOfflinePin className="mr-1" /> Using cached data
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Welcome message for new users */}
      <AnimatePresence>
        {showWelcomeMessage && userInfo && (
          <motion.div 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mx-4 mt-4 shadow-sm"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start">
              <div className="mr-3 bg-cyan-100 dark:bg-cyan-900 p-2 rounded-full">
                <MdWavingHand className="text-cyan-500 text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Welcome, {userInfo.fullName}!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Ready to document your travel memories? Create a new story by clicking the "+" button.</p>
              </div>
              <button 
                onClick={() => setShowWelcomeMessage(false)}
                className="ml-auto text-gray-400 hover:text-gray-500"
                aria-label="Close welcome message"
              >
                <MdClose />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <AnimatePresence>
          {filterType !== '' && (
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FilterInfoTitle
                type={filterType}
                searchQuery={searchQuery}
                onHandleClear={() => {
                  getAllTravelStories();
                  setDataRange({ from: null, to: null });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Filters Button */}
        <div className="mb-4 lg:hidden">
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg flex items-center justify-between"
            aria-expanded={showMobileFilters}
            aria-controls="mobile-filters"
          >
            <span className="flex items-center">
              <MdFilterAlt className="mr-2" /> 
              Filters & Sort
            </span>
            <span>{showMobileFilters ? '−' : '+'}</span>
          </button>
          
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div 
                id="mobile-filters"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700"
                {...swipeHandlers}
              >
                {/* Filter Tabs */}
                <div className="flex flex-nowrap overflow-x-auto hide-scrollbar mb-4 pb-2">
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => {
                        setActiveFilter('all');
                        getAllTravelStories();
                      }}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 flex-shrink-0 ${
                        activeFilter === 'all' 
                          ? 'bg-cyan-500 text-white' 
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      All Stories
                    </button>
                    <button 
                      onClick={handleFavoriteFilter}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 flex-shrink-0 ${
                        activeFilter === 'favorites' 
                          ? 'bg-cyan-500 text-white' 
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <MdFavorite className={activeFilter === 'favorites' ? "text-sm text-white" : "text-sm text-red-500"} />
                      Favorites
                    </button>
                    <button 
                      onClick={() => setActiveFilter('recent')}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 flex-shrink-0 ${
                        activeFilter === 'recent' 
                          ? 'bg-cyan-500 text-white' 
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <MdOutlineExplore className={activeFilter === 'recent' ? "text-sm text-white" : "text-sm text-cyan-500"} />
                      Recent Visits
                    </button>
                  </div>
                </div>
                
                {/* Date Range and Sort */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="flex items-center justify-center gap-2 text-sm font-medium p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <MdCalendarMonth className="text-cyan-500" />
                    <span>Date Range</span>
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowSortOptions(!showSortOptions)}
                      className="w-full flex items-center justify-center gap-2 text-sm font-medium p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <MdSort className="text-cyan-500" />
                      <span>Sort By</span>
                    </button>
                  </div>
                </div>
                
                {/* Swipe hint */}
                <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                  <span>← Swipe to switch between filters →</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Calendar Popup */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div 
              ref={calendarRef}
              className="mb-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-lg rounded-lg p-3 z-30 absolute lg:relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium dark:text-white">Select Date Range</h3>
                <button 
                  onClick={() => setShowCalendar(false)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="Close calendar"
                >
                  <MdClose size={20} />
                </button>
              </div>
              <DayPicker 
                captionLayout="dropdown-buttons" 
                mode="range" 
                selected={dataRange} 
                onSelect={handleDayClick} 
                pagedNavigation 
              />
              
              <div className="mt-3 flex justify-end">
                <button 
                  onClick={filterStoriesByDateRange}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
                  disabled={!dataRange.from || !dataRange.to}
                >
                  Apply Filter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 order-2 lg:order-1">
            <div className="hidden sm:flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {getDisplayedStories().length} {getDisplayedStories().length === 1 ? 'story' : 'stories'} 
                {activeFilter === 'favorites' ? ' in favorites' : ''}
                {activeFilter === 'recent' ? ' from recent visits' : ''}
              </div>
              
              <div className="hidden lg:flex items-center space-x-2">
                <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-x divide-gray-200 dark:divide-gray-700">
                  <button 
                    onClick={() => {
                      setActiveFilter('all');
                      getAllTravelStories();
                    }}
                    className={`px-3 py-1.5 text-sm font-medium ${activeFilter === 'all' ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-600 dark:text-gray-300'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={handleFavoriteFilter}
                    className={`px-3 py-1.5 text-sm font-medium flex items-center ${activeFilter === 'favorites' ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-600 dark:text-gray-300'}`}
                  >
                    <MdFavorite className="mr-1 text-red-500" /> Favorites
                  </button>
                  <button 
                    onClick={() => setActiveFilter('recent')}
                    className={`px-3 py-1.5 text-sm font-medium flex items-center ${activeFilter === 'recent' ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-600 dark:text-gray-300'}`}
                  >
                    <MdOutlineExplore className="mr-1 text-cyan-500" /> Recent
                  </button>
                </div>
                
                <div className="relative" ref={sortRef}>
                  <button 
                    onClick={() => setShowSortOptions(!showSortOptions)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <MdSort className="text-gray-500" />
                    <span>Sort</span>
                  </button>
                  
                  {showSortOptions && (
                    <div 
                      className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-20 border border-gray-200 dark:border-gray-700"
                    >
                      <button 
                        onClick={() => {setSortBy('newest'); setShowSortOptions(false);}}
                        className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'newest' ? 'bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Newest First
                      </button>
                      <button 
                        onClick={() => {setSortBy('oldest'); setShowSortOptions(false);}}
                        className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'oldest' ? 'bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Oldest First
                      </button>
                      <button 
                        onClick={() => {setSortBy('az'); setShowSortOptions(false);}}
                        className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'az' ? 'bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        A-Z
                      </button>
                      <button 
                        onClick={() => {setSortBy('za'); setShowSortOptions(false);}}
                        className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'za' ? 'bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        Z-A
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : getDisplayedStories().length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {getDisplayedStories().map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TravelStoryCard
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => isOnline ? updateIsFavourite(item) : toast.error('You need to be online to update favorites')}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center">
                <EmptyCard 
                  imgSrc={getEmptyImg(filterType)} 
                  message={
                    activeFilter === 'favorites' && allStories.length > 0
                      ? "You haven't marked any stories as favorites yet."
                      : activeFilter === 'recent' && allStories.length > 0
                      ? "No travel stories from the last 30 days."
                      : getEmptyCardMessage(filterType)
                  } 
                  onAddClick={isOnline ? () => handleAddOrEditStory() : null}
                />
              </div>
            )}
          </div>

          <div className="hidden lg:block w-full lg:w-[320px] order-1 lg:order-2 sticky top-24 self-start">
            <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-lg shadow-slate-200/60 dark:shadow-none rounded-lg">
              <div className="p-3">
                <DayPicker 
                  captionLayout="dropdown-buttons" 
                  mode="range" 
                  selected={dataRange} 
                  onSelect={handleDayClick} 
                  pagedNavigation 
                />
              </div>
            </div>
            
            {allStories.length > 0 && (
              <div className="mt-6">
                <button 
                  onClick={() => isOnline ? setShowAnalytics(true) : toast.error('Analytics require an internet connection')}
                  className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-lg shadow-sm w-full"
                >
                  <MdQueryStats className="text-lg text-cyan-500" />
                  <span>View Analytics</span>
                </button>
              </div>
            )}
            
            {!isOnline && hasOfflineData && (
              <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h4 className="font-medium text-amber-800 dark:text-amber-400 flex items-center">
                  <MdOfflinePin className="mr-2" />
                  Offline Mode
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  You're viewing cached data. Some features are limited while offline.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 flex items-center text-xs text-amber-800 dark:text-amber-300"
                >
                  <MdRefresh className="mr-1" /> Try reconnecting
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 999,
          },
        }}
        appElement={document.getElementById('root')}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: 'add', data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>
      
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 999,
          },
        }}
        appElement={document.getElementById('root')}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => handleEditClick(openViewModal.data || null)}
          onDeleteClick={() => handleDeleteClick(openViewModal.data || null)}
        />
      </Modal>
      
      <Modal
        isOpen={showAnalytics}
        onRequestClose={() => setShowAnalytics(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 999,
          },
        }}
        appElement={document.getElementById('root')}
        className="model-box max-w-3xl mx-auto"
      >
        <TravelAnalytics onClose={() => setShowAnalytics(false)} />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onRequestClose={() => setDeleteConfirmation({ isOpen: false, story: null })}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          content: {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            maxWidth: '400px',
            width: '100%',
            padding: 0,
            border: 'none',
            background: 'transparent',
            overflow: 'visible'
          }
        }}
        appElement={document.getElementById('root')}
        className="model-box max-w-md mx-auto"
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl aspect-square"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-4">
                  <MdDeleteOutline className="text-2xl text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Delete Travel Story</h3>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Are you sure you want to delete "<span className="font-medium text-gray-800 dark:text-white">{deleteConfirmation.story?.title}</span>"? 
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex items-start">
                  <MdWarning className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    This action cannot be undone. This will permanently delete your travel story.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-auto">
              <motion.button 
                onClick={() => setDeleteConfirmation({ isOpen: false, story: null })}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center shadow-sm"
                whileHover={{ scale: 1.02, backgroundColor: "#ef4444" }}
                whileTap={{ scale: 0.98 }}
              >
                <MdDeleteOutline className="mr-1" /> Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Modal>

      {/* Edit Confirmation Modal */}
      <Modal
        isOpen={editConfirmation.isOpen}
        onRequestClose={() => setEditConfirmation({ isOpen: false, story: null })}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          content: {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            maxWidth: '400px',
            width: '100%',
            padding: 0,
            border: 'none',
            background: 'transparent',
            overflow: 'visible'
          }
        }}
        appElement={document.getElementById('root')}
        className="model-box max-w-md mx-auto"
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl aspect-square"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mr-4">
                  <MdEdit className="text-2xl text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Travel Story</h3>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You're about to edit "<span className="font-medium text-gray-800 dark:text-white">{editConfirmation.story?.title}</span>"
                </p>
                <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-md p-3 flex items-start">
                  <MdInfo className="text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-cyan-700 dark:text-cyan-300">
                    You'll be able to modify all aspects of your travel story.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-auto">
              <motion.button 
                onClick={() => setEditConfirmation({ isOpen: false, story: null })}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button 
                onClick={confirmEdit}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-lg flex items-center shadow-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MdEdit className="mr-1" /> Edit
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Modal>
      
      <motion.button 
        className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-4 sm:right-10 bottom-6 sm:bottom-10 shadow-lg z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={!isOnline}
        onClick={() => {
          if (isOnline) {
            setOpenAddEditModal({ isShown: true, type: 'add', data: null });
          } else {
            toast.error('You need to be online to add new stories');
          }
        }}
        aria-label="Add new travel story"
      >
        <MdAdd className="text-[28px] sm:text-[32px] text-white" />
      </motion.button>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
    </HelmetProvider>
  );
};

export default Home;
