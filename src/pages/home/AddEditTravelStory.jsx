import React, { useState, useEffect } from 'react';
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate, MdShare, MdLocationOn, MdCalendarToday, MdTitle, MdDescription, MdImage } from 'react-icons/md';
import { FiCheckCircle } from 'react-icons/fi';
import DataSelector from '../../components/Input/DataSelector';
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import { toast, Toaster } from 'sonner';

import 'sonner/dist/styles.css';

import uploadImage from '../../utils/uploadImage';

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories,
}) => {
    const [title, setTitle] = useState(storyInfo?.title || "");
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const [story, setStory] = useState(storyInfo?.story || "");
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [formCompleted, setFormCompleted] = useState({
        title: !!storyInfo?.title,
        image: !!storyInfo?.imageUrl,
        story: !!storyInfo?.story,
        location: !!(storyInfo?.visitedLocation && storyInfo?.visitedLocation.length > 0),
        date: !!storyInfo?.visitedDate
    });

    // Check form completion on value changes
    useEffect(() => {
        setFormCompleted({
            title: !!title,
            image: !!storyImg,
            story: !!story,
            location: visitedLocation.length > 0,
            date: !!visitedDate
        });
    }, [title, storyImg, story, visitedLocation, visitedDate]);

    // Calculate completion percentage
    const completionPercentage = () => {
        const totalSteps = 5; // title, image, story, location, date
        const completedSteps = Object.values(formCompleted).filter(val => val).length;
        return Math.round((completedSteps / totalSteps) * 100);
    };

    const addNewTravelStory = async () => {
        setLoading(true);
        try {
            let imageUrl = "";
            if (storyImg) {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post("/add-travel-story", {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            });

            if (response.data && response.data.story) {
                toast.success("Story Added Successfully!");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
            toast.error(error.response?.data?.message || "Failed to add story");
        } finally {
            setLoading(false);
        }
    };

    const updateTravelStory = async () => {
        setLoading(true);
        const storyId = storyInfo._id;
        try {
            let imageUrl = storyInfo.imageUrl || "";
            let postData = { title, story, imageUrl, visitedLocation, visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf() };

            if (typeof storyImg === "object") {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";
                postData.imageUrl = imageUrl;
            }

            const response = await axiosInstance.put(`/edit-story/${storyId}`, postData);

            if (response.data && response.data.story) {
                toast.success("Story Updated Successfully!");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
            toast.error(error.response?.data?.message || "Failed to update story");
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrUpdateClick = () => {
        if (!title) {
            setError("Please enter the title of your story!");
            toast.error("Please enter the title of your story!");
            return;
        }
        if (!story) {
            setError("Please enter the descriptive story.");
            toast.error("Please enter the descriptive story.");
            return;
        }

        setError("");

        if (type === "edit") {
            updateTravelStory();
        } else {
            addNewTravelStory();
        }
    };

    const handleDeleteStoryImg = async () => {
        try {
            setLoading(true);
            const deleteImgRes = await axiosInstance.delete('/delete-image', { params: { imageUrl: storyInfo.imageUrl } });

            if (deleteImgRes.data) {
                const storyId = storyInfo._id;
                const postData = { title, story, visitedLocation, visitedDate: moment().valueOf(), imageUrl: "" };

                await axiosInstance.put(`/edit-story/${storyId}`, postData);
                setStoryImg(null);
                toast.success("Image deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete the image");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = (storyId) => {
        const shareUrl = `${window.location.origin}/story/${storyId}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                toast.success('Link copied to your clipboard! 🎉 Now you can share it with your friends! 😎✨');
            })
            .catch(() => {
                toast.error('Failed to copy the link. Please try again.');
            });
    };

    const getStepClass = (step) => {
        if (activeStep === step) {
            return 'border-blue-500 bg-blue-50 shadow-md';
        }
        return 'border-slate-200 hover:border-blue-300 transition-all duration-300';
    };

    return (
        <div className='relative bg-white rounded-xl shadow-lg p-6 transition-all duration-300 max-w-4xl mx-auto'>
            <Toaster richColors position="top-center" />
            
            {/* Header with Progress Bar */}
            <div className='mb-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h5 className='text-2xl font-bold text-slate-800 flex items-center'>
                        {type === "add" ? 
                            <><MdAdd className='text-blue-500 mr-2' /> Create New Memory</> : 
                            <><MdUpdate className='text-green-500 mr-2' /> Update Your Memory</>
                        }
                    </h5>
                    <button className='p-2 rounded-full hover:bg-slate-100 transition-all' onClick={onClose}>
                        <MdClose className='text-xl text-slate-500' />
                    </button>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-4 mb-2">
                    <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${completionPercentage()}%` }}
                    ></div>
                </div>
                <div className="text-sm text-slate-500 flex justify-between">
                    <span>Progress: {completionPercentage()}% completed</span>
                    {error && <span className='text-red-500'>{error}</span>}
                </div>
            </div>

            {/* Form Content */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Left Column - Navigation Steps */}
                <div className='md:col-span-1'>
                    <div className='flex flex-col gap-3'>
                        <div 
                            className={`p-4 border rounded-lg cursor-pointer ${getStepClass(1)} ${formCompleted.title ? 'bg-green-50 border-green-200' : ''}`}
                            onClick={() => setActiveStep(1)}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.title ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {formCompleted.title ? <FiCheckCircle /> : <MdTitle />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Title</h3>
                                    <p className="text-xs text-slate-500">{formCompleted.title ? 'Completed' : 'Name your adventure'}</p>
                                </div>
                            </div>
                        </div>

                        <div 
                            className={`p-4 border rounded-lg cursor-pointer ${getStepClass(2)} ${formCompleted.date ? 'bg-green-50 border-green-200' : ''}`}
                            onClick={() => setActiveStep(2)}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.date ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {formCompleted.date ? <FiCheckCircle /> : <MdCalendarToday />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Date</h3>
                                    <p className="text-xs text-slate-500">{formCompleted.date ? 'Completed' : 'When did you visit?'}</p>
                                </div>
                            </div>
                        </div>

                        <div 
                            className={`p-4 border rounded-lg cursor-pointer ${getStepClass(3)} ${formCompleted.image ? 'bg-green-50 border-green-200' : ''}`}
                            onClick={() => setActiveStep(3)}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.image ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {formCompleted.image ? <FiCheckCircle /> : <MdImage />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Image</h3>
                                    <p className="text-xs text-slate-500">{formCompleted.image ? 'Completed' : 'Add a memorable photo'}</p>
                                </div>
                            </div>
                        </div>

                        <div 
                            className={`p-4 border rounded-lg cursor-pointer ${getStepClass(4)} ${formCompleted.story ? 'bg-green-50 border-green-200' : ''}`}
                            onClick={() => setActiveStep(4)}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.story ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {formCompleted.story ? <FiCheckCircle /> : <MdDescription />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Story</h3>
                                    <p className="text-xs text-slate-500">{formCompleted.story ? 'Completed' : 'Tell your tale'}</p>
                                </div>
                            </div>
                        </div>

                        <div 
                            className={`p-4 border rounded-lg cursor-pointer ${getStepClass(5)} ${formCompleted.location ? 'bg-green-50 border-green-200' : ''}`}
                            onClick={() => setActiveStep(5)}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.location ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {formCompleted.location ? <FiCheckCircle /> : <MdLocationOn />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Locations</h3>
                                    <p className="text-xs text-slate-500">{formCompleted.location ? 'Completed' : 'Where did you go?'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Form Fields */}
                <div className='md:col-span-2 p-4 border rounded-lg bg-slate-50/50'>
                    {/* Title Input - Step 1 */}
                    {activeStep === 1 && (
                        <div className='transition-all duration-300 animate-fadeIn'>
                            <h3 className='text-lg font-semibold text-slate-800 mb-4 flex items-center'>
                                <MdTitle className='mr-2 text-blue-500' /> Title your memory
                            </h3>
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-slate-200'>
                                <input
                                    type="text"
                                    className='text-2xl w-full text-slate-800 outline-none border-b-2 border-slate-200 focus:border-blue-400 pb-2 transition-all'
                                    placeholder='A memorable day at...'
                                    value={title}
                                    onChange={({ target }) => setTitle(target.value)}
                                />
                                <p className='text-xs text-slate-500 mt-2'>Give your travel memory a catchy title that captures the essence of your experience.</p>
                            </div>
                            <div className='mt-4 flex justify-end'>
                                <button 
                                    className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center'
                                    onClick={() => setActiveStep(2)}
                                >
                                    Next <span className='ml-2'>→</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Date Input - Step 2 */}
                    {activeStep === 2 && (
                        <div className='transition-all duration-300 animate-fadeIn'>
                            <h3 className='text-lg font-semibold text-slate-800 mb-4 flex items-center'>
                                <MdCalendarToday className='mr-2 text-blue-500' /> When did this happen?
                            </h3>
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-slate-200'>
                                <DataSelector date={visitedDate} setDate={setVisitedDate} />
                                <p className='text-xs text-slate-500 mt-2'>Select the date when you visited this location.</p>
                            </div>
                            <div className='mt-4 flex justify-between'>
                                <button 
                                    className='border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg transition-all duration-300 flex items-center'
                                    onClick={() => setActiveStep(1)}
                                >
                                    <span className='mr-2'>←</span> Previous
                                </button>
                                <button 
                                    className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center'
                                    onClick={() => setActiveStep(3)}
                                >
                                    Next <span className='ml-2'>→</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Image Input - Step 3 */}
                    {activeStep === 3 && (
                        <div className='transition-all duration-300 animate-fadeIn'>
                            <h3 className='text-lg font-semibold text-slate-800 mb-4 flex items-center'>
                                <MdImage className='mr-2 text-blue-500' /> Add a photo
                            </h3>
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-slate-200'>
                                <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />
                                <p className='text-xs text-slate-500 mt-2'>Upload a photo that best captures your travel experience.</p>
                            </div>
                            <div className='mt-4 flex justify-between'>
                                <button 
                                    className='border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg transition-all duration-300 flex items-center'
                                    onClick={() => setActiveStep(2)}
                                >
                                    <span className='mr-2'>←</span> Previous
                                </button>
                                <button 
                                    className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center'
                                    onClick={() => setActiveStep(4)}
                                >
                                    Next <span className='ml-2'>→</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Story Input - Step 4 */}
                    {activeStep === 4 && (
                        <div className='transition-all duration-300 animate-fadeIn'>
                            <h3 className='text-lg font-semibold text-slate-800 mb-4 flex items-center'>
                                <MdDescription className='mr-2 text-blue-500' /> Tell your story
                            </h3>
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-slate-200'>
                                <textarea
                                    className='w-full text-slate-800 outline-none border border-slate-200 rounded-lg p-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all min-h-[200px]'
                                    placeholder='Start writing your travel story here...'
                                    value={story}
                                    onChange={({ target }) => setStory(target.value)}
                                ></textarea>
                                <p className='text-xs text-slate-500 mt-2'>Describe your experience, include interesting details and memorable moments.</p>
                            </div>
                            <div className='mt-4 flex justify-between'>
                                <button 
                                    className='border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg transition-all duration-300 flex items-center'
                                    onClick={() => setActiveStep(3)}
                                >
                                    <span className='mr-2'>←</span> Previous
                                </button>
                                <button 
                                    className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center'
                                    onClick={() => setActiveStep(5)}
                                >
                                    Next <span className='ml-2'>→</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Locations Input - Step 5 */}
                    {activeStep === 5 && (
                        <div className='transition-all duration-300 animate-fadeIn'>
                            <h3 className='text-lg font-semibold text-slate-800 mb-4 flex items-center'>
                                <MdLocationOn className='mr-2 text-blue-500' /> Add locations
                            </h3>
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-slate-200'>
                                <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                                <p className='text-xs text-slate-500 mt-2'>Add all the places you visited during this trip.</p>
                            </div>
                            <div className='mt-4 flex justify-between'>
                                <button 
                                    className='border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg transition-all duration-300 flex items-center'
                                    onClick={() => setActiveStep(4)}
                                >
                                    <span className='mr-2'>←</span> Previous
                                </button>
                                <button 
                                    className={`px-6 py-3 rounded-lg text-white flex items-center justify-center font-medium transition-all duration-300 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    onClick={handleAddOrUpdateClick}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {type === 'add' ? (
                                                <>
                                                    <MdAdd className='mr-2 text-xl' /> 
                                                    Save your memory
                                                </>
                                            ) : (
                                                <>
                                                    <MdUpdate className='mr-2 text-xl' /> 
                                                    Update memory
                                                </>
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddEditTravelStory;
