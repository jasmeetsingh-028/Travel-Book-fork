// Mock data for Travel Book application
// This file provides sample data for testing and development

// Mock user data
export const mockUsers = [
  {
    _id: "user_1",
    fullName: "Sahil",
    email: "contact@sahilfolio.live",
    profileImage: "https://github.com/Sahilll94.png",
    bio: "Travel enthusiast exploring the world one adventure at a time. Love capturing moments and sharing stories.",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    website: "https://alexjohnson.travel",
    socialLinks: {
      facebook: "https://facebook.com/alexjohnson",
      twitter: "https://twitter.com/alexjohnson", 
      instagram: "https://instagram.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson"
    },
    preferences: {
      notificationsEnabled: true,
      privacySettings: {
        showEmail: false,
        showPhone: false,
        profileVisibility: "public"
      },
      theme: "system"
    },
    joinedAt: "2024-01-15T08:30:00Z"
  },
  {
    _id: "user_2", 
    fullName: "Sarah Miller",
    email: "sarah@example.com",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Digital nomad and photography lover",
    location: "New York, NY",
    preferences: {
      notificationsEnabled: true,
      privacySettings: {
        showEmail: true,
        showPhone: false,
        profileVisibility: "public"
      }
    }
  }
];

// Mock travel stories data
export const mockTravelStories = [
  {
    _id: "story_1",
    title: "Amazing Weekend in Paris",
    story: "Just returned from an incredible weekend in the City of Light! Started with a sunrise visit to the Eiffel Tower, followed by croissants at a charming café in Montmartre. The Louvre was overwhelming but amazing - spent hours getting lost in art. Evening Seine cruise was magical with all the monuments lit up. Already planning my next visit!",
    location: "Paris, France",
    imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop",
    visitedLocation: ["Eiffel Tower", "Louvre Museum", "Notre Dame", "Montmartre"],
    visitedDate: "2024-07-15T10:00:00Z",
    isFavourite: true,
    userId: "user_1",
    userName: "Alex Johnson",
    userProfileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdOn: "2024-07-16T14:30:00Z",
    isShowOnProfile: true,
    coordinates: {
      lat: 48.8566,
      lng: 2.3522
    }
  },
  {
    _id: "story_2",
    title: "Sunrise Hike in the Rocky Mountains",
    story: "Woke up at 4 AM for this incredible sunrise hike in Rocky Mountain National Park. The trail was challenging but the views were absolutely worth it. Reached the summit just as the sun painted the mountains golden. Met some friendly fellow hikers and even spotted a family of deer on the way down. Nature therapy at its finest!",
    location: "Rocky Mountain National Park, Colorado",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    visitedLocation: ["Bear Lake", "Dream Lake", "Emerald Lake", "Trail Ridge Road"],
    visitedDate: "2024-07-10T06:00:00Z",
    isFavourite: false,
    userId: "user_1",
    userName: "Alex Johnson", 
    userProfileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdOn: "2024-07-11T18:45:00Z",
    isShowOnProfile: true,
    coordinates: {
      lat: 40.3428,
      lng: -105.6836
    }
  },
  {
    _id: "story_3",
    title: "Beach Paradise in Maldives",
    story: "Pure paradise found! Crystal clear waters, white sand beaches, and the most beautiful sunsets I've ever seen. Stayed in an overwater bungalow which was a dream come true. Snorkeling with tropical fish and manta rays was unforgettable. The local culture and cuisine added so much richness to the experience. This trip renewed my soul!",
    location: "Malé, Maldives",
    imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=600&fit=crop",
    visitedLocation: ["Male Beach", "Banana Reef", "HP Reef", "Manta Point"],
    visitedDate: "2024-06-20T12:00:00Z",
    isFavourite: true,
    userId: "user_1",
    userName: "Alex Johnson",
    userProfileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", 
    createdOn: "2024-06-25T20:15:00Z",
    isShowOnProfile: true,
    coordinates: {
      lat: 4.1755,
      lng: 73.5093
    }
  },
  {
    _id: "story_4",
    title: "Cultural Immersion in Tokyo",
    story: "Tokyo absolutely blew my mind! The perfect blend of ultra-modern and traditional. Started the day at the peaceful Senso-ji Temple, then got lost in the neon wonderland of Shibuya. The food scene is incredible - from street food to Michelin stars. Everyone was so kind and helpful despite the language barrier. Can't wait to explore more of Japan!",
    location: "Tokyo, Japan",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
    visitedLocation: ["Senso-ji Temple", "Shibuya Crossing", "Tokyo Tower", "Meiji Shrine"],
    visitedDate: "2024-05-15T09:00:00Z",
    isFavourite: false,
    userId: "user_2",
    userName: "Sarah Miller",
    userProfileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    createdOn: "2024-05-18T16:20:00Z",
    isShowOnProfile: false,
    coordinates: {
      lat: 35.6762,
      lng: 139.6503
    }
  },
  {
    _id: "story_5", 
    title: "Northern Lights Adventure in Iceland",
    story: "Bucket list experience achieved! Saw the Northern Lights dancing across the Icelandic sky in the most spectacular display of natural beauty. The Blue Lagoon was incredibly relaxing after a day of exploring ice caves and waterfalls. The landscape is otherworldly - like being on another planet. Small group tour was perfect for this magical experience.",
    location: "Reykjavik, Iceland",
    imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop",
    visitedLocation: ["Blue Lagoon", "Gullfoss Waterfall", "Geysir", "Northern Lights"],
    visitedDate: "2024-03-10T21:00:00Z",
    isFavourite: true,
    userId: "user_1",
    userName: "Alex Johnson",
    userProfileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdOn: "2024-03-12T10:30:00Z",
    isShowOnProfile: true,
    coordinates: {
      lat: 64.1466,
      lng: -21.9426
    }
  },
  {
    _id: "story_6",
    title: "Safari Adventure in Kenya",
    story: "Wildlife photography dream come true! Witnessed the Great Migration in Maasai Mara - thousands of wildebeest crossing the river was absolutely breathtaking. Saw the Big Five including a pride of lions with cubs. The local Maasai community welcomed us with such warmth and shared their incredible culture. This trip changed my perspective on conservation and wildlife.",
    location: "Maasai Mara, Kenya", 
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop",
    visitedLocation: ["Maasai Mara Reserve", "Mara River", "Ol Kinyei Conservancy"],
    visitedDate: "2024-02-05T07:00:00Z",
    isFavourite: false,
    userId: "user_2",
    userName: "Sarah Miller",
    userProfileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    createdOn: "2024-02-08T19:45:00Z",
    isShowOnProfile: true,
    coordinates: {
      lat: -1.5010,
      lng: 35.1438
    }
  }
];

// Mock authentication responses
export const mockAuthResponse = {
  login: {
    accessToken: "mock_access_token_12345",
    user: mockUsers[0]
  },
  signup: {
    accessToken: "mock_access_token_12345", 
    user: mockUsers[0]
  }
};

// Mock profile statistics
export const mockProfileStats = {
  stories: mockTravelStories.filter(story => story.userId === "user_1").length,
  locations: [...new Set(mockTravelStories.filter(story => story.userId === "user_1").map(story => story.location))].length,
  favorites: mockTravelStories.filter(story => story.userId === "user_1" && story.isFavourite).length
};

// Mock analytics data
export const mockAnalytics = {
  totalStories: mockTravelStories.length,
  totalLocations: [...new Set(mockTravelStories.map(story => story.location))].length,
  favoriteStories: mockTravelStories.filter(story => story.isFavourite).length,
  monthlyStats: [
    { month: 'Jan', stories: 0 },
    { month: 'Feb', stories: 2 },
    { month: 'Mar', stories: 1 },
    { month: 'Apr', stories: 0 },
    { month: 'May', stories: 1 },
    { month: 'Jun', stories: 1 },
    { month: 'Jul', stories: 2 }
  ],
  popularLocations: [
    { location: 'Paris, France', count: 1 },
    { location: 'Tokyo, Japan', count: 1 },
    { location: 'Maldives', count: 1 },
    { location: 'Iceland', count: 1 }
  ]
};

// Default mock user for new sessions
export const getDefaultMockUser = () => mockUsers[0];

// Get mock stories for a specific user
export const getMockStoriesForUser = (userId = "user_1") => {
  return mockTravelStories.filter(story => story.userId === userId);
};

// Generate a new mock story ID
export const generateMockStoryId = () => {
  return `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get mock search results
export const getMockSearchResults = (query) => {
  if (!query) return mockTravelStories;
  
  const lowerQuery = query.toLowerCase();
  return mockTravelStories.filter(story => 
    story.title.toLowerCase().includes(lowerQuery) ||
    story.story.toLowerCase().includes(lowerQuery) ||
    story.location.toLowerCase().includes(lowerQuery) ||
    story.visitedLocation.some(loc => loc.toLowerCase().includes(lowerQuery))
  );
};

// Mock image upload response
export const mockImageUploadResponse = {
  imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
};