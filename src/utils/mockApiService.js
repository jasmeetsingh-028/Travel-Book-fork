// Mock API Service for Travel Book
// This service provides mock responses for all API endpoints used in the application

import { 
  mockUsers, 
  mockTravelStories, 
  mockAuthResponse, 
  mockProfileStats,
  mockAnalytics,
  getDefaultMockUser,
  getMockStoriesForUser,
  generateMockStoryId,
  getMockSearchResults,
  mockImageUploadResponse
} from './mockData.js';

// Storage keys for localStorage
const STORAGE_KEYS = {
  USER: 'travel_book_mock_user',
  TOKEN: 'travel_book_mock_token',
  STORIES: 'travel_book_mock_stories',
  CURRENT_USER_ID: 'travel_book_mock_user_id'
};

// Initialize mock data in localStorage if not exists
const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(mockTravelStories));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(getDefaultMockUser()));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user_1');
  }
};

// Get current user ID
const getCurrentUserId = () => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user_1';
};

// Get all stories from localStorage
const getAllStoriesFromStorage = () => {
  const stories = localStorage.getItem(STORAGE_KEYS.STORIES);
  return stories ? JSON.parse(stories) : mockTravelStories;
};

// Save stories to localStorage
const saveStoriesToStorage = (stories) => {
  localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
};

// Get current user from localStorage
const getCurrentUserFromStorage = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : getDefaultMockUser();
};

// Save user to localStorage
const saveUserToStorage = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

// Simulate API delay
const simulateDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock API responses
export const mockApiService = {
  // Authentication endpoints
  async login(credentials) {
    await simulateDelay();
    
    // Simple mock authentication - any email/password combination works
    if (credentials.email && credentials.password) {
      const token = `mock_token_${Date.now()}`;
      const user = getDefaultMockUser();
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user._id);
      
      return {
        data: {
          accessToken: token,
          user: user
        }
      };
    }
    
    throw new Error('Invalid credentials');
  },

  async signup(userData) {
    await simulateDelay();
    
    // Create new user with provided data
    const newUser = {
      ...getDefaultMockUser(),
      _id: `user_${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      joinedAt: new Date().toISOString()
    };
    
    const token = `mock_token_${Date.now()}`;
    
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser._id);
    
    return {
      data: {
        accessToken: token,
        user: newUser
      }
    };
  },

  async sendSignupOtp(userData) {
    await simulateDelay(300);
    return { data: { message: 'OTP sent successfully' } };
  },

  async verifySignupOtp(data) {
    await simulateDelay();
    return this.signup({ fullName: data.fullName, email: data.email });
  },

  async sendLoginOtp(data) {
    await simulateDelay(300);
    return { data: { message: 'Login OTP sent successfully' } };
  },

  async verifyLoginOtp(data) {
    await simulateDelay();
    return this.login({ email: data.email, password: 'mock_password' });
  },

  async resendOtp(data) {
    await simulateDelay(300);
    return { data: { message: 'OTP resent successfully' } };
  },

  async forgotPassword(data) {
    await simulateDelay();
    return { data: { message: 'Password reset email sent' } };
  },

  async resetPassword(data) {
    await simulateDelay();
    return { data: { message: 'Password reset successfully' } };
  },

  async changePassword(data) {
    await simulateDelay();
    return { data: { message: 'Password changed successfully' } };
  },

  // User endpoints
  async getUser() {
    await simulateDelay(200);
    const user = getCurrentUserFromStorage();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      data: {
        user: user
      }
    };
  },

  async getProfile() {
    await simulateDelay(300);
    const user = getCurrentUserFromStorage();
    const stories = getAllStoriesFromStorage();
    const userStories = stories.filter(story => story.userId === getCurrentUserId());
    
    const stats = {
      stories: userStories.length,
      locations: [...new Set(userStories.map(story => story.location))].length,
      favorites: userStories.filter(story => story.isFavourite).length
    };
    
    return {
      data: {
        user: user,
        stats: stats
      }
    };
  },

  async updateProfile(formData) {
    await simulateDelay();
    const currentUser = getCurrentUserFromStorage();
    
    // Parse form data or use direct object
    const updates = formData instanceof FormData ? {
      fullName: formData.get('fullName'),
      bio: formData.get('bio'),
      location: formData.get('location'),
      phone: formData.get('phone'),
      website: formData.get('website'),
      socialLinks: JSON.parse(formData.get('socialLinks') || '{}'),
      preferences: JSON.parse(formData.get('preferences') || '{}')
    } : formData;
    
    const updatedUser = { ...currentUser, ...updates };
    saveUserToStorage(updatedUser);
    
    return {
      data: {
        user: updatedUser,
        message: 'Profile updated successfully'
      }
    };
  },

  async updateProfileImage(formData) {
    await simulateDelay(800);
    const currentUser = getCurrentUserFromStorage();
    
    // Mock image upload - return a random placeholder image
    const randomImageId = Math.floor(Math.random() * 1000);
    const newImageUrl = `https://images.unsplash.com/photo-${1500000000000 + randomImageId}?w=150&h=150&fit=crop&crop=face`;
    
    const updatedUser = { 
      ...currentUser, 
      profileImage: newImageUrl 
    };
    
    saveUserToStorage(updatedUser);
    
    return {
      data: {
        imageUrl: newImageUrl,
        message: 'Profile image updated successfully'
      }
    };
  },

  // Travel stories endpoints
  async getAllStories() {
    await simulateDelay(400);
    const stories = getAllStoriesFromStorage();
    const userStories = stories.filter(story => story.userId === getCurrentUserId());
    
    return {
      data: {
        stories: userStories.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
      }
    };
  },

  async addTravelStory(storyData) {
    await simulateDelay(600);
    const stories = getAllStoriesFromStorage();
    const currentUser = getCurrentUserFromStorage();
    
    const newStory = {
      _id: generateMockStoryId(),
      ...storyData,
      userId: getCurrentUserId(),
      userName: currentUser.fullName,
      userProfileImage: currentUser.profileImage,
      createdOn: new Date().toISOString(),
      isFavourite: false,
      isShowOnProfile: true,
      // Add mock coordinates if location is provided
      coordinates: {
        lat: 40.7128 + (Math.random() - 0.5) * 20,
        lng: -74.0060 + (Math.random() - 0.5) * 40
      }
    };
    
    stories.push(newStory);
    saveStoriesToStorage(stories);
    
    return {
      data: {
        story: newStory,
        message: 'Travel story added successfully'
      }
    };
  },

  async editStory(storyId, storyData) {
    await simulateDelay(500);
    const stories = getAllStoriesFromStorage();
    const storyIndex = stories.findIndex(story => story._id === storyId);
    
    if (storyIndex === -1) {
      throw new Error('Story not found');
    }
    
    const updatedStory = {
      ...stories[storyIndex],
      ...storyData,
      updatedOn: new Date().toISOString()
    };
    
    stories[storyIndex] = updatedStory;
    saveStoriesToStorage(stories);
    
    return {
      data: {
        story: updatedStory,
        message: 'Story updated successfully'
      }
    };
  },

  async deleteStory(storyId) {
    await simulateDelay(300);
    const stories = getAllStoriesFromStorage();
    const filteredStories = stories.filter(story => story._id !== storyId);
    
    saveStoriesToStorage(filteredStories);
    
    return {
      data: {
        message: 'Story deleted successfully'
      }
    };
  },

  async updateIsFavourite(storyId, data) {
    await simulateDelay(200);
    const stories = getAllStoriesFromStorage();
    const storyIndex = stories.findIndex(story => story._id === storyId);
    
    if (storyIndex !== -1) {
      stories[storyIndex].isFavourite = data.isFavourite;
      saveStoriesToStorage(stories);
    }
    
    return {
      data: {
        story: stories[storyIndex],
        message: 'Favourite status updated'
      }
    };
  },

  async toggleShowOnProfile(storyId, data) {
    await simulateDelay(200);
    const stories = getAllStoriesFromStorage();
    const storyIndex = stories.findIndex(story => story._id === storyId);
    
    if (storyIndex !== -1) {
      stories[storyIndex].isShowOnProfile = data.isShowOnProfile;
      saveStoriesToStorage(stories);
    }
    
    return {
      data: {
        story: stories[storyIndex],
        message: 'Profile visibility updated'
      }
    };
  },

  // Search endpoints
  async search(query) {
    await simulateDelay(300);
    const stories = getAllStoriesFromStorage();
    const userStories = stories.filter(story => story.userId === getCurrentUserId());
    const results = getMockSearchResults(query).filter(story => story.userId === getCurrentUserId());
    
    return {
      data: {
        stories: results
      }
    };
  },

  async advancedSearch(searchData) {
    await simulateDelay(400);
    const stories = getAllStoriesFromStorage();
    let results = stories.filter(story => story.userId === getCurrentUserId());
    
    // Apply filters based on search data
    if (searchData.query) {
      const query = searchData.query.toLowerCase();
      results = results.filter(story => 
        story.title.toLowerCase().includes(query) ||
        story.story.toLowerCase().includes(query) ||
        story.location.toLowerCase().includes(query)
      );
    }
    
    if (searchData.dateFrom) {
      results = results.filter(story => 
        new Date(story.visitedDate) >= new Date(searchData.dateFrom)
      );
    }
    
    if (searchData.dateTo) {
      results = results.filter(story => 
        new Date(story.visitedDate) <= new Date(searchData.dateTo)
      );
    }
    
    return {
      data: {
        stories: results
      }
    };
  },

  // Image upload endpoint
  async imageUpload(formData) {
    await simulateDelay(1000);
    
    // Return a random unsplash image URL
    const randomImageId = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://images.unsplash.com/photo-${1500000000000 + randomImageId}?w=800&h=600&fit=crop`;
    
    return {
      data: {
        imageUrl: imageUrl,
        message: 'Image uploaded successfully'
      }
    };
  },

  async deleteImage(params) {
    await simulateDelay(200);
    return {
      data: {
        message: 'Image deleted successfully'
      }
    };
  },

  // Admin endpoints for contributors management
  async getAdminContributors(params) {
    await simulateDelay(500);
    
    // Mock contributors data
    const mockContributors = [
      {
        _id: 'contrib_1',
        fullName: 'John Doe',
        githubUsername: 'johndoe',
        email: 'john@example.com',
        contributionType: 'Bug Fix',
        contributionDescription: 'Fixed authentication issue in login flow',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        prLinks: ['https://github.com/Sahilll94/Travel-Book/pull/123'],
        country: 'United States'
      },
      {
        _id: 'contrib_2', 
        fullName: 'Jane Smith',
        githubUsername: 'janesmith',
        email: 'jane@example.com',
        contributionType: 'Feature',
        contributionDescription: 'Added dark mode support to the application',
        status: 'approved',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        prLinks: ['https://github.com/Sahilll94/Travel-Book/pull/120'],
        country: 'Canada',
        adminNotes: 'Great work on the dark mode implementation!'
      }
    ];

    const status = params?.status || 'all';
    const filteredContributors = status === 'all' 
      ? mockContributors 
      : mockContributors.filter(c => c.status === status);

    return {
      data: {
        success: true,
        contributors: filteredContributors,
        total: filteredContributors.length
      }
    };
  },

  async updateContributorStatus(contributorId, data) {
    await simulateDelay(300);
    
    return {
      data: {
        success: true,
        message: `Contributor ${data.status} successfully`,
        contributor: {
          _id: contributorId,
          status: data.status,
          adminNotes: data.adminNotes,
          updatedAt: new Date().toISOString()
        }
      }
    };
  }
};

// Initialize mock data when module is imported
initializeMockData();

export default mockApiService;