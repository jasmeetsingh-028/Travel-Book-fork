import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FaTwitter, FaFacebook, FaLinkedin, FaLink, FaQrcode, FaWhatsapp } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

const ShareProfileModal = ({ isOpen, onClose, profileId, userName }) => {
  const [activeTab, setActiveTab] = useState('social');
  const [profileUrl, setProfileUrl] = useState('');

  useEffect(() => {
    if (profileId) {
      setProfileUrl(`${window.location.origin}/public-profile/${profileId}`);
    }
  }, [profileId]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
      .then(() => {
        toast.success('Profile link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  const openShareWindow = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const text = `Check out ${userName}'s travel stories and adventures!`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`;
    openShareWindow(shareUrl);
  };

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
    openShareWindow(shareUrl);
  };

  const handleLinkedInShare = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
    openShareWindow(shareUrl);
  };
  
  const handleWhatsAppShare = () => {
    const text = `Check out ${userName}'s travel stories and adventures: ${profileUrl}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    openShareWindow(shareUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Share Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            <button
              className={`py-2 px-4 ${activeTab === 'social' 
                ? 'border-b-2 border-cyan-500 text-cyan-500' 
                : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('social')}
            >
              Social Media
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'link' 
                ? 'border-b-2 border-cyan-500 text-cyan-500' 
                : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('link')}
            >
              Copy Link
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'qr' 
                ? 'border-b-2 border-cyan-500 text-cyan-500' 
                : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('qr')}
            >
              QR Code
            </button>
          </div>
          
          {activeTab === 'social' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleTwitterShare}
                className="flex items-center justify-center p-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-opacity-90 transition duration-200"
              >
                <FaTwitter className="mr-2" />
                Twitter
              </button>
              <button
                onClick={handleFacebookShare}
                className="flex items-center justify-center p-3 bg-[#4267B2] text-white rounded-lg hover:bg-opacity-90 transition duration-200"
              >
                <FaFacebook className="mr-2" />
                Facebook
              </button>
              <button
                onClick={handleLinkedInShare}
                className="flex items-center justify-center p-3 bg-[#0077B5] text-white rounded-lg hover:bg-opacity-90 transition duration-200"
              >
                <FaLinkedin className="mr-2" />
                LinkedIn
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center p-3 bg-[#25D366] text-white rounded-lg hover:bg-opacity-90 transition duration-200"
              >
                <FaWhatsapp className="mr-2" />
                WhatsApp
              </button>
            </div>
          )}
          
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div className="flex">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-cyan-500 text-white rounded-r-md hover:bg-cyan-600 transition duration-200"
                >
                  <FaLink />
                </button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Share this link with anyone to let them view your public profile.
              </div>
            </div>
          )}
          
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-3 rounded-lg qr-code-container">
                <QRCodeSVG 
                  value={profileUrl} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <button
                onClick={() => {
                  const svg = document.querySelector('.qr-code-container svg');
                  if (svg) {
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    img.onload = () => {
                      canvas.width = img.width;
                      canvas.height = img.height;
                      ctx.drawImage(img, 0, 0);
                      const pngFile = canvas.toDataURL('image/png');
                      const downloadLink = document.createElement('a');
                      downloadLink.download = `${userName}-profile-qr.png`;
                      downloadLink.href = pngFile;
                      downloadLink.click();
                    };
                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                  }
                }}
                className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-200"
              >
                <FaQrcode className="inline mr-2" />
                Download QR Code
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Scan this QR code to view the profile on a mobile device.
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Only public profiles can be shared. Your profile is currently set to public.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareProfileModal;