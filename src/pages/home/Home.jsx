import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import { MdAdd, MdQueryStats, MdFilterAlt, MdClose, MdCalendarMonth, MdWavingHand, MdOutlineExplore, MdFavorite, MdSort } from 'react-icons/md';
import Modal from 'react-modal';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../../components/Cards/EmptyCard';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle';
import { getEmptyCardMessage, getEmptyImg } from '../../utils/helper';
import { Toaster, toast } from 'sonner';
import { Helmet } from "react-helmet";
import TravelAnalytics from '../../components/Cards/TravelAnalytics';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [sortBy, setSortBy] = useState('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [recentDaysFilter, setRecentDaysFilter] = useState(30); // Default to 30 days for recent visits
  
  const calendarRef = useRef(null);
  const sortOptionsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (sortOptionsRef.current && !sortOptionsRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showWelcomeMessage) {
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeMessage]);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const getAllTravelStories = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/get-all-stories');
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      toast.error('Failed to load travel stories. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: 'edit', data: data });
  };

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put(`/update-is-favourite/${storyId}`, {
        isFavourite: !storyData.isFavourite,
      });
      if (response.data && response.data.story) {
        toast.success('Favourite Story Updated.');
        if (filterType === 'search' && searchQuery) {
          onSearchStory(searchQuery);
        } else if (filterType === 'date') {
          filterStoriesByDate(dataRange);
        } else {
          getAllTravelStories();
        }
      }
    } catch (error) {
      toast.error('Failed to update favorite status.');
    }
  };

  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-story/${storyId}`);
      if (response.data && !response.data.error) {
        toast.error('Story Deleted Successfully');
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    } catch (error) {
      toast.error('Failed to delete story.');
    }
  };

  const onSearchStory = async (query) => {
    if (!query.trim()) {
      setFilterType('');
      getAllTravelStories();
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/search', {
        params: {
          query,
        },
      });
      if (response.data && response.data.stories) {
        setFilterType('search');
        setAllStories(response.data.stories);
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setFilterType('');
    getAllTravelStories();
  };

  const filterStoriesByDate = async (day) => {
    if (!day.from || !day.to) return;
    
    setIsLoading(true);
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;
      if (startDate && endDate) {
        const response = await axiosInstance.get('/travel-stories-filter', {
          params: { startDate, endDate },
        });
        if (response.data && response.data.stories) {
          setFilterType('date');
          setAllStories(response.data.stories);
          setShowCalendar(false);
        }
      }
    } catch (error) {
      toast.error('Failed to filter stories by date.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayClick = (day) => {
    setDataRange(day);
    filterStoriesByDate(day);
  };

  const resetFilter = () => {
    setDataRange({ from: null, to: null });
    setFilterType('');
    setActiveFilter('all');
    getAllTravelStories();
  };

  const sortStories = (stories, sortType) => {
    if (!stories || stories.length === 0) return [];
    
    const sorted = [...stories];
    
    switch (sortType) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn));
      case 'az':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'za':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  };

  const filterStories = (stories, filter) => {
    if (!stories || stories.length === 0) return [];
    if (filter === 'all') return stories;
    
    if (filter === 'favorites') {
      return stories.filter(story => story.isFavourite);
    }
    
    if (filter === 'recent') {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - recentDaysFilter);
      return stories.filter(story => {
        const visitedDate = new Date(story.visitedDate);
        return visitedDate >= recentDate;
      });
    }
    
    return stories;
  };

  const getDisplayedStories = () => {
    const filtered = filterStories(allStories, activeFilter);
    return sortStories(filtered, sortBy);
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard | Travel Book</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      
      <Navbar 
        userInfo={userInfo} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onSearchNote={onSearchStory} 
        handleClearSearch={handleClearSearch} 
      />
      
      <AnimatePresence>
        {showWelcomeMessage && userInfo && (
          <motion.div 
            className="fixed top-20 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border-l-4 border-cyan-500 max-w-md"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
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
              >
                <MdClose />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-4 sm:mb-6">
          <FilterInfoTitle filterType={filterType} filterDates={dataRange} onClear={resetFilter} />
          
          <div className="overflow-x-auto pb-2 mt-4 hide-scrollbar">
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveFilter('all')} 
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                }`}
              >
                All Stories
              </button>
              <button 
                onClick={() => setActiveFilter('favorites')} 
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
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
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  activeFilter === 'recent' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <MdOutlineExplore className={activeFilter === 'recent' ? "text-sm text-white" : "text-sm text-cyan-500"} />
                Recent Visits
              </button>
              {activeFilter === 'recent' && (
                <div className="relative ml-2 flex items-center">
                  <select 
                    value={recentDaysFilter}
                    onChange={(e) => setRecentDaysFilter(Number(e.target.value))}
                    className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg text-sm py-1 px-2"
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 3 months</option>
                    <option value={180}>Last 6 months</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3 sm:hidden">
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white py-2 px-4 rounded-lg shadow-sm"
            >
              <MdCalendarMonth className="text-lg text-primary" />
              <span>Filter by Date</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white py-2 px-4 rounded-lg shadow-sm"
              >
                <MdSort className="text-lg text-primary" />
                <span>Sort</span>
              </button>
              
              {showSortOptions && (
                <div 
                  ref={sortOptionsRef}
                  className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-20 border border-gray-200 dark:border-gray-700"
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
            
            {allStories.length > 0 && (
              <button 
                onClick={() => setShowAnalytics(true)}
                className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white py-2 px-4 rounded-lg shadow-sm"
              >
                <MdQueryStats className="text-lg text-primary" />
                <span>Analytics</span>
              </button>
            )}
          </div>
        </div>
        
        <AnimatePresence>
          {showCalendar && (
            <motion.div 
              ref={calendarRef}
              className="sm:hidden mb-6 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-lg rounded-lg p-3"
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
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 order-2 lg:order-1">
            <div className="hidden sm:flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {getDisplayedStories().length} {getDisplayedStories().length === 1 ? 'story' : 'stories'} 
                {activeFilter === 'favorites' ? ' in favorites' : ''}
                {activeFilter === 'recent' ? ` in the last ${recentDaysFilter} ${recentDaysFilter === 1 ? 'day' : 'days'}` : ''}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 py-1 px-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded"
                >
                  <span>Sort: </span>
                  <span className="font-medium">
                    {sortBy === 'newest' && 'Newest First'}
                    {sortBy === 'oldest' && 'Oldest First'}
                    {sortBy === 'az' && 'A-Z'}
                    {sortBy === 'za' && 'Z-A'}
                  </span>
                  <MdSort />
                </button>
                
                {showSortOptions && (
                  <div 
                    ref={sortOptionsRef}
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
                      onFavouriteClick={(e) => {
                        e.stopPropagation();
                        updateIsFavourite(item);
                      }}
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
                      : getEmptyCardMessage(filterType)
                  } 
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
              <button 
                onClick={() => setShowAnalytics(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-4 rounded-lg transition-colors"
              >
                <MdQueryStats className="text-lg" />
                <span>View Your Travel Analytics</span>
              </button>
            )}
            
            <div className="mt-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg border border-cyan-100 dark:border-gray-600">
              <h3 className="font-medium text-gray-800 dark:text-white text-lg mb-3">Travel Tips</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
                <li className="flex items-start">
                  <span className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300 p-1 rounded mr-2 mt-0.5">•</span>
                  <span>Use the "+" button to create new travel stories</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300 p-1 rounded mr-2 mt-0.5">•</span>
                  <span>Mark stories as favorites for easy access</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300 p-1 rounded mr-2 mt-0.5">•</span>
                  <span>Share your stories on Instagram or with a link</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

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
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
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
      
      <motion.button 
        className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-4 sm:right-10 bottom-6 sm:bottom-10 shadow-lg z-20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: 'add', data: null });
        }}
      >
        <MdAdd className="text-[28px] sm:text-[32px] text-white" />
      </motion.button>

      <style jsx="true">{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </>
  );
};

export default Home;
