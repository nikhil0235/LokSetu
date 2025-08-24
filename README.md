# Booth Pulse 🗳️

A comprehensive political data management platform for real-time electoral operations, voter database updates, and field team coordination built with [**React Native**](https://reactnative.dev).

## 📱 About the App

Booth Pulse is designed for political campaigns to manage voter data, coordinate field teams, and track electoral performance through a hierarchical access system. Each user type has customized dashboards and role-based permissions.

## 👥 User Hierarchy & Access Levels

### 1. App Owner / Production Team (Super Admin)
- **Access**: Full application control
- **Abilities**: View/edit all data, user management, analytics, system monitoring
- **Dashboard**: Super Admin Console

### 2. Political Party Access
- **Access**: Entire state or selected constituencies
- **Abilities**: Manage regional units, assign users, set targets
- **Dashboard**: Party Admin Dashboard

### 3. Candidate Access
- **Access**: Own constituency (read-only)
- **Abilities**: View constituency data, real-time reports, survey analysis
- **Dashboard**: Candidate Command Center

### 4. Vidhan Sabha Prabhari
- **Access**: Full constituency oversight
- **Abilities**: Manage block/panchayat prabharis, coordinate operations
- **Dashboard**: Constituency Operations Dashboard

### 5. Block Prabhari / Nagar Prabhari
- **Access**: Block or urban body (Nagar Nigam/Parishad/Panchayat)
- **Abilities**: Manage panchayats/wards, assign volunteers
- **Dashboard**: Block/Nagar Management Dashboard

### 6. Panchayat Prabhari / Ward Prabhari
- **Access**: Single panchayat or ward
- **Abilities**: Track booths, manage polling agents
- **Dashboard**: Panchayat/Ward Focus Panel

### 7. Booth Volunteers & Polling Agents
- **Access**: Assigned booth(s) only
- **Abilities**: Update voter records, submit survey data
- **Dashboard**: Mobile Task Dashboard

## 📊 Voter Data Structure

### Basic Information
- EPIC/Voter ID, Name, Guardian Name, Gender, Age/DOB
- Mobile Number, Photo, Booth Details

### Political Data
- Last Election Voted Party
- Current Voting Preference
- Vote Certainty & Availability

### Demographics
- Religion, Caste, Category (General/OBC/EBC)
- Language Preference

### Socio-Economic
- Education Level
- Employment Status (Govt/Private/Self-employed/Unemployed)
- Salary Range, Job Role

### Location & Issues
- Residence Status, Migration Details
- Key Issues & Feedback

## 🚀 Getting Started

### Prerequisites
Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment).

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd LokSetu

# Install dependencies
npm install
# OR
yarn install

# For iOS (macOS only)
cd ios && pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   └── specific/        # Role-specific components
├── screens/
│   ├── boothboy/        # Booth volunteer screens
│   ├── panchayat/       # Panchayat prabhari screens
│   ├── block/           # Block prabhari screens
│   └── candidate/       # Candidate screens
├── config/
│   └── userRoleConfig.js # Role-based configurations
├── utils/               # Helper functions
└── navigation/          # Navigation setup
```

## 🔧 Key Features

- **Hierarchical Data Access**: Role-based data visibility and editing permissions
- **Real-time Voter Management**: Update voter information, preferences, and contact details
- **Performance Analytics**: Track team performance and data completion rates
- **Drill-down Navigation**: Higher-level users can view subordinate dashboards
- **Offline Support**: Work offline and sync when connected
- **Multi-language Support**: Hindi and English interface

## 📱 Screen Components

### VoterListScreen
Main screen for booth volunteers to manage voter data with:
- Voter cards with political preferences
- Verification status indicators
- Filter and search capabilities
- Edit and call functionality

## 🛠️ Development

### Code Quality
The project uses:
- ESLint for code linting
- Prettier for code formatting
- React Native best practices

### Security Considerations
- Secure credential management
- Input sanitization
- Role-based access control
- Data encryption for sensitive information

## 📄 License

This project is proprietary software for electoral campaign management.

## 🤝 Contributing

This is a private project. Contact the development team for contribution guidelines.