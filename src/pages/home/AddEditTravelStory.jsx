import React, { useState, useEffect } from 'react';
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate, MdShare, MdLocationOn, MdCalendarToday, MdTitle, MdDescription, MdImage, MdEdit, MdCheck } from 'react-icons/md';
import { FiCheckCircle } from 'react-icons/fi';
import DataSelector from '../../components/Input/DataSelector';
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
            return 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 shadow-sm';
        }
        return 'border-slate-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-300';
    };

    return (
        <motion.div 
            className='relative bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/60 p-6 transition-all duration-300 max-w-4xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
        >
            <Toaster richColors position="top-center" />
            
            {/* Header with Progress Bar */}
            <div className='mb-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h5 className='text-2xl font-bold text-slate-800 dark:text-white flex items-center'>
                        {type === "add" ? 
                            <><MdAdd className='text-cyan-500 mr-2' /> Create New Memory</> : 
                            <><MdEdit className='text-cyan-500 mr-2' /> Update Your Memory</>
                        }
                    </h5>
                    <motion.button 
                        className='p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 transition-all text-slate-500 dark:text-slate-300' 
                        onClick={onClose}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <MdClose className='text-xl' />
                    </motion.button>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-gray-700 rounded-full h-2.5 mb-3 overflow-hidden">
                    <motion.div 
                        className="bg-gradient-to-r from-cyan-400 to-cyan-600 dark:from-cyan-500 dark:to-cyan-700 h-2.5 rounded-full"
                        style={{ width: `${completionPercentage()}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage()}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    ></motion.div>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 flex justify-between items-center">
                    <div className="flex items-center">
                        <span>Progress: {completionPercentage()}% completed</span>
                        {completionPercentage() === 100 && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="ml-2 flex items-center text-green-500"
                            >
                                <MdCheck className="mr-1" /> Ready to submit
                            </motion.span>
                        )}
                    </div>
                    {error && <span className='text-red-500 dark:text-red-400'>{error}</span>}
                </div>
            </div>

            {/* Form Content */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Left Column - Navigation Steps */}
                <div className='md:col-span-1'>
                    <div className='flex flex-col gap-3'>
                        <motion.div 
                            className={`p-4 border rounded-lg cursor-pointer dark:text-white ${getStepClass(1)} ${formCompleted.title ? 'bg-gradient-to-r from-cyan-50 to-slate-50 dark:from-cyan-900/20 dark:to-gray-800 border-cyan-200 dark:border-cyan-800' : ''}`}
                            onClick={() => setActiveStep(1)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.title ? 'bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300' : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300'}`}>
                                    {formCompleted.title ? <FiCheckCircle /> : <MdTitle />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Title</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formCompleted.title ? 'Completed' : 'Name your adventure'}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={`p-4 border rounded-lg cursor-pointer dark:text-white ${getStepClass(2)} ${formCompleted.date ? 'bg-gradient-to-r from-cyan-50 to-slate-50 dark:from-cyan-900/20 dark:to-gray-800 border-cyan-200 dark:border-cyan-800' : ''}`}
                            onClick={() => setActiveStep(2)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.date ? 'bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300' : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300'}`}>
                                    {formCompleted.date ? <FiCheckCircle /> : <MdCalendarToday />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Date</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formCompleted.date ? 'Completed' : 'When did you visit?'}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={`p-4 border rounded-lg cursor-pointer dark:text-white ${getStepClass(3)} ${formCompleted.image ? 'bg-gradient-to-r from-cyan-50 to-slate-50 dark:from-cyan-900/20 dark:to-gray-800 border-cyan-200 dark:border-cyan-800' : ''}`}
                            onClick={() => setActiveStep(3)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.image ? 'bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300' : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300'}`}>
                                    {formCompleted.image ? <FiCheckCircle /> : <MdImage />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Image</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formCompleted.image ? 'Completed' : 'Add a memorable photo'}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={`p-4 border rounded-lg cursor-pointer dark:text-white ${getStepClass(4)} ${formCompleted.story ? 'bg-gradient-to-r from-cyan-50 to-slate-50 dark:from-cyan-900/20 dark:to-gray-800 border-cyan-200 dark:border-cyan-800' : ''}`}
                            onClick={() => setActiveStep(4)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.story ? 'bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300' : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300'}`}>
                                    {formCompleted.story ? <FiCheckCircle /> : <MdDescription />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Story</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formCompleted.story ? 'Completed' : 'Tell your tale'}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={`p-4 border rounded-lg cursor-pointer dark:text-white ${getStepClass(5)} ${formCompleted.location ? 'bg-gradient-to-r from-cyan-50 to-slate-50 dark:from-cyan-900/20 dark:to-gray-800 border-cyan-200 dark:border-cyan-800' : ''}`}
                            onClick={() => setActiveStep(5)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formCompleted.location ? 'bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300' : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300'}`}>
                                    {formCompleted.location ? <FiCheckCircle /> : <MdLocationOn />}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium">Locations</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{formCompleted.location ? 'Completed' : 'Where did you go?'}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Tips Card */}
                    <div className="mt-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg border border-cyan-100 dark:border-gray-600">
                        <h3 className="font-medium text-gray-800 dark:text-white text-md mb-2">Travel Story Tips</h3>
                        <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
                            <li className="flex items-start">
                                <span className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300 p-1 rounded mr-2 mt-0.5">•</span>
                                <span>Add specific details to make your story vivid</span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300 p-1 rounded mr-2 mt-0.5">•</span>
                                <span>Include your favorite moments and discoveries</span>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-600 dark:text-cyan-300 p-1 rounded mr-2 mt-0.5">•</span>
                                <span>Photos bring your travel story to life</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Column - Form Fields */}
                <div className='md:col-span-2 p-5 border rounded-lg bg-white/50 dark:bg-gray-800/50 border-slate-200 dark:border-gray-700 shadow-sm'>
                    <AnimatePresence mode="wait">
                        {/* Title Input - Step 1 */}
                        {activeStep === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <h3 className='text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center'>
                                    <MdTitle className='mr-2 text-cyan-500' /> Title your memory
                                </h3>
                                <div className='bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700'>
                                    <input
                                        type="text"
                                        className='text-2xl w-full text-slate-800 dark:text-white outline-none border-b-2 border-slate-200 dark:border-gray-600 focus:border-cyan-400 dark:focus:border-cyan-600 pb-2 transition-all bg-transparent'
                                        placeholder='A memorable day at...'
                                        value={title}
                                        onChange={({ target }) => setTitle(target.value)}
                                    />
                                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-3'>Give your travel memory a catchy title that captures the essence of your experience.</p>
                                </div>
                                <div className='mt-6 flex justify-end'>
                                    <motion.button 
                                        className='bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center shadow-sm'
                                        onClick={() => setActiveStep(2)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next <span className='ml-2'>→</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Date Input - Step 2 */}
                        {activeStep === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <h3 className='text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center'>
                                    <MdCalendarToday className='mr-2 text-cyan-500' /> When did this happen?
                                </h3>
                                <div className='bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700'>
                                    <DataSelector date={visitedDate} setDate={setVisitedDate} />
                                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-3'>Select the date when you visited this location.</p>
                                </div>
                                <div className='mt-6 flex justify-between'>
                                    <motion.button 
                                        className='border border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg transition-colors flex items-center'
                                        onClick={() => setActiveStep(1)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className='mr-2'>←</span> Previous
                                    </motion.button>
                                    <motion.button 
                                        className='bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center shadow-sm'
                                        onClick={() => setActiveStep(3)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next <span className='ml-2'>→</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Image Input - Step 3 */}
                        {activeStep === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <h3 className='text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center'>
                                    <MdImage className='mr-2 text-cyan-500' /> Add a photo
                                </h3>
                                <div className='bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700'>
                                    <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />
                                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-3'>Upload a photo that best captures your travel experience.</p>
                                </div>
                                <div className='mt-6 flex justify-between'>
                                    <motion.button 
                                        className='border border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg transition-colors flex items-center'
                                        onClick={() => setActiveStep(2)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className='mr-2'>←</span> Previous
                                    </motion.button>
                                    <motion.button 
                                        className='bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center shadow-sm'
                                        onClick={() => setActiveStep(4)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next <span className='ml-2'>→</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Story Input - Step 4 */}
                        {activeStep === 4 && (
                            <motion.div 
                                key="step4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <h3 className='text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center'>
                                    <MdDescription className='mr-2 text-cyan-500' /> Tell your story
                                </h3>
                                <div className='bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700'>
                                    <textarea
                                        className='w-full text-slate-800 dark:text-white outline-none border border-slate-200 dark:border-gray-600 rounded-lg p-3 focus:border-cyan-400 dark:focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900/30 transition-all min-h-[200px] bg-transparent'
                                        placeholder='Start writing your travel story here...'
                                        value={story}
                                        onChange={({ target }) => setStory(target.value)}
                                    ></textarea>
                                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-3'>Describe your experience, include interesting details and memorable moments.</p>
                                </div>
                                <div className='mt-6 flex justify-between'>
                                    <motion.button 
                                        className='border border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg transition-colors flex items-center'
                                        onClick={() => setActiveStep(3)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className='mr-2'>←</span> Previous
                                    </motion.button>
                                    <motion.button 
                                        className='bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center shadow-sm'
                                        onClick={() => setActiveStep(5)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next <span className='ml-2'>→</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Locations Input - Step 5 */}
                        {activeStep === 5 && (
                            <motion.div 
                                key="step5"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <h3 className='text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center'>
                                    <MdLocationOn className='mr-2 text-cyan-500' /> Add locations
                                </h3>
                                <div className='bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700'>
                                    <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-3'>Add all the places you visited during this trip.</p>
                                </div>
                                <div className='mt-6 flex justify-between'>
                                    <motion.button 
                                        className='border border-slate-300 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg transition-colors flex items-center'
                                        onClick={() => setActiveStep(4)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className='mr-2'>←</span> Previous
                                    </motion.button>
                                    <motion.button 
                                        className={`px-6 py-3 rounded-lg text-white flex items-center justify-center font-medium transition-all shadow-sm ${loading ? 'bg-cyan-400 dark:bg-cyan-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700 hover:from-cyan-600 hover:to-cyan-700 dark:hover:from-cyan-500 dark:hover:to-cyan-600'}`}
                                        onClick={handleAddOrUpdateClick}
                                        disabled={loading}
                                        whileHover={!loading ? { scale: 1.05 } : {}}
                                        whileTap={!loading ? { scale: 0.95 } : {}}
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
                                                        Save Memory
                                                    </>
                                                ) : (
                                                    <>
                                                        <MdUpdate className='mr-2 text-xl' /> 
                                                        Update Memory
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

export default AddEditTravelStory;
