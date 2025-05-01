import React, { useState } from "react";
import { GrMapLocation } from "react-icons/gr";
import { MdUpdate, MdDeleteOutline, MdClose, MdShare } from "react-icons/md";
import moment from "moment";
import { toast, Toaster } from 'sonner';
import { 
    FacebookShareButton, TwitterShareButton, WhatsappShareButton, 
    LinkedinShareButton, EmailShareButton, TelegramShareButton,
    FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon, 
    EmailIcon, TelegramIcon
} from 'react-share';

const ViewTravelStory = ({ storyInfo, onClose, onEditClick, onDeleteClick }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);
    
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

    return (
        <div className="relative">
            <div className="flex items-center justify-end">
                <div>
                    <div className="flex items-center gap-3 bg-cyan-50 dark:bg-gray-700 p-2 rounded-lg">
                        <button className="btn-small" onClick={() => handleShare(storyInfo._id)}>
                            <MdShare className="text-lg" /> Share This Story
                        </button>
                        
                        <button className="btn-small" onClick={onEditClick}>
                            <MdUpdate className="text-lg" /> Update This Story
                        </button>

                        <button className="btn-small btn-delete" onClick={onDeleteClick}>
                            <MdDeleteOutline className="text-lg" /> Delete This Story
                        </button>

                        <button className="" onClick={onClose}>
                            <MdClose className="text-xl text-slate-400" />
                        </button>
                    </div>
                </div>
            </div>

            {showShareOptions && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium dark:text-white">Share via</h3>
                        <button onClick={() => setShowShareOptions(false)}>
                            <MdClose className="text-xl text-slate-400" />
                        </button>
                    </div>
                    <div className="flex space-x-4 justify-center">
                        <FacebookShareButton 
                            url={`${window.location.origin}/story/${storyInfo._id}`}
                            quote={`Check out my travel story: ${storyInfo.title}`}
                            hashtag="#TravelBook"
                        >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        
                        <TwitterShareButton
                            url={`${window.location.origin}/story/${storyInfo._id}`}
                            title={`Check out my travel story: ${storyInfo.title}`}
                            hashtags={["TravelBook", "Travel", ...storyInfo.visitedLocation]}
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        
                        <WhatsappShareButton
                            url={`${window.location.origin}/story/${storyInfo._id}`}
                            title={`Check out my travel story: ${storyInfo.title}`}
                        >
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        
                        <LinkedinShareButton
                            url={`${window.location.origin}/story/${storyInfo._id}`}
                            title={`Check out my travel story: ${storyInfo.title}`}
                            summary={storyInfo.story.substring(0, 100) + '...'}
                            source="TravelBook"
                        >
                            <LinkedinIcon size={32} round />
                        </LinkedinShareButton>
                        
                        <EmailShareButton
                            url={`${window.location.origin}/story/${storyInfo._id}`}
                            subject={`Check out my travel story: ${storyInfo.title}`}
                            body={`I wanted to share my travel story with you:\n\n${storyInfo.story.substring(0, 150)}...\n\nRead more at:`}
                        >
                            <EmailIcon size={32} round />
                        </EmailShareButton>
                        
                        <TelegramShareButton
                            url={`${window.location.origin}/story/${storyInfo._id}`}
                            title={`Check out my travel story: ${storyInfo.title}`}
                        >
                            <TelegramIcon size={32} round />
                        </TelegramShareButton>
                    </div>
                </div>
            )}

            <div>
                <div className="flex-1 flex flex-col gap-2 py-4">
                    <h1 className="text-2xl text-slate-950 dark:text-white">
                        {storyInfo && storyInfo.title}
                    </h1>

                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-500 dark:text-gray-300">
                            {storyInfo && moment(storyInfo.visitedDate).format("Do MMM YYYY")}
                        </span>
                        
                        <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 dark:bg-cyan-900/40 dark:text-cyan-300 rounded px-2 py-1">
                            <GrMapLocation className="text-sm"/>
                            {storyInfo && storyInfo.visitedLocation.map((item, index) => 
                                storyInfo.visitedLocation.length === index + 1 ? item : `${item}, `
                            )}
                        </div>
                    </div>
                </div>
                <img src={storyInfo && storyInfo.imageUrl} alt="Selected" className="w-full h-[300px] object-cover rounded-lg" />

                <div className="mt-4">
                    <p className="text-sm text-slate-950 dark:text-gray-200 leading-6 text-justify whitespace-pre-line">
                        {storyInfo.story}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ViewTravelStory;
