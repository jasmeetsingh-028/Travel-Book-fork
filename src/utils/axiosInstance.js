import axios from "axios";
import { BASE_URL, IS_MOCK_MODE } from "./constants";
import mockApiService from "./mockApiService";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Mock API interceptor - intercept requests and return mock responses when in mock mode
axiosInstance.interceptors.request.use(
    async (config) => {
        // Only use mock data if IS_MOCK_MODE is true
        if (!IS_MOCK_MODE) {
            return config;
        }

        // Extract the endpoint and method
        const endpoint = config.url;
        const method = config.method.toLowerCase();
        const data = config.data;
        const params = config.params;

        console.log(`🎭 Mock API: ${method.toUpperCase()} ${endpoint}`);

        try {
            let mockResponse;

            // Route to appropriate mock service method
            switch (true) {
                // Authentication endpoints
                case endpoint === '/login' && method === 'post':
                    mockResponse = await mockApiService.login(data);
                    break;
                case endpoint === '/send-signup-otp' && method === 'post':
                    mockResponse = await mockApiService.sendSignupOtp(data);
                    break;
                case endpoint === '/verify-signup-otp' && method === 'post':
                    mockResponse = await mockApiService.verifySignupOtp(data);
                    break;
                case endpoint === '/send-login-otp' && method === 'post':
                    mockResponse = await mockApiService.sendLoginOtp(data);
                    break;
                case endpoint === '/verify-login-otp' && method === 'post':
                    mockResponse = await mockApiService.verifyLoginOtp(data);
                    break;
                case endpoint === '/resend-otp' && method === 'post':
                    mockResponse = await mockApiService.resendOtp(data);
                    break;
                case endpoint === '/forgot-password' && method === 'post':
                    mockResponse = await mockApiService.forgotPassword(data);
                    break;
                case endpoint === '/reset-password' && method === 'post':
                    mockResponse = await mockApiService.resetPassword(data);
                    break;
                case endpoint === '/change-password' && method === 'post':
                    mockResponse = await mockApiService.changePassword(data);
                    break;

                // User endpoints
                case endpoint === '/get-user' && method === 'get':
                    mockResponse = await mockApiService.getUser();
                    break;
                case endpoint === '/profile' && method === 'get':
                    mockResponse = await mockApiService.getProfile();
                    break;
                case endpoint === '/update-profile' && method === 'put':
                    mockResponse = await mockApiService.updateProfile(data);
                    break;
                case endpoint === '/update-profile-image' && method === 'put':
                    mockResponse = await mockApiService.updateProfileImage(data);
                    break;

                // Story endpoints
                case endpoint === '/get-all-stories' && method === 'get':
                    mockResponse = await mockApiService.getAllStories();
                    break;
                case endpoint === '/add-travel-story' && method === 'post':
                    mockResponse = await mockApiService.addTravelStory(data);
                    break;
                case endpoint.startsWith('/edit-story/') && method === 'put':
                    const storyId = endpoint.split('/')[2];
                    mockResponse = await mockApiService.editStory(storyId, data);
                    break;
                case endpoint.startsWith('/delete-story/') && method === 'delete':
                    const deleteStoryId = endpoint.split('/')[2];
                    mockResponse = await mockApiService.deleteStory(deleteStoryId);
                    break;
                case endpoint.startsWith('/update-is-favourite/') && method === 'put':
                    const favStoryId = endpoint.split('/')[2];
                    mockResponse = await mockApiService.updateIsFavourite(favStoryId, data);
                    break;
                case endpoint.startsWith('/toggle-show-on-profile/') && method === 'put':
                    const profileStoryId = endpoint.split('/')[2];
                    mockResponse = await mockApiService.toggleShowOnProfile(profileStoryId, data);
                    break;

                // Search endpoints
                case endpoint === '/search' && method === 'get':
                    mockResponse = await mockApiService.search(params.query);
                    break;
                case endpoint === '/advanced-search' && method === 'post':
                    mockResponse = await mockApiService.advancedSearch(data);
                    break;

                // Image endpoints
                case endpoint === '/image-upload' && method === 'post':
                    mockResponse = await mockApiService.imageUpload(data);
                    break;
                case endpoint === '/delete-image' && method === 'delete':
                    mockResponse = await mockApiService.deleteImage(params);
                    break;

                // Admin endpoints - only use mock in development
                case endpoint.startsWith('/admin/contributors') && method === 'get':
                    mockResponse = await mockApiService.getAdminContributors(params);
                    break;
                case endpoint.includes('/contributors/') && endpoint.includes('/status') && method === 'put':
                    const contributorId = endpoint.split('/')[2];
                    mockResponse = await mockApiService.updateContributorStatus(contributorId, data);
                    break;

                default:
                    console.warn(`🎭 Mock API: No mock handler for ${method.toUpperCase()} ${endpoint}`);
                    // If no mock handler found, proceed with real request
                    return config;
            }

            // Create a mock axios response object
            const mockAxiosResponse = {
                data: mockResponse.data,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: config,
                request: {}
            };

            // Throw a custom error to bypass the actual HTTP request
            const mockError = new Error('MOCK_RESPONSE');
            mockError.response = mockAxiosResponse;
            mockError.mockResponse = mockAxiosResponse;
            throw mockError;

        } catch (error) {
            if (error.message === 'MOCK_RESPONSE') {
                throw error;
            }
            console.error('🎭 Mock API Error:', error);
            // If mock fails, proceed with real request
            return config;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle mock responses
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle mock responses
        if (error.mockResponse) {
            return Promise.resolve(error.mockResponse);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;