import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaGlobe, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { BiCode, BiUserPlus } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const Contributors = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchContributors();
  }, []);

  const fetchContributors = async () => {
    try {
      const response = await axiosInstance.get('/contributors');
      setContributors(response.data.contributors || []);
    } catch (error) {
      console.error('Error fetching contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContributors = contributors.filter(contributor => {
    if (filter === 'all') return true;
    return contributor.contributionType?.toLowerCase().includes(filter);
  });

  const contributionTypes = ['all', 'feature', 'bug fix', 'ui', 'documentation'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-500 dark:border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contributors</h1>
            </motion.div>
            
            <motion.button
              onClick={() => navigate('/contribute')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 shadow-lg"
            >
              <BiUserPlus className="w-5 h-5" />
              <span>Become a Contributor</span>
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                <BiCode className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{contributors.length}</p>
                <p className="text-gray-600 dark:text-gray-400">Total Contributors</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FaGithub className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {contributors.reduce((acc, c) => acc + (c.prLinks?.length || 0), 0)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Total PRs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FaGlobe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {new Set(contributors.map(c => c.country).filter(Boolean)).size}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Countries</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {contributionTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === type
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Contributors Grid */}
        {filteredContributors.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredContributors.map((contributor) => (
              <motion.div
                key={contributor._id}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                {/* Profile Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={contributor.profilePicture || `https://github.com/${contributor.githubUsername}.png`}
                    alt={contributor.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {contributor.fullName}
                    </h3>
                    <p className="text-cyan-600 dark:text-cyan-400 font-medium">
                      @{contributor.githubUsername}
                    </p>
                    {contributor.country && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                        <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                        {contributor.country}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {contributor.bio && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {contributor.bio}
                  </p>
                )}

                {/* Contribution Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contribution:</span>
                    <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 text-xs rounded-full">
                      {contributor.contributionType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contributor.contributionDescription}
                  </p>
                </div>

                {/* PR Links */}
                {contributor.prLinks && contributor.prLinks.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Pull Requests:
                    </span>
                    <div className="space-y-1">
                      {contributor.prLinks.slice(0, 2).map((pr, index) => (
                        <a
                          key={index}
                          href={pr}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-sm transition-colors"
                        >
                          <FaExternalLinkAlt className="w-3 h-3 mr-2" />
                          PR #{pr.split('/').pop()}
                        </a>
                      ))}
                      {contributor.prLinks.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{contributor.prLinks.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <a
                    href={`https://github.com/${contributor.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                  {contributor.linkedinProfile && (
                    <a
                      href={contributor.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                  )}
                  {contributor.portfolioWebsite && (
                    <a
                      href={contributor.portfolioWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      <FaGlobe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BiCode className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No contributors found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Be the first to contribute to our project!
            </p>
            <button
              onClick={() => navigate('/contribute')}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Start Contributing
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Contributors;
