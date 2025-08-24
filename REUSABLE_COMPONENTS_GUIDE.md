# Reusable Components Guide

This guide explains how to use the new reusable component system in LokSetu. The system eliminates the need to write separate screens for each user type and provides a consistent UI/UX across the application.

## Overview

The reusable component system consists of three main components:

1. **ReusableDashboard** - For all dashboard screens
2. **ReusableForm** - For all form screens (create/edit users, etc.)
3. **ReusableList** - For all list screens (users, voters, booths, etc.)

## Components

### 1. ReusableDashboard

A configurable dashboard component that adapts to different user roles.

**Location**: `src/components/common/ReusableDashboard.jsx`

**Usage**:
```jsx
import { ReusableDashboard } from '../components/common';

<ReusableDashboard
  user={user}
  userType={user?.role}
  title="Dashboard Title"
  subtitle="Dashboard Subtitle"
  stats={statsArray}
  actions={actionsArray}
  activities={activitiesArray}
  healthMetrics={healthMetricsArray}
  onRefresh={handleRefresh}
  onLogout={handleLogout}
  onMenuPress={handleMenuPress}
  refreshing={false}
  showMenu={true}
  menuItems={menuItemsArray}
  onNavigate={handleNavigate}
/>
```

**Features**:
- Role-based stat cards
- Quick action buttons
- Recent activities feed
- System health metrics (for super admin)
- Side drawer menu
- Pull-to-refresh functionality

### 2. ReusableForm

A dynamic form component that generates forms based on configuration.

**Location**: `src/components/common/ReusableForm.jsx`

**Usage**:
```jsx
import { ReusableForm } from '../components/common';

<ReusableForm
  title="Create User"
  sections={formSections}
  onSubmit={handleSubmit}
  onBack={handleBack}
  onLogout={handleLogout}
  submitButtonText="Create User"
  submitIcon="person-add"
  isLoading={false}
  initialData={initialFormData}
  validationRules={validationRules}
  showPermissions={true}
  permissions={permissionsArray}
/>
```

**Supported Field Types**:
- `text` - Text input
- `email` - Email input with validation
- `phone` - Phone number input
- `password` - Password input with show/hide toggle
- `select` - Dropdown picker
- `radio` - Radio button group
- `textarea` - Multi-line text input

**Validation Types**:
- `required` - Field is required
- `minLength` - Minimum length
- `maxLength` - Maximum length
- `email` - Email format validation
- `phone` - Phone number validation
- `username` - Username format validation
- `password` - Password strength validation
- `match` - Match another field
- `custom` - Custom validation function

### 3. ReusableList

A comprehensive list component with search, filter, and pagination.

**Location**: `src/components/common/ReusableList.jsx`

**Usage**:
```jsx
import { ReusableList } from '../components/common';

<ReusableList
  title="User Management"
  data={listData}
  columns={columnConfig}
  onBack={handleBack}
  onLogout={handleLogout}
  onRefresh={handleRefresh}
  refreshing={false}
  searchable={true}
  filterable={true}
  filters={filterConfig}
  actions={actionButtons}
  itemActions={itemActionButtons}
  onItemPress={handleItemPress}
  pagination={true}
  itemsPerPage={20}
/>
```

**Features**:
- Search functionality
- Advanced filtering
- Pagination for large datasets
- Item actions (edit, delete, view)
- Custom item rendering
- Empty state handling
- Pull-to-refresh

## Configuration System

### Location
`src/config/userRoleConfig.js`

### Dashboard Configurations
Each user role has a predefined dashboard configuration:

```javascript
export const DASHBOARD_CONFIGS = {
  [USER_ROLES.SUPER_ADMIN]: {
    title: 'Super Admin Portal',
    subtitle: 'System Overview & Analytics',
    stats: [...],
    actions: [...],
    menuItems: [...],
    healthMetrics: [...]
  },
  // ... other roles
};
```

### Form Configurations
Predefined form configurations for different use cases:

```javascript
export const FORM_CONFIGS = {
  CREATE_ADMIN: {
    title: 'Create Admin User',
    sections: [...],
    validationRules: {...},
    submitButtonText: 'Create Admin User',
    permissions: [...]
  },
  // ... other forms
};
```

### List Configurations
Predefined list configurations for different data types:

```javascript
export const LIST_CONFIGS = {
  USERS: {
    title: 'User Management',
    columns: [...],
    filters: [...],
    actions: [...],
    itemActions: [...]
  },
  // ... other lists
};
```

### Permission System
Role-based permission system:

```javascript
export const PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: {
    dashboard: ['view_all_stats', 'system_health'],
    users: ['create', 'read', 'update', 'delete'],
    // ... other resources
  },
  // ... other roles
};
```

## Unified Screens

### UnifiedDashboard
**Location**: `src/screens/UnifiedDashboard.jsx`

Replaces all individual dashboard screens. Automatically configures based on user role.

**Usage**:
```jsx
import UnifiedDashboard from '../screens/UnifiedDashboard';

<UnifiedDashboard
  onNavigate={handleNavigation}
  onLogout={handleLogout}
  onMenuPress={handleMenuPress}
/>
```

### UnifiedCreateUserScreen
**Location**: `src/screens/UnifiedCreateUserScreen.jsx`

Handles creation of all user types based on configuration.

**Usage**:
```jsx
import UnifiedCreateUserScreen from '../screens/UnifiedCreateUserScreen';

// For creating booth volunteers
<UnifiedCreateUserScreen
  userType="CREATE_BOOTH_VOLUNTEER"
  onBack={handleBack}
  onLogout={handleLogout}
/>

// For creating admin users
<UnifiedCreateUserScreen
  userType="CREATE_ADMIN"
  onBack={handleBack}
  onLogout={handleLogout}
/>
```

### UnifiedListScreen
**Location**: `src/screens/UnifiedListScreen.jsx`

Handles all list screens (users, voters, booths, etc.).

**Usage**:
```jsx
import UnifiedListScreen from '../screens/UnifiedListScreen';

// For user management
<UnifiedListScreen
  listType="USERS"
  data={userData}
  onBack={handleBack}
  onLogout={handleLogout}
  onNavigate={handleNavigation}
  onRefresh={handleRefresh}
  refreshing={isRefreshing}
/>
```

## Migration Guide

### Step 1: Replace Individual Dashboard Screens
Replace `AdminDashboardScreen`, `SuperAdminDashboardScreen`, etc. with `UnifiedDashboard`.

### Step 2: Replace Form Screens
Replace `CreateBoothBoyScreen`, `CreateAdminScreen`, etc. with `UnifiedCreateUserScreen`.

### Step 3: Replace List Screens
Replace individual list screens with `UnifiedListScreen`.

### Step 4: Update Navigation
Update your navigation logic to use the unified screens:

```jsx
// Before
switch (screen) {
  case 'createBoothBoy':
    return <CreateBoothBoyScreen {...props} />;
  case 'createAdmin':
    return <CreateAdminScreen {...props} />;
  // ... many more cases
}

// After
switch (screen) {
  case 'createBoothBoy':
    return <UnifiedCreateUserScreen userType="CREATE_BOOTH_VOLUNTEER" {...props} />;
  case 'createAdmin':
    return <UnifiedCreateUserScreen userType="CREATE_ADMIN" {...props} />;
  case 'allUsers':
    return <UnifiedListScreen listType="USERS" data={users} {...props} />;
  // Much fewer cases needed
}
```

## Benefits

1. **Reduced Code Duplication**: One component handles all user types
2. **Consistent UI/UX**: Same look and feel across all screens
3. **Easy Configuration**: Change behavior through config files
4. **Role-based Access**: Built-in permission system
5. **Maintainable**: Changes to one component affect all screens
6. **Flexible**: Easy to add new user types or modify existing ones
7. **Type Safety**: Configuration-driven approach reduces errors

## Adding New User Types

1. Add the new role to `USER_ROLES` in `src/services/api/config.js`
2. Add dashboard configuration in `DASHBOARD_CONFIGS`
3. Add form configuration in `FORM_CONFIGS` (if needed)
4. Add list configuration in `LIST_CONFIGS` (if needed)
5. Add permissions in `PERMISSIONS`

## Best Practices

1. Always use the configuration system rather than hardcoding
2. Check permissions before allowing actions
3. Use the helper functions provided (`getDashboardConfig`, `hasPermission`, etc.)
4. Keep configurations in the config file, not in components
5. Test with different user roles to ensure proper access control

This system significantly reduces the amount of code needed while providing a more maintainable and consistent user experience.