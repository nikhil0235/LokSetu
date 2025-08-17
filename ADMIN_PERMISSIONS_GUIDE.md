# Admin Permissions & Access Control Guide

## 🔐 Role-Based Access Control

### Super Admin (Full System Access)
**Can see and manage everything in the system:**

#### Dashboard Overview
- Total admins count (real-time from API)
- Total booth boys count (real-time from API) 
- Total voters count (real-time from API)
- System health metrics
- Recent activities across all users

#### User Management
- **All Admins Screen**: View complete list of all admin users with details
- **All Booth Boys Screen**: View complete list of all booth boys across all admins
- **Create Admin**: Add new admin users with constituency assignments
- **Delete/Update Users**: Full CRUD operations on all users

#### Data Management
- **Voter Lists**: Access to all voter data across all constituencies
- **Booth Management**: View and manage all polling booths
- **Data Scraping**: Access to data scraping tools
- **System Reports**: Comprehensive analytics and reports

#### API Access
- All `/users/` endpoints (GET, POST, PATCH, DELETE)
- All `/voters/` endpoints 
- All `/general/` endpoints (states, districts, assembly, booths)
- Full system administration capabilities

### Admin (Limited Scope Access)
**Can see and manage within assigned scope:**

#### Dashboard Overview
- Booth boys created by them (real-time count)
- Assigned booths count
- Data collection progress for their area
- Activities related to their scope

#### User Management
- **Created Booth Boys**: Only booth boys they have created
- **Create Booth Boy**: Add new booth boys under their supervision
- **Update Booth Boys**: Modify booth boys they created

#### Data Management
- **Voter Lists**: Only voters in their assigned constituencies/booths
- **Booth Lists**: Only booths assigned to them
- **Reports**: Analytics for their assigned area only

#### API Access
- Limited `/users/` access (only for booth boy creation)
- Filtered `/voters/` access (only their assigned scope)
- No access to `/general/` endpoints
- Cannot manage other admins

### Booth Boy (Field Level Access)
**Can see and manage assigned booths only:**

#### Dashboard Overview
- Assigned booth information
- Voter count in their booths
- Data collection status

#### Data Management
- **Voter Lists**: Only voters in specifically assigned booths
- **Update Voters**: Edit voter information in assigned booths
- **Offline Sync**: Download and sync voter data

#### API Access
- Very limited `/voters/` access (only assigned booths)
- Cannot create users or access admin functions

## 🔄 Real API Integration Status

### ✅ Implemented (No More Dummy Data)
- **SuperAdminDashboardScreen**: Uses real user counts from `/users/` API
- **AllAdminsScreen**: Fetches real admin list from `/users/` API
- **AllBoothBoysScreen**: Fetches real booth boy list from `/users/` API
- **CreateAdminScreen**: Uses real `/users/` POST API
- **CreateBoothBoyScreen**: Uses real `/users/` POST API
- **BoothListScreen**: Uses real voter data from `/voters/` API

### 🔧 API Endpoints Used
```javascript
// Super Admin APIs
GET /users/           // Get all users (admins + booth boys)
POST /users/          // Create new admin/booth boy
PATCH /users/{id}     // Update user details
DELETE /users/{id}    // Delete user
GET /voters/          // Get all voters
GET /general/states   // Get states data
GET /general/districts // Get districts data

// Admin APIs (filtered)
GET /voters/          // Get voters (filtered by scope)
POST /users/          // Create booth boys only
PATCH /voters/{epic}  // Update voter info

// Booth Boy APIs (very limited)
GET /voters/          // Get voters (only assigned booths)
PATCH /voters/{epic}  // Update voter info in assigned booths
```

## 📊 Data Flow

### Super Admin Data Flow
1. Login → Get full user object with all permissions
2. Dashboard → Fetch all users, count admins/booth boys
3. User Management → Full CRUD on all users
4. Voter Management → Access to all voter data
5. System Management → Full system control

### Admin Data Flow  
1. Login → Get user object with assigned scope
2. Dashboard → Fetch only created booth boys
3. User Management → Create/manage booth boys only
4. Voter Management → Access filtered by assigned area
5. Reports → Scope-limited analytics

### Booth Boy Data Flow
1. Login → Get user object with assigned booths
2. Dashboard → Show assigned booth info only
3. Voter Management → Edit voters in assigned booths only
4. Sync → Download/upload data for assigned booths

## 🛡️ Security Implementation

### Token-Based Authentication
- JWT tokens automatically included in all API calls
- Role-based endpoint access enforced by backend
- Frontend UI adapts based on user role

### Data Filtering
- API responses filtered by user's assigned scope
- UI components show/hide based on permissions
- Real-time data updates respect access controls

### Error Handling
- Graceful handling of unauthorized access attempts
- User-friendly error messages for permission issues
- Automatic token refresh and logout on auth failures

All screens now use real API data with proper role-based access control!