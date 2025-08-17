# API Integration Guide - LokSetu App

## Overview
All backend API endpoints have been integrated into the React Native app with proper authentication, error handling, and role-based access control.

## Integrated Endpoints

### 🔐 Authentication Endpoints
- **POST /auth/login** - User authentication with JWT token
- **POST /auth/forgot-password** - Send password reset email
- **POST /auth/reset-password** - Reset password using token
- **GET /** - Health check endpoint

### 👥 User Management (Admin Only)
- **GET /users/** - List all users
- **POST /users/** - Create new user
- **PATCH /users/{user_id}** - Update user details
- **DELETE /users/{user_id}** - Delete user

### 🗳️ Voter Management (All Authenticated Users)
- **GET /voters/** - List voters (filtered by role/scope)
- **GET /voters/{epic_id}** - Get specific voter by EPIC ID
- **PATCH /voters/{epic_id}** - Update voter information

### 🌍 General Information (Admin Only)
- **GET /general/states** - Get Indian states from ECI API
- **GET /general/districts** - Get districts for specific state
- **GET /general/assembly** - Get assembly constituencies
- **GET /general/booths** - Get polling booths for assembly

## Usage Examples

### Using the API Hook
```javascript
import { useApiService } from '../hooks/useApiService';

const MyComponent = () => {
  const { 
    loading, 
    error, 
    getVoters, 
    createUser, 
    getStates 
  } = useApiService();

  const handleGetVoters = async () => {
    try {
      const voters = await getVoters({ limit: 10 });
      console.log('Voters:', voters);
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  return (
    // Your component JSX
  );
};
```

### Direct API Service Usage
```javascript
import { apiService } from '../services/api/index.complete';

// Authentication
const loginResult = await apiService.auth.login({ username, password });

// User management (Admin only)
const users = await apiService.users.getUsers(token);
const newUser = await apiService.users.createUser(userData, token);

// Voter management
const voters = await apiService.voters.getVoters(token, filters);
const voter = await apiService.voters.getVoterByEpic(epicId, token);

// General information (Admin only)
const states = await apiService.general.getStates(token);
const districts = await apiService.general.getDistricts(stateId, token);
```

## Files Created/Updated

### New API Service Files
- `src/services/api/auth.service.complete.js` - Authentication endpoints
- `src/services/api/user.service.complete.js` - User management endpoints
- `src/services/api/voter.service.complete.js` - Voter management endpoints
- `src/services/api/general.service.js` - General information endpoints
- `src/services/api/index.complete.js` - Centralized API exports

### New Utility Files
- `src/hooks/useApiService.js` - React hook for API operations
- `src/utils/apiHelpers.js` - API utility functions
- `src/components/ApiDemo.jsx` - Demo component for testing

### Updated Files
- `src/services/api/config.js` - Updated with all endpoint configurations

## Testing the Integration

1. **Import the ApiDemo component** in your screen:
```javascript
import ApiDemo from '../components/ApiDemo';
```

2. **Add it to your render method** to test all endpoints:
```javascript
<ApiDemo />
```

3. **Use the useApiService hook** in your components for production use.

## Security & Access Control

- **Authentication required** for all endpoints except auth endpoints
- **Role-based access**: Admin-only endpoints are restricted
- **JWT token** automatically included in requests
- **Error handling** for network issues and API errors
- **Loading states** managed automatically

## Environment Configuration

Update your `.env` file with the correct API base URL:
```
REACT_APP_API_BASE_URL = "https://voterlistmanagment.onrender.com"
```

The integration is now complete and ready for use throughout your app!