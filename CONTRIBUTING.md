# Contributing to Travel Book

Welcome to Travel Book! We're excited to have you contribute to our digital travel journal platform. This guide will help you get started with the development environment using our comprehensive mock data system.

## Quick Start Guide

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Git for version control

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sahilll94/Travel-Book.git
   cd Travel-Book
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`

## Mock Data Development Environment

Travel Book includes a complete mock data system that allows you to develop and test all features without requiring backend access or API credentials.

### Mock Mode Capabilities

When `VITE_USE_MOCK_DATA=true` is configured in your environment file, the following features are fully functional:

**Authentication System:**
- User registration and login with any valid credentials
- Email and password validation
- OTP verification workflow
- Social authentication (Google, GitHub, Twitter)
- Password reset functionality
- Session management

**Content Management:**
- Create, read, update, and delete travel stories
- Image upload and management
- Location tagging and search
- Story categorization and favoriting
- Profile management and customization

**Data Operations:**
- Full-text search across content
- Advanced filtering by date, location, and tags
- Sort and organize stories
- Analytics and statistics
- Export and sharing functionality

### Test Credentials

For testing authentication features, you can use any valid email format and password. The system accepts:
- **Email**: Any properly formatted email address
- **Password**: Any string meeting minimum requirements
- **OTP**: Any 6-digit numerical code

### Sample Data

The mock system includes:
- 6 realistic travel stories with rich content
- 2 complete user profiles
- Geographic data for multiple countries
- Analytics and statistics data
- High-quality placeholder images

## Development Guidelines

### Code Standards

**File Organization:**
- Follow the existing directory structure
- Place components in appropriate folders
- Use descriptive file and component names
- Include necessary imports and exports

**Styling Guidelines:**
- Use Tailwind CSS for styling
- Follow responsive design principles
- Ensure dark/light mode compatibility
- Test across different screen sizes

**Component Development:**
- Write reusable, modular components
- Include proper prop validation
- Implement error boundaries where appropriate
- Follow React best practices

### Testing Requirements

Before submitting your contribution, ensure you have tested:

1. **Authentication Flow:**
   - User registration and login
   - Social authentication options
   - Password reset functionality
   - Session persistence

2. **Core Features:**
   - Story creation, editing, and deletion
   - Image upload and management
   - Search and filtering
   - Profile management

3. **User Experience:**
   - Responsive design on mobile and desktop
   - Dark and light theme compatibility
   - Loading states and error handling
   - Navigation and accessibility

4. **Performance:**
   - Page load times
   - Smooth animations and transitions
   - Memory usage and optimization

### Adding New Features

**For UI Components:**
1. Components automatically receive mock data
2. Focus on user interface and experience
3. Ensure responsive design implementation
4. Test accessibility features

**For API Integration:**
1. Add new endpoints to `src/utils/mockApiService.js`
2. Update mock data in `src/utils/mockData.js` if needed
3. Ensure proper error handling
4. Maintain consistency with existing patterns

## Architecture Overview

### Mock System Structure

```
src/utils/
├── mockData.js          # Sample data definitions
├── mockApiService.js    # API endpoint simulation
├── mockFirebase.js      # Authentication simulation
├── axiosInstance.js     # Request routing logic
└── constants.js         # Configuration management
```

### Key Components

**mockData.js:** Contains all sample data including users, stories, and analytics information

**mockApiService.js:** Simulates backend API responses with proper HTTP status codes and realistic delays

**mockFirebase.js:** Provides mock authentication services compatible with Firebase SDK

**axiosInstance.js:** Intelligently routes requests between real and mock APIs based on configuration

## Environment Configuration

### Required Variables

Create a `.env` file with the following configuration:

```env
# Mock data mode (recommended for contributors)
VITE_USE_MOCK_DATA=true

# Backend URL (optional in mock mode)
VITE_BACKEND_URL=http://localhost:3000/

# Firebase configuration (optional - mock service used if not provided)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Google Maps API (optional - placeholder map used if not provided)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Clerk Authentication (optional - mock auth used if not provided)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

## Contribution Areas

### User Interface Improvements
- Responsive design enhancements
- Animation and transition improvements
- Accessibility feature implementation
- Theme and styling refinements

### Component Development
- Reusable component creation
- Story layout templates
- Navigation improvements
- Form and input enhancements

### Feature Implementation
- Dashboard widgets
- Analytics visualizations
- Search and filter improvements
- Export and sharing capabilities

### Performance Optimization
- Code splitting and lazy loading
- Bundle size optimization
- Loading state improvements
- Memory usage optimization

## Troubleshooting

### Common Issues and Solutions

**Mock mode not activating:**
- Verify `VITE_USE_MOCK_DATA=true` in `.env` file
- Restart development server after environment changes
- Check browser console for configuration errors

**Data persistence problems:**
- Mock data uses browser localStorage
- Clear browser storage if experiencing issues
- Check browser privacy settings

**Authentication issues:**
- Clear localStorage and refresh page
- Verify credentials meet minimum requirements
- Check browser console for authentication errors

**Image loading failures:**
- Ensure internet connection (images served from external CDN)
- Check browser network tab for failed requests
- Verify image URLs in mock data

### Getting Help

If you encounter issues not covered in this guide:

1. Check existing GitHub issues for similar problems
2. Review the main README.md for additional information
3. Create a new issue with the "help wanted" label
4. Join community discussions for broader questions

## Contribution Workflow

### Step-by-Step Process

1. **Fork the repository** to your GitHub account
2. **Create a feature branch** using descriptive naming:
   ```bash
   git checkout -b feature/description-of-feature
   ```
3. **Make your changes** following the guidelines above
4. **Test thoroughly** using the mock data system
5. **Commit your changes** with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: detailed description"
   ```
6. **Push to your fork:**
   ```bash
   git push origin feature/description-of-feature
   ```
7. **Submit a pull request** with a detailed description
8. **Apply for contributor recognition** once your PR is merged (see below)

### Getting Recognition for Your Contributions

Travel Book features a comprehensive contributors recognition system to celebrate community members who make meaningful contributions to the project.

#### How to Apply for Recognition

Once your contributions have been merged into the main repository:

1. **Visit the Contributors Page**: Navigate to [Contributors](https://travelbook.sahilfolio.live/contributors) to view current contributors and learn about the application process
2. **Complete the Application**: Fill out the form at [Contributors](https://travelbook.sahilfolio.live/contributors) with details about your contributions
3. **Provide Documentation**: Include links to your merged pull requests, issues you've worked on, or documentation you've created
4. **Wait for Review**: Our team reviews applications within 3-5 business days
5. **Get Featured**: Approved contributors are showcased on the main contributors page

#### Application Requirements

To be considered for contributor recognition, ensure that:
- Your contribution has been merged or accepted into the project
- You provide accurate information about your work
- You include relevant links to pull requests, issues, or documentation
- You use a professional profile photo and accurate contact information

#### Types of Contributions Recognized

We recognize various types of contributions including:
- **Code Contributions**: Features, bug fixes, performance improvements, refactoring, testing
- **Documentation**: README updates, API docs, tutorials, code comments, user guides  
- **Design & UX**: UI/UX improvements, design assets, accessibility enhancements
- **Community Support**: Issue reporting, bug triaging, user support, feature suggestions

#### Review Process

All contributor applications undergo a verification process:
1. Your submission will be reviewed by our team within 3-5 business days
2. We verify your contributions against project history and documentation
3. You will receive an email notification with the review outcome
4. Approved submissions will appear on the contributors page within 24 hours

### Pull Request Guidelines

**Title:** Use a clear, descriptive title that summarizes the change

**Description:** Include:
- What changes were made
- Why the changes were necessary
- How to test the changes
- Screenshots for UI changes
- Any breaking changes or dependencies

**Review Process:**
- Ensure all tests pass
- Address reviewer feedback promptly
- Keep the pull request focused on a single feature or fix
- Update documentation if necessary

## Performance Considerations

The mock data system is optimized for development:
- Instant data loading for faster development cycles
- Realistic API response delays for testing
- Efficient localStorage usage for data persistence
- Optimized placeholder images for consistent performance

## Security and Best Practices

- Never commit real API keys or credentials
- Use environment variables for all configuration
- Follow React security best practices
- Implement proper error boundaries
- Validate user inputs appropriately

## Future Contributions

We welcome contributions in these areas:
- User interface and experience improvements
- Component library expansion
- Performance optimizations
- Accessibility enhancements
- Testing and documentation

Thank you for contributing to Travel Book! Your efforts help make travel documentation more accessible and enjoyable for users worldwide.
