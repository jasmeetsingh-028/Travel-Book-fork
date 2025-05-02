import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import { MdAdd, MdQueryStats, MdFilterAlt, MdClose, MdCalendarMonth } from 'react-icons/md';
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
  const calendarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    getAllTravelStories();
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
      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-4 sm:mb-6">
          <FilterInfoTitle filterType={filterType} filterDates={dataRange} onClear={resetFilter} />
          
          <div className="mt-4 flex flex-wrap gap-3 sm:hidden">
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white py-2 px-4 rounded-lg shadow-sm"
            >
              <MdCalendarMonth className="text-lg text-primary" />
              <span>Filter by Date</span>
            </button>
            
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
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : allStories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
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
                ))}
              </div>
            ) : (
              <div className="flex justify-center">
                <EmptyCard imgSrc={getEmptyImg(filterType)} message={getEmptyCardMessage(filterType)} />
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

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </>
  );
};

export default Home;
