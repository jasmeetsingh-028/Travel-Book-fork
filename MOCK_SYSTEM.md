# 🎭 Mock Data System Documentation

## Overview

The Travel Book frontend now includes a comprehensive mock data system that allows contributors to test all application features without needing backend access. This system provides realistic data and API responses for a complete development experience.

## System Architecture

### Core Components

1. **Mock Data Layer** (`src/utils/mockData.js`)
   - Sample users, travel stories, and analytics data
   - Realistic content with proper relationships
   - Extensible structure for adding new data

2. **Mock API Service** (`src/utils/mockApiService.js`)
   - Simulates all backend API endpoints
   - Proper HTTP response structures
   - Realistic loading delays
   - Error handling scenarios

3. **Mock Firebase** (`src/utils/mockFirebase.js`)
   - Simulates Firebase authentication
   - Mock social login providers (Google, GitHub, Twitter)
   - Compatible with existing Firebase integration

4. **Smart Axios Interceptor** (`src/utils/axiosInstance.js`)
   - Automatically routes API calls to mock services
   - Seamless switching between real and mock APIs
   - Maintains existing API call patterns

### Environment Configuration

The system automatically detects when to use mock data based on:
- `VITE_USE_MOCK_DATA=true` environment variable
- Missing backend URL
- Development mode detection

## Features Covered

### ✅ Authentication System
- **Email/Password Login**: Any credentials work
- **Email/Password Signup**: Creates mock user accounts
- **OTP Verification**: Accepts any 6-digit code
- **Social Login**: Mock Google, GitHub, Twitter flows
- **Password Reset**: Complete flow simulation
- **Session Management**: Persistent login state

### ✅ Travel Story Management
- **CRUD Operations**: Create, read, update, delete stories
- **Image Upload**: Mock upload with placeholder images
- **Search & Filter**: Full-text search across all content
- **Date Filtering**: Filter stories by date ranges
- **Favorites**: Mark/unmark stories as favorites
- **Profile Visibility**: Toggle story visibility settings

### ✅ User Profile System
- **Profile Editing**: Update user information
- **Profile Image**: Mock image upload and update
- **Social Links**: Manage social media connections
- **Privacy Settings**: Configure visibility preferences
- **Analytics**: View travel statistics and patterns

### ✅ Data Persistence
- **Local Storage**: Maintains data between sessions
- **State Management**: Proper state updates and synchronization
- **Offline Support**: Works without internet connection

## Mock Data Structure

### Users
```javascript
{
  _id: "user_1",
  fullName: "Alex Johnson",
  email: "alex@travelbook.com",
  profileImage: "https://...",
  bio: "Travel enthusiast...",
  location: "San Francisco, CA",
  // ... additional fields
}
```

### Travel Stories
```javascript
{
  _id: "story_1",
  title: "Amazing Weekend in Paris",
  story: "Full story content...",
  location: "Paris, France",
  imageUrl: "https://...",
  visitedLocation: ["Eiffel Tower", "Louvre"],
  visitedDate: "2024-07-15T10:00:00Z",
  isFavourite: true,
  userId: "user_1",
  // ... additional fields
}
```

## API Endpoint Coverage

### Authentication Endpoints
- `POST /login` - User login
- `POST /send-signup-otp` - Send signup OTP
- `POST /verify-signup-otp` - Verify signup OTP
- `POST /send-login-otp` - Send login OTP
- `POST /verify-login-otp` - Verify login OTP
- `POST /resend-otp` - Resend OTP
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset confirmation
- `POST /change-password` - Change password

### User Management Endpoints
- `GET /get-user` - Get current user info
- `GET /profile` - Get user profile with stats
- `PUT /update-profile` - Update user profile
- `PUT /update-profile-image` - Update profile image

### Story Management Endpoints
- `GET /get-all-stories` - Get user's stories
- `POST /add-travel-story` - Create new story
- `PUT /edit-story/:id` - Update existing story
- `DELETE /delete-story/:id` - Delete story
- `PUT /update-is-favourite/:id` - Toggle favorite status
- `PUT /toggle-show-on-profile/:id` - Toggle profile visibility

### Search & Discovery Endpoints
- `GET /search` - Basic search
- `POST /advanced-search` - Advanced search with filters

### File Management Endpoints
- `POST /image-upload` - Upload images
- `DELETE /delete-image` - Delete images

## Development Workflow

### For Contributors

1. **Clone & Setup**:
   ```bash
   git clone https://github.com/Sahilll94/Travel-Book.git
   cd Travel-Book
   npm run setup:contributor
   ```

2. **Start Development**:
   ```bash
   npm run dev
   ```

3. **Test Features**:
   - Login with any email/password
   - Create, edit, delete travel stories
   - Test search and filters
   - Update profile information
   - Test responsive design

### For Maintainers

To switch between mock and real API:
```env
# Mock mode (for contributors)
VITE_USE_MOCK_DATA=true

# Real API mode (for production)
VITE_USE_MOCK_DATA=false
VITE_BACKEND_URL=https://your-backend-url.com
```

## Adding New Mock Data

### Adding New Stories
```javascript
// In mockData.js
export const mockTravelStories = [
  // ... existing stories
  {
    _id: "story_new",
    title: "New Adventure",
    // ... other fields
  }
];
```

### Adding New API Endpoints
```javascript
// In mockApiService.js
case endpoint === '/new-endpoint' && method === 'post':
  mockResponse = await mockApiService.newEndpointHandler(data);
  break;
```

### Extending User Data
```javascript
// In mockData.js
export const mockUsers = [
  {
    // ... existing fields
    newField: "new value",
    preferences: {
      // ... existing preferences
      newPreference: true
    }
  }
];
```

## Testing Scenarios

### Authentication Testing
- Test login with various email formats
- Test signup flow with OTP verification
- Test password reset functionality
- Test social login flows
- Test session persistence

### Story Management Testing
- Create stories with various content types
- Test image upload and replacement
- Test story editing and deletion
- Test search with different queries
- Test filtering by date ranges

### Profile Testing
- Update profile information
- Change profile images
- Test privacy settings
- Test social link management
- View analytics data

### Responsive Testing
- Test on mobile devices
- Test tablet layouts
- Test desktop responsiveness
- Test touch interactions
- Test keyboard navigation

## Performance Considerations

### Mock Data Loading
- Data loads instantly from localStorage
- Images use optimized Unsplash URLs
- API responses include realistic delays
- Memory usage is minimal

### Browser Compatibility
- Works in all modern browsers
- Uses localStorage for persistence
- Fallback for missing features
- Progressive enhancement approach

## Troubleshooting

### Common Issues

**Mock mode not working:**
- Check `VITE_USE_MOCK_DATA=true` in .env
- Restart development server
- Clear browser cache

**Data not persisting:**
- Check localStorage in browser
- Ensure browser allows localStorage
- Try in incognito mode to test

**Images not loading:**
- Check internet connection (images from Unsplash)
- Check browser network tab for errors
- Try refreshing the page

**Authentication loops:**
- Clear localStorage
- Check console for errors
- Restart development server

### Debug Mode

Enable console logging:
```javascript
// In constants.js
export const DEBUG_MOCK = true;
```

This will show all mock API calls in the console.

## Future Enhancements

### Planned Features
- **Advanced Analytics**: More detailed travel statistics
- **Collaborative Stories**: Mock multi-user scenarios
- **Geolocation**: Mock GPS and location services
- **Push Notifications**: Mock notification system
- **Offline Sync**: Enhanced offline capabilities

### Extension Points
- Custom mock data generators
- API response customization
- Error scenario simulation
- Performance testing data
- Accessibility testing scenarios

## Conclusion

The mock data system provides a complete, realistic development environment that enables contributors to work on all aspects of the Travel Book application without requiring backend access. This approach significantly lowers the barrier to entry for new contributors while maintaining the quality and functionality of the development experience.

The system is designed to be maintainable, extensible, and as close to the real application behavior as possible, ensuring that frontend development can proceed independently while maintaining confidence in the integration with the actual backend services.
