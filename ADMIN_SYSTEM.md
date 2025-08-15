# LokSetu Admin System

## Overview
The LokSetu Admin System is a comprehensive role-based management platform for political data collection and booth management. It supports three main roles with different levels of access and functionality.

## User Roles

### 1. Super Admin
**Credentials:** `super_admin` / `super123`

**Capabilities:**
- Create and manage admin accounts
- Assign constituencies to admins
- View all admins and their booth boys
- Access system-wide reports and analytics
- Manage data scraping operations
- Full system oversight

**Key Screens:**
- Super Admin Dashboard
- Create Admin
- Constituency Assignment
- Admin Management
- System Reports

### 2. Admin
**Credentials:** 
- `admin1` / `admin123` (Constituency-1)
- `admin2` / `admin123` (Constituency-2)
- `admin3` / `admin123` (Constituency-3)

**Capabilities:**
- Create and manage booth boys within assigned constituency
- Assign booths to booth boys
- View and export voter data for their constituency
- Monitor booth boy activities and progress
- Access data scraping tools for their area
- Generate constituency-specific reports

**Key Screens:**
- Admin Dashboard
- Create Booth Boy
- Booth Boy Management
- Booth Assignment
- Data Scraper
- Reports

### 3. Booth Boy (Future Implementation)
**Capabilities:**
- View assigned booth voter lists
- Edit and update voter information
- Sync data offline
- Export voter data for assigned booths

## Key Features

### 1. Data Scraping System
- **Purpose:** Scrape voter data from government websites
- **Functionality:**
  - Create scraping jobs for different constituencies
  - Monitor scraping progress in real-time
  - Support for multiple data types (voters, booths, candidates)
  - Configurable target URLs and parameters

### 2. Data Parser
- **Purpose:** Parse and clean scraped raw data
- **Functionality:**
  - Process raw JSON/CSV data files
  - Validate and clean voter records
  - Identify and flag error records
  - Export parsed data in multiple formats
  - Save validated data to database

### 3. Booth Management
- **Purpose:** Manage booth assignments and booth boy accounts
- **Functionality:**
  - Create booth boy accounts with credentials
  - Assign multiple booths to booth boys
  - Track booth boy performance and progress
  - Monitor data collection activities

### 4. Role-Based Access Control
- **Super Admin:** Full system access
- **Admin:** Constituency-specific access
- **Booth Boy:** Booth-specific access

## Screen Navigation

### Super Admin Flow
```
Login → Super Admin Dashboard → {
  ├── Create Admin
  ├── Admin Management
  ├── Constituency Assignment
  ├── Data Scraper
  ├── System Reports
  └── Settings
}
```

### Admin Flow
```
Login → Admin Dashboard → {
  ├── Create Booth Boy
  ├── Booth Boy Management
  │   ├── Booth Boy Details
  │   ├── Edit Booth Boy
  │   └── Booth Assignment
  ├── Data Scraper
  ├── Data Parser
  ├── Reports
  └── Settings
}
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Install iOS Dependencies (iOS only)
```bash
cd ios && pod install
```

### 3. Run the Application
```bash
# Android
npm run android

# iOS
npm run ios
```

## Authentication

### Login Credentials
| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Super Admin | super_admin | super123 | Full System |
| Admin 1 | admin1 | admin123 | Constituency-1 |
| Admin 2 | admin2 | admin123 | Constituency-2 |
| Admin 3 | admin3 | admin123 | Constituency-3 |

## Data Flow

### 1. Data Scraping Flow
```
Government Website → Scraper → Raw Data → Parser → Clean Data → Database
```

### 2. User Management Flow
```
Super Admin → Creates Admin → Admin Creates Booth Boys → Booth Boys Collect Data
```

### 3. Data Collection Flow
```
Booth Boy → Collects Voter Data → Syncs to Admin → Admin Reviews → Data Aggregation
```

## Key Components

### 1. Navigation System
- Role-based tab navigation
- Stack navigation for detailed screens
- Conditional screen access based on user role

### 2. State Management
- Redux Toolkit for state management
- Auth slice for user authentication
- Role-based permission checking

### 3. Mock Data Services
- Simulated API calls for development
- Mock authentication system
- Sample data for all user roles

## Future Enhancements

### 1. Real API Integration
- Replace mock services with actual backend APIs
- Implement real authentication and authorization
- Connect to actual government data sources

### 2. Offline Functionality
- Offline data collection for booth boys
- Data synchronization when online
- Conflict resolution for concurrent edits

### 3. Advanced Analytics
- Real-time dashboards
- Predictive analytics
- Data visualization charts

### 4. Mobile Optimization
- Responsive design for tablets
- Optimized performance for low-end devices
- Battery optimization for field use

## Security Features

### 1. Authentication
- JWT token-based authentication
- Role-based access control
- Session management

### 2. Data Protection
- Encrypted data storage
- Secure API communications
- User activity logging

### 3. Access Control
- Screen-level permissions
- Feature-level restrictions
- Data visibility controls

## Development Notes

### 1. Code Structure
- Modular screen components
- Reusable UI components
- Centralized styling system

### 2. Testing
- Unit tests for core functionality
- Integration tests for user flows
- Mock data for development testing

### 3. Performance
- Optimized list rendering
- Lazy loading for large datasets
- Memory management for mobile devices

## Support & Maintenance

### 1. Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Logging for debugging

### 2. Updates
- Over-the-air updates capability
- Version management
- Backward compatibility

### 3. Monitoring
- User activity tracking
- Performance monitoring
- Crash reporting

## Conclusion

The LokSetu Admin System provides a comprehensive solution for political data management with role-based access, data scraping capabilities, and efficient booth management. The system is designed to be scalable, secure, and user-friendly for all stakeholder levels.