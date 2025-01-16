import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../../components/Cards/EmptyCard';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle';
import { getEmptyCardMessage, getEmptyImg } from '../../utils/helper';
import { Toaster, toast } from 'sonner';
import Skeleton from 'react-loading-skeleton'; // Import the skeleton component

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
  const [loading, setLoading] = useState(true); // State to handle loading

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const getAllTravelStories = async () => {
    setLoading(true); // Set loading to true when data fetching begins
    try {
      const response = await axiosInstance.get('/get-all-stories');
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log('An Unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
    }
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearchNote={onSearchStory} handleClearSearch={handleClearSearch} />
      <div className="container mx-auto py-10">
        <FilterInfoTitle filterType={filterType} filterDates={dataRange} onClear={resetFilter} />
        <div className="flex flex-col sm:flex-row gap-7">
          <div className="flex-1">
            {loading ? ( // If loading is true, display skeleton screens
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} height={200} containerClassName="rounded-lg" />
                ))}
              </div>
            ) : allStories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard imgSrc={getEmptyImg(filterType)} message={getEmptyCardMessage(filterType)} />
            )}
          </div>
          <div className="w-full sm:w-[320px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker captionLayout="dropdown-buttons" mode="range" selected={dataRange} onSelect={handleDayClick} pagedNavigation />
              </div>
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
      <button className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10">
        <MdAdd className="text-[32px] text-white" onClick={() => {
          setOpenAddEditModal({ isShown: true, type: 'add', data: null });
        }} />
      </button>
      <Toaster />
    </>
  );
};

export default Home;
