# API Structure Guide

## Overview
This document explains the consolidated API structure for LokSetu application. The API layer has been optimized for maintainability, consistency, and ease of use.

## File Structure

```
src/services/api/
├── index.js              # Main exports - import everything from here
├── client.js             # HTTP client with unified methods
├── config.js             # API configuration, endpoints, and constants
├── errors.js             # Error handling utilities
├── auth.service.js       # Authentication operations
├── user.service.js       # User management operations
├── voter.service.js      # Voter data operations
├── booth.service.js      # Booth and assignment operations
└── general.service.js    # General data (states, districts, etc.)
```

## Core Components

### 1. Configuration (`config.js`)

**API_CONFIG**
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.5:8000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};
```

**USER_ROLES**
```javascript
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  PARTY_ADMIN: 'party_admin',
  ADMIN: 'admin',
  BOOTH_BOY: 'booth_boy',
  CANDIDATE: 'candidate',
  BLOCK_PRABHARI: 'block_prabhari',
  PANCHAYAT_PRABHARI: 'panchayat_prabhari',
  VIDHANSABHA_PRABHARI: 'vidhansabha_prabhari'
};
```

**ENDPOINTS**
- Centralized endpoint definitions
- Dynamic endpoint functions for parameters
- Organized by feature (AUTH, USERS, VOTERS, etc.)

### 2. HTTP Client (`client.js`)

**Features:**
- Unified HTTP methods (GET, POST, PATCH, DELETE)
- Automatic token handling
- Form data support for specific endpoints
- Consistent error handling
- Request/response logging

**Methods:**
```javascript
apiClient.get(endpoint, token, params)
apiClient.post(endpoint, data, token)
apiClient.patch(endpoint, data, token)
apiClient.delete(endpoint, data, token)
```

### 3. Error Handling (`errors.js`)

**ApiError Class:**
```javascript
throw new ApiError(message, status, details)
```

**Error Types:**
- NETWORK_ERROR
- AUTHENTICATION_ERROR
- AUTHORIZATION_ERROR
- VALIDATION_ERROR
- SERVER_ERROR
- NOT_FOUND

**Utility Functions:**
```javascript
handleApiError(error) // Returns formatted error object
getErrorType(status) // Maps HTTP status to error type
```

## Service Modules

### Authentication Service (`auth.service.js`)
```javascript
authService.login(credentials)
authService.forgotPassword(username)
authService.resetPassword(token, newPassword)
```

### User Service (`user.service.js`)
```javascript
userService.getUsers(token, filters)
userService.createUser(userData, token)
userService.updateUser(userId, userData, token)
userService.deleteUser(userId, token)
userService.getAssignedConstituencies(token)
userService.getAssignedBooths(token)
```

### Voter Service (`voter.service.js`)
```javascript
voterService.getList(token, filters)
voterService.getByEpicId(epicId, token)
voterService.updateVoter(epicId, voterData, token)
```

### Booth Service (`booth.service.js`)
```javascript
boothService.getBooths(token, filters)
boothService.getBoothBoys(token)
boothService.assignBooths(token, boothBoyId, boothIds)
boothService.getBoothAssignments(token, filters)
boothService.createBoothAssignment(token, assignmentData)
boothService.updateBoothAssignment(token, assignmentId, assignmentData)
boothService.deleteBoothAssignment(token, assignmentId)
```

### General Service (`general.service.js`)
```javascript
generalService.getStates(token)
generalService.getDistricts(stateId, token)
generalService.getAssemblyConstituencies(stateId, token)
generalService.getPollingBooths(assemblyId, token)
```

## Usage Examples

### Basic Import
```javascript
import { 
  authService, 
  userService, 
  apiClient, 
  USER_ROLES,
  handleApiError 
} from '../services/api';
```

### Authentication
```javascript
try {
  const response = await authService.login({
    username: 'admin',
    password: 'password',
    selectedRole: USER_ROLES.ADMIN
  });
  console.log('Login successful:', response);
} catch (error) {
  const errorInfo = handleApiError(error);
  console.error('Login failed:', errorInfo.message);
}
```

### User Management
```javascript
// Get all users
const users = await userService.getUsers(token);

// Create new user
const newUser = await userService.createUser({
  username: 'newuser',
  password: 'password123',
  role: USER_ROLES.BOOTH_BOY,
  full_name: 'John Doe',
  email: 'john@example.com'
}, token);

// Update user
const updatedUser = await userService.updateUser(userId, {
  full_name: 'Updated Name'
}, token);
```

### Voter Operations
```javascript
// Get voters with filters
const voters = await voterService.getList(token, {
  booth_ids: '1,2,3',
  constituency_id: '123'
});

// Update voter
const updatedVoter = await voterService.updateVoter(epicId, {
  name: 'Updated Name',
  address: 'New Address'
}, token);
```

### Error Handling
```javascript
try {
  const result = await userService.createUser(userData, token);
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        // Handle authentication error
        break;
      case 403:
        // Handle authorization error
        break;
      case 400:
        // Handle validation error
        break;
      default:
        // Handle other errors
    }
  }
}
```

## Best Practices

### 1. Always Use Services
```javascript
// ✅ Good
import { userService } from '../services/api';
const users = await userService.getUsers(token);

// ❌ Avoid
import { apiClient } from '../services/api';
const users = await apiClient.get('/users/', token);
```

### 2. Handle Errors Properly
```javascript
// ✅ Good
try {
  const result = await authService.login(credentials);
} catch (error) {
  const errorInfo = handleApiError(error);
  setError(errorInfo.message);
}

// ❌ Avoid
const result = await authService.login(credentials);
```

### 3. Use Constants
```javascript
// ✅ Good
import { USER_ROLES } from '../services/api';
if (user.role === USER_ROLES.ADMIN) { ... }

// ❌ Avoid
if (user.role === 'admin') { ... }
```

### 4. Pass Filters Consistently
```javascript
// ✅ Good
const voters = await voterService.getList(token, { 
  constituency_id: '123',
  booth_ids: '1,2,3' 
});

// ✅ Also Good
const booths = await boothService.getBooths(token, {
  assembly_id: '456'
});
```

## Migration Guide

### From Old Structure
If you're migrating from the old API structure:

1. **Replace multiple imports:**
```javascript
// Old
import { authApi } from '../services/api/auth.api';
import { adminApi } from '../services/api/admin.api';
import { apiClient } from '../services/api/client';

// New
import { authService, userService, apiClient } from '../services/api';
```

2. **Update service calls:**
```javascript
// Old
await authApi.login(credentials);
await adminApi.getUsers();

// New
await authService.login(credentials);
await userService.getUsers(token);
```

3. **Use new error handling:**
```javascript
// Old
catch (error) {
  console.error(error.message);
}

// New
catch (error) {
  const errorInfo = handleApiError(error);
  console.error(errorInfo.message, errorInfo.type);
}
```

## Notes

- All services are async/await based
- Token is passed as the last or second parameter consistently
- Filters/params are passed as objects
- All methods return promises
- Error handling is centralized and consistent
- Form data handling is automatic for specific endpoints (login, user creation)