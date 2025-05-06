import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { formatDistance } from "date-fns";
import { Toaster, toast } from "react-hot-toast";

const PublicProfile = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [travelStories, setTravelStories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/public-profile/${userId}`);
        
        if (data.error) {
          setError(data.message);
          toast.error(data.message);
        } else {
          setProfile(data.profile);
          setTravelStories(data.travelStories);
        }
      } catch (error) {
        console.error("Error fetching public profile:", error);
        setError("Failed to load profile. It might be private or unavailable.");
        toast.error("Failed to load profile. It might be private or unavailable.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPublicProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <Link to="/" className="mt-4 text-primary hover:underline flex items-center">
          <IoMdArrowRoundBack className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Profile Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400">This user profile doesn't exist or may be private.</p>
        <Link to="/" className="mt-4 text-primary hover:underline flex items-center">
          <IoMdArrowRoundBack className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div className="mb-6 flex items-center">
        <Link to="/" className="flex items-center text-primary hover:underline">
          <IoMdArrowRoundBack className="mr-2" /> Back to Home
        </Link>
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6 border-4 border-primary flex-shrink-0">
            <img 
              src={profile.profileImage || "/avatar-default.png"} 
              alt={profile.fullName} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "/avatar-default.png" }}
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">{profile.fullName}</h1>
            {profile.bio && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">{profile.bio}</p>
            )}
            <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              <p>Member since {new Date(profile.joinedAt).toLocaleDateString()}</p>
              <p>{profile.totalStories} travel stories shared</p>
            </div>
            
            {/* Social Links */}
            {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {Object.entries(profile.socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <a 
                      key={platform} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Travel Stories */}
      <h2 className="text-2xl font-bold mb-6">Travel Stories</h2>
      
      {travelStories.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">This user hasn't shared any travel stories yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelStories.map((story) => (
            <div key={story._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="h-40 overflow-hidden">
                <img
                  src={story.coverImage || "/no-image.jpg"}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "/no-image.jpg" }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">{story.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{story.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{story.location}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <FaCalendarAlt className="mr-1" />
                  <span>
                    {new Date(story.travelDate).toLocaleDateString()} • 
                    {formatDistance(new Date(story.createdAt), new Date(), { addSuffix: true })}
                  </span>
                </div>
                
                <Link 
                  to={`/story/${story._id}`} 
                  className="block w-full text-center py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                >
                  Read Story
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicProfile;