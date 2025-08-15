# Booth Boy Module Documentation

## Overview
The Booth Boy module provides a comprehensive interface for booth boys to manage and filter voter data. It includes filtering capabilities, voter list management, and voter detail editing functionality.

## Features

### 1. Dashboard
- **Booth Boy Profile**: Display booth boy information including assigned booths and constituency
- **Voter Statistics**: Show total voters, verification status, gender distribution
- **Filter Options**: Quick access to different filtering options
- **Navigation**: Easy navigation to voter lists

### 2. Filtering System
- **Booth Wise**: Filter voters by specific polling booths
- **Address Wise**: Filter by area/address
- **Age Wise**: Filter by age groups (18-25, 26-35, 36-45, 46-55, 56-65, 65+)
- **Caste Wise**: Filter by caste categories (General, OBC, SC, ST)
- **Verification Status**: Filter by verified/unverified voters
- **Gender Wise**: Filter by gender (Male, Female, Other)

### 3. Voter Management
- **Search**: Search voters by name, EPIC ID, mobile number, or address
- **Sort**: Sort by name, age, booth, or verification status
- **Edit Details**: Update voter information including:
  - Mobile number
  - Last voted party
  - Expected vote preference
  - Vote certainty
  - Verification status
  - Additional notes/feedback

## File Structure

```
src/screens/boothboy/
├── BoothBoyDashboard.jsx          # Main dashboard screen
├── VoterListScreen.jsx            # Voter list with filtering
├── components/
│   ├── BoothBoyProfile.jsx        # Profile component
│   ├── FilterModal.jsx            # Filter selection modal
│   └── VoterEditModal.jsx         # Voter editing modal
└── index.js                       # Export file

src/models/
└── VoterModel.js                  # Voter data model

src/services/
└── VoterService.js                # Voter data operations

src/utils/
└── filterUtils.js                 # Filter utility functions
```

## Components

### BoothBoyDashboard
Main dashboard component that displays:
- Booth boy profile information
- Voter statistics cards
- Filter option cards
- Navigation to voter lists

### VoterListScreen
Displays filtered voter lists with:
- Search functionality
- Sort options
- Voter cards with detailed information
- Edit functionality for each voter

### FilterModal
Modal component for selecting filter criteria:
- Dynamic options based on filter type
- Custom input for address filtering
- Apply/cancel actions

### VoterEditModal
Modal for editing voter details:
- Form fields for editable information
- Political preference selection
- Verification status update
- Notes/feedback section

## Data Models

### VoterModel
Complete voter data model with all required fields:
- Basic information (name, EPIC ID, age, gender)
- Contact information (mobile, address)
- Political data (last voted party, preference, certainty)
- Demographic data (caste, religion)
- Employment and location data
- Verification status and timestamps

## Usage

### Import Components
```javascript
import { BoothBoyDashboard } from '../screens/boothboy';
```

### Initialize Dashboard
```javascript
const boothBoyInfo = {
  id: 'BB001',
  name: 'राम कुमार',
  phone: '+91 9876543210',
  assignedBooths: ['B001', 'B002', 'B003'],
  constituency: 'Constituency-1',
  area: 'North Zone',
  totalVoters: 2847
};

<BoothBoyDashboard 
  boothBoyInfo={boothBoyInfo}
  onLogout={handleLogout}
/>
```

### Filter Voters
```javascript
import VoterService from '../services/VoterService';

// Filter by booth
const boothVoters = VoterService.filterVoters({
  type: 'booth',
  value: 'B001'
});

// Filter by age group
const youngVoters = VoterService.filterVoters({
  type: 'age',
  value: '18-25'
});
```

### Update Voter
```javascript
const updatedVoter = VoterService.updateVoter('ABC1234567', {
  mobile: '9876543210',
  voting_preference: 'BJP',
  certainty_of_vote: 'High',
  verification_status: 'Verified'
});
```

## Styling
All components use consistent styling with:
- Material Design inspired cards
- Color-coded status indicators
- Responsive layout for different screen sizes
- Accessibility-friendly touch targets

## Future Enhancements
1. **Offline Support**: Cache voter data for offline access
2. **Photo Capture**: Add voter photo capture functionality
3. **GPS Integration**: Location-based voter verification
4. **Bulk Operations**: Bulk update capabilities
5. **Analytics**: Advanced voter analytics and reporting
6. **Export**: Export filtered voter lists
7. **Notifications**: Push notifications for updates
8. **Multi-language**: Support for regional languages

## API Integration
The module is designed to work with REST APIs:
- GET /voters - Fetch voter data
- PUT /voters/:id - Update voter information
- GET /booths - Fetch booth information
- GET /statistics - Fetch voter statistics

## Security Considerations
- Voter data encryption
- Secure authentication
- Role-based access control
- Audit logging for data changes
- Data privacy compliance