import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { FaCheck, FaTimes, FaEye, FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaTrash } from 'react-icons/fa';
import { BiCalendar, BiUser } from 'react-icons/bi';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../utils/AuthContext';
import EnvDebug from '../../components/EnvDebug';

const AdminContributors = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all

  // Function to get user info directly from API (same as Home component)
  const getUserInfo = async () => {
    try {
      const user = await axiosInstance.get('/get-user');
      setUserInfo(user.data.user);
      console.log('User info from API:', user.data.user);
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  };

  // Check if user is admin - check both currentUser and userInfo
  const isAdmin = (currentUser?.email === 'sahilk64555@gmail.com') || (userInfo?.email === 'sahilk64555@gmail.com');

  useEffect(() => {
    console.log('=== ADMIN DEBUG INFO ===');
    console.log('Environment mode:', import.meta.env.MODE);
    console.log('Is development:', import.meta.env.DEV);
    console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
    console.log('Use mock data setting:', import.meta.env.VITE_USE_MOCK_DATA);
    console.log('Current user from context:', currentUser);
    console.log('Auth loading:', authLoading);
    console.log('User info from API:', userInfo);
    console.log('Is admin (context):', currentUser?.email === 'sahilk64555@gmail.com');
    console.log('Is admin (API):', userInfo?.email === 'sahilk64555@gmail.com');
    console.log('Is admin (combined):', isAdmin);
    console.log('========================');
    
    // Get user info from API for consistency
    if (!authLoading && !userInfo) {
      getUserInfo();
    }
    
    // Wait for both auth context and user info
    if (authLoading || !userInfo) {
      return;
    }
    
    if (!isAdmin) {
      console.log('Access denied for user:', currentUser?.email, userInfo?.email);
      toast.error('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }
    
    fetchContributors();
  }, [filter, isAdmin, currentUser, authLoading, userInfo]);

  const fetchContributors = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/admin/contributors?status=${filter}&limit=50`);
      
      if (response.data.success) {
        setContributors(response.data.contributors);
      }
    } catch (error) {
      console.error('Error fetching contributors:', error);
      if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
      } else {
        toast.error('Failed to fetch contributors');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (contributorId, status) => {
    try {
      setProcessing({ ...processing, [contributorId]: true });
      
      const response = await axiosInstance.put(`/contributors/${contributorId}/status`, {
        status,
        adminNotes
      });

      if (response.data.success) {
        toast.success(`Contributor ${status} successfully!`);
        setSelectedContributor(null);
        setAdminNotes('');
        fetchContributors();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setProcessing({ ...processing, [contributorId]: false });
    }
  };

  const handleDeleteContributor = async (contributorId, contributorName) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete the contribution from ${contributorName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setProcessing({ ...processing, [contributorId]: true });
      
      const response = await axiosInstance.delete(`/contributors/${contributorId}`);

      if (response.data.success) {
        toast.success('Contributor deleted successfully!');
        fetchContributors();
      }
    } catch (error) {
      console.error('Error deleting contributor:', error);
      toast.error(error.response?.data?.message || 'Failed to delete contributor');
    } finally {
      setProcessing({ ...processing, [contributorId]: false });
    }
  };

  // Show loading while auth is being checked or user info is being fetched
  if (authLoading || !userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have permission to access this page.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
            <p>Current user (context): {currentUser?.email || 'Not logged in'}</p>
            <p>Current user (API): {userInfo?.email || 'Not loaded'}</p>
            <p>Required: sahilk64555@gmail.com</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin - Contributors</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage contributor applications
              </p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex space-x-2">
              {['pending', 'approved', 'rejected', 'all'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading contributors...</p>
          </div>
        ) : (
          <>
            {contributors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No contributors found for status: {filter}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {contributors.map((contributor) => (
                  <motion.div
                    key={contributor._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div>
                            <h3 className="text-xl font-semibold">{contributor.fullName}</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              @{contributor.githubUsername}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            contributor.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                              : contributor.status === 'approved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          }`}>
                            {contributor.status.charAt(0).toUpperCase() + contributor.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Contribution Type</p>
                            <p className="font-medium">{contributor.contributionType}</p>
                          </div>
                          {contributor.email && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                              <p className="font-medium">{contributor.email}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
                            <p className="font-medium">
                              {new Date(contributor.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                          {contributor.country && (
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Country</p>
                              <p className="font-medium">{contributor.country}</p>
                            </div>
                          )}
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Description</p>
                          <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            {contributor.contributionDescription}
                          </p>
                        </div>

                        {contributor.bio && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Bio</p>
                            <p className="text-gray-800 dark:text-gray-200">{contributor.bio}</p>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 mb-4">
                          <a
                            href={`https://github.com/${contributor.githubUsername}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                          >
                            <FaGithub className="w-4 h-4" />
                            <span>GitHub</span>
                          </a>
                          {contributor.linkedinProfile && (
                            <a
                              href={contributor.linkedinProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                              <FaLinkedin className="w-4 h-4" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                          {contributor.portfolioWebsite && (
                            <a
                              href={contributor.portfolioWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                              <FaGlobe className="w-4 h-4" />
                              <span>Portfolio</span>
                            </a>
                          )}
                        </div>

                        {contributor.prLinks && contributor.prLinks.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pull Requests</p>
                            <div className="space-y-1">
                              {contributor.prLinks.map((pr, index) => (
                                <a
                                  key={index}
                                  href={pr}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-cyan-600 dark:text-cyan-400 hover:underline text-sm"
                                >
                                  {pr}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                          <strong>ID:</strong> {contributor._id}
                        </div>
                      </div>
                    </div>

                    {contributor.status === 'pending' && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Admin Notes (optional)
                          </label>
                          <textarea
                            value={selectedContributor === contributor._id ? adminNotes : ''}
                            onChange={(e) => {
                              setSelectedContributor(contributor._id);
                              setAdminNotes(e.target.value);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            rows={2}
                            placeholder="Add notes for the contributor (will be included in email)..."
                          />
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleStatusUpdate(contributor._id, 'approved')}
                            disabled={processing[contributor._id]}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaCheck className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          
                          <button
                            onClick={() => handleStatusUpdate(contributor._id, 'rejected')}
                            disabled={processing[contributor._id]}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaTimes className="w-4 h-4" />
                            <span>Reject</span>
                          </button>

                          <button
                            onClick={() => handleDeleteContributor(contributor._id, contributor.fullName)}
                            disabled={processing[contributor._id]}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaTrash className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {contributor.status !== 'pending' && contributor.reviewedAt && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">
                                {contributor.status === 'approved' ? 'Approved' : 'Rejected'}
                              </span>
                              {' on '}{new Date(contributor.reviewedAt).toLocaleDateString()}
                            </p>
                            {contributor.adminNotes && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <strong>Admin Notes:</strong> {contributor.adminNotes}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteContributor(contributor._id, contributor.fullName)}
                            disabled={processing[contributor._id]}
                            className="flex items-center space-x-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaTrash className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Remove the temporary notice since we now have a working interface */}
          </>
        )}
      </div>
      
      {/* Temporary debug component for production troubleshooting */}
      <EnvDebug />
    </div>
  );
};

export default AdminContributors;
