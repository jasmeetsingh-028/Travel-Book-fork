import React, { useState, useEffect } from "react";
import { GrMapLocation } from "react-icons/gr";
import { MdUpdate, MdDeleteOutline, MdClose, MdShare, MdImage, MdOutlineZoomIn, MdLocationOn, MdFavorite } from "react-icons/md";
import moment from "moment";
import { toast, Toaster } from 'sonner';
import { 
    FacebookShareButton, TwitterShareButton, WhatsappShareButton, 
    LinkedinShareButton, EmailShareButton, TelegramShareButton,
    FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon, 
    EmailIcon, TelegramIcon
} from 'react-share';
import { motion, AnimatePresence } from 'framer-motion';
import LocationMap from "../../components/Cards/LocationMap";

const ViewTravelStory = ({ storyInfo, onClose, onEditClick, onDeleteClick }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [showFullImage, setShowFullImage] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [activeTab, setActiveTab] = useState('story');
    
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
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
        setShowShareOptions(true);
    };

    // Auto-scroll to top when modal opens
    useEffect(() => {
        if (storyInfo) {
            const modalElement = document.querySelector('.model-box');
            if (modalElement) {
                modalElement.scrollTo(0, 0);
            }
        }
    }, [storyInfo]);

    if (!storyInfo) return null;

    return (
        <motion.div 
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Full image view overlay */}
            <AnimatePresence>
                {showFullImage && (
                    <motion.div 
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowFullImage(false)}
                    >
                        <button 
                            className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2"
                            onClick={() => setShowFullImage(false)}
                        >
                            <MdClose className="text-2xl" />
                        </button>
                        <motion.img 
                            src={storyInfo.imageUrl} 
                            alt={storyInfo.title}
                            className="max-h-[90vh] max-w-full object-contain rounded-lg"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action buttons */}
            <motion.div className="flex items-center justify-end mb-4" variants={itemVariants}>
                <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-cyan-50 dark:bg-gray-700 p-2 rounded-lg">
                        <button 
                            className="btn-small flex items-center" 
                            onClick={() => handleShare(storyInfo._id)}
                        >
                            <MdShare className="text-lg" /> 
                            <span className="hidden sm:inline ml-1">Share</span>
                        </button>
                        
                        <button 
                            className="btn-small flex items-center" 
                            onClick={onEditClick}
                        >
                            <MdUpdate className="text-lg" /> 
                            <span className="hidden sm:inline ml-1">Edit</span>
                        </button>

                        <button 
                            className="btn-small btn-delete flex items-center" 
                            onClick={onDeleteClick}
                        >
                            <MdDeleteOutline className="text-lg" /> 
                            <span className="hidden sm:inline ml-1">Delete</span>
                        </button>

                        <button 
                            className="text-slate-400 hover:text-slate-500 dark:text-slate-300 dark:hover:text-slate-200 transition-colors" 
                            onClick={onClose}
                        >
                            <MdClose className="text-xl" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Share options */}
            <AnimatePresence>
                {showShareOptions && (
                    <motion.div 
                        className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium dark:text-white">Share this story via:</h3>
                            <button 
                                className="text-slate-400 hover:text-slate-500 dark:text-slate-300 dark:hover:text-slate-200 transition-colors"
                                onClick={() => setShowShareOptions(false)}
                            >
                                <MdClose className="text-xl" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <FacebookShareButton 
                                url={`${window.location.origin}/story/${storyInfo._id}`}
                                quote={`Check out my travel story: ${storyInfo.title}`}
                                hashtag="#TravelBook"
                            >
                                <FacebookIcon size={36} round />
                            </FacebookShareButton>
                            
                            <TwitterShareButton
                                url={`${window.location.origin}/story/${storyInfo._id}`}
                                title={`Check out my travel story: ${storyInfo.title}`}
                                hashtags={["TravelBook", "Travel", ...storyInfo.visitedLocation.slice(0, 2)]}
                            >
                                <TwitterIcon size={36} round />
                            </TwitterShareButton>
                            
                            <WhatsappShareButton
                                url={`${window.location.origin}/story/${storyInfo._id}`}
                                title={`Check out my travel story: ${storyInfo.title}`}
                            >
                                <WhatsappIcon size={36} round />
                            </WhatsappShareButton>
                            
                            <LinkedinShareButton
                                url={`${window.location.origin}/story/${storyInfo._id}`}
                                title={`Check out my travel story: ${storyInfo.title}`}
                                summary={storyInfo.story.substring(0, 100) + '...'}
                                source="TravelBook"
                            >
                                <LinkedinIcon size={36} round />
                            </LinkedinShareButton>
                            
                            <EmailShareButton
                                url={`${window.location.origin}/story/${storyInfo._id}`}
                                subject={`Check out my travel story: ${storyInfo.title}`}
                                body={`I wanted to share my travel story with you:\n\n${storyInfo.story.substring(0, 150)}...\n\nRead more at:`}
                            >
                                <EmailIcon size={36} round />
                            </EmailShareButton>
                            
                            <TelegramShareButton
                                url={`${window.location.origin}/story/${storyInfo._id}`}
                                title={`Check out my travel story: ${storyInfo.title}`}
                            >
                                <TelegramIcon size={36} round />
                            </TelegramShareButton>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Story Header */}
            <motion.div variants={itemVariants}>
                <div className="flex-1 flex flex-col gap-2 py-2">
                    <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
                        {storyInfo.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {moment(storyInfo.visitedDate).format("Do MMM YYYY")}
                            </span>
                            
                            {storyInfo.isFavourite && (
                                <span className="inline-flex items-center text-xs text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded">
                                    <MdFavorite className="h-3 w-3 mr-1" />
                                    Favorite
                                </span>
                            )}
                        </div>
                        
                        <div 
                            className="inline-flex items-center gap-1 text-xs text-cyan-600 bg-cyan-100 dark:bg-cyan-900/40 dark:text-cyan-300 rounded px-2 py-1 cursor-pointer hover:bg-cyan-200 dark:hover:bg-cyan-800/50 transition-colors"
                            onClick={() => setShowMap(true)}
                        >
                            <MdLocationOn className="text-sm"/>
                            {storyInfo.visitedLocation.map((item, index) => 
                                storyInfo.visitedLocation.length === index + 1 ? item : `${item}, `
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div className="flex border-b border-gray-200 dark:border-gray-700 mb-4" variants={itemVariants}>
                <button
                    className={`py-2 px-4 font-medium text-sm ${
                        activeTab === 'story'
                            ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500'
                            : 'text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400'
                    }`}
                    onClick={() => setActiveTab('story')}
                >
                    Story
                </button>
                <button
                    className={`py-2 px-4 font-medium text-sm ${
                        activeTab === 'photos'
                            ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500'
                            : 'text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400'
                    }`}
                    onClick={() => setActiveTab('photos')}
                >
                    Photos
                </button>
                <button
                    className={`py-2 px-4 font-medium text-sm ${
                        activeTab === 'location'
                            ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500'
                            : 'text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400'
                    }`}
                    onClick={() => {setActiveTab('location'); setShowMap(true);}}
                >
                    Location
                </button>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'story' && (
                    <motion.div
                        key="story"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="relative w-full h-[250px] mb-4 group rounded-lg overflow-hidden">
                            <img 
                                src={storyInfo.imageUrl} 
                                alt="Travel story" 
                                className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button 
                                    className="bg-white rounded-full p-2 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowFullImage(true);
                                    }}
                                >
                                    <MdOutlineZoomIn className="text-2xl text-gray-800" />
                                </button>
                            </div>
                        </div>

                        <motion.div 
                            className="prose dark:prose-invert prose-sm sm:prose-base mx-auto max-w-none"
                            variants={itemVariants}
                        >
                            <p className="text-sm text-slate-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                                {storyInfo.story}
                            </p>
                        </motion.div>
                    </motion.div>
                )}

                {activeTab === 'photos' && (
                    <motion.div
                        key="photos"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-center"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm mb-4">
                            <div className="relative">
                                <img 
                                    src={storyInfo.imageUrl} 
                                    alt={storyInfo.title} 
                                    className="w-full h-[350px] object-cover" 
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button 
                                        className="bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 shadow-lg transition-all duration-200"
                                        onClick={() => setShowFullImage(true)}
                                    >
                                        <MdOutlineZoomIn className="text-2xl text-gray-800" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3 text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Featured photo for "{storyInfo.title}" story
                                </p>
                            </div>
                        </div>
                        
                        <div className="text-center mt-6">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {/* You can add more photos to your travel story by editing it. */}
                                Currently, we're working on a feature that allows users to add more photos to their specific travel memories.
                            </p>
                            <button 
                                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                                onClick={onEditClick}
                            >
                                <MdImage className="text-lg" /> Add More Photos
                            </button>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'location' && (
                    <motion.div
                        key="location"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-[400px] rounded-lg overflow-hidden"
                    >
                        {showMap && (
                            <LocationMap 
                                location={storyInfo.visitedLocation[0]} 
                                className="w-full h-full rounded-lg"
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Story metadata and additional information */}
            <motion.div 
                className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                variants={itemVariants}
            >
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Story Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400">Created On</span>
                        <span className="text-gray-800 dark:text-gray-200">{moment(storyInfo.createdOn).format("MMMM Do YYYY")}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400">Visit Date</span>
                        <span className="text-gray-800 dark:text-gray-200">{moment(storyInfo.visitedDate).format("MMMM Do YYYY")}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400">Location</span>
                        <span className="text-gray-800 dark:text-gray-200">
                            {storyInfo.visitedLocation.join(', ')}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-400">Status</span>
                        <span className="text-gray-800 dark:text-gray-200 flex items-center">
                            {storyInfo.isFavourite ? (
                                <>
                                    <MdFavorite className="text-red-500 mr-1" />
                                    Marked as favorite
                                </>
                            ) : (
                                'Regular story'
                            )}
                        </span>
                    </div>
                </div>
            </motion.div>
            
            <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        </motion.div>
    );
};

export default ViewTravelStory;
