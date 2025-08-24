import { USER_ROLES } from '../services/api/config';

// Re-export USER_ROLES for convenience
export { USER_ROLES };

// Dashboard configurations for each user role
export const DASHBOARD_CONFIGS = {
  [USER_ROLES.SUPER_ADMIN]: {
    title: 'Super Admin Portal',
    subtitle: 'System Overview & Analytics',
    stats: [
      {
        iconName: 'admin-panel-settings',
        title: 'Total Admins',
        color: '#8B5CF6',
        key: 'totalAdmins',
        onPress: 'allAdmins'
      },
      {
        iconName: 'group',
        title: 'Total Booth Boys',
        color: '#3B82F6',
        key: 'totalBoothBoys',
        onPress: 'allBoothBoys'
      },
      {
        iconName: 'how-to-vote',
        title: 'Total Voters',
        color: '#3B82F6',
        key: 'totalVoters',
        onPress: 'allVoters'
      },
      {
        iconName: 'location-on',
        title: 'Total Booths',
        color: '#10B981',
        key: 'totalBooths',
        onPress: 'boothList'
      },
      {
        iconName: 'public',
        title: 'Constituencies',
        color: '#F59E0B',
        key: 'totalConstituencies',
        onPress: 'constituenciesList'
      },
      {
        iconName: 'bar-chart',
        title: 'Data Progress',
        color: '#EF4444',
        key: 'dataProgress',
        value: '0%'
      }
    ],
    actions: [
      {
        iconName: 'add',
        title: 'Create Admin',
        description: 'Add new admin user',
        color: '#8B5CF6',
        onPress: 'createAdmin'
      },
      {
        iconName: 'assignment',
        title: 'Assign Constituency',
        description: 'Manage admin areas',
        color: '#10B981',
        onPress: 'assignConstituency'
      },
      {
        iconName: 'storage',
        title: 'Data Scraper',
        description: 'Scrape voter data',
        color: '#F59E0B',
        onPress: 'dataScraper'
      },
      {
        iconName: 'assessment',
        title: 'System Reports',
        description: 'View all reports',
        color: '#EF4444',
        onPress: 'systemReports'
      }
    ],
    menuItems: [
      { title: 'All Admins', icon: 'admin-panel-settings', screen: 'allAdmins', color: '#8B5CF6' },
      { title: 'All Booth Boys', icon: 'group', screen: 'allBoothBoys', color: '#3B82F6' },
      { title: 'All Voters', icon: 'how-to-vote', screen: 'allVoters', color: '#10B981' },
      { title: 'Booth List', icon: 'location-on', screen: 'boothList', color: '#F59E0B' },
      { title: 'Constituencies', icon: 'public', screen: 'constituenciesList', color: '#EF4444' }
    ],
    healthMetrics: [
      { label: 'Database Status', status: 'Online', color: '#10B981' },
      { label: 'API Status', status: 'Healthy', color: '#10B981' },
      { label: 'Scraper Status', status: 'Running', color: '#F59E0B' }
    ]
  },

  [USER_ROLES.POLITICAL_PARTY]: {
    title: 'Political Party Dashboard',
    subtitle: 'Party Management & Operations',
    stats: [
      {
        iconName: 'group',
        title: 'Created Users',
        color: '#3B82F6',
        key: 'totalCreatedUsers',
        onPress: 'createdUsers'
      },
      {
        iconName: 'location-on',
        title: 'Assigned Booths',
        color: '#10B981',
        key: 'totalAssignedBooths',
        onPress: 'boothList'
      },
      {
        iconName: 'public',
        title: 'Constituencies',
        color: '#F59E0B',
        key: 'totalAssignedConstituencies'
      },
      {
        iconName: 'online-prediction',
        title: 'Last Updated',
        color: '#8B5CF6',
        key: 'lastUpdated',
        value: 'Now'
      }
    ],
    actions: [
      {
        iconName: 'add',
        title: 'Create User',
        description: 'Add new user',
        color: '#3B82F6',
        onPress: 'createBoothBoy'
      },
      {
        iconName: 'assignment',
        title: 'Assign Booths',
        description: 'Manage assignments',
        color: '#10B981',
        onPress: 'assignBooths'
      },
      {
        iconName: 'assessment',
        title: 'Reports',
        description: 'View analytics',
        color: '#8B5CF6',
        onPress: 'reports'
      },
      {
        iconName: 'settings',
        title: 'Settings',
        description: 'User preferences',
        color: '#F59E0B',
        onPress: 'settings'
      }
    ],
    menuItems: [
      { title: 'Created Users', icon: 'group', screen: 'createdUsers', color: '#3B82F6' },
      { title: 'Booth List', icon: 'location-on', screen: 'boothList', color: '#10B981' },
      { title: 'Create Booth Boy', icon: 'add', screen: 'createBoothBoy', color: '#3B82F6' },
      { title: 'Assign Booths', icon: 'assignment', screen: 'assignBooths', color: '#10B981' }
    ]
  },

  [USER_ROLES.CANDIDATE]: {
    title: 'Candidate Management Portal',
    subtitle: 'Campaign & Voter Management',
    stats: [
      {
        iconName: 'campaign',
        title: 'Campaign Events',
        color: '#3B82F6',
        key: 'campaignEvents',
        value: '0'
      },
      {
        iconName: 'people',
        title: 'Supporters',
        color: '#10B981',
        key: 'supporters',
        value: '0'
      },
      {
        iconName: 'how-to-vote',
        title: 'Target Voters',
        color: '#8B5CF6',
        key: 'targetVoters',
        value: '0'
      },
      {
        iconName: 'trending-up',
        title: 'Progress',
        color: '#F59E0B',
        key: 'progress',
        value: '0%'
      }
    ],
    actions: [
      {
        iconName: 'campaign',
        title: 'Campaign',
        description: 'Manage campaign',
        color: '#3B82F6',
        onPress: 'campaign'
      },
      {
        iconName: 'people',
        title: 'Supporters',
        description: 'View supporters',
        color: '#10B981',
        onPress: 'supporters'
      },
      {
        iconName: 'assessment',
        title: 'Reports',
        description: 'View analytics',
        color: '#8B5CF6',
        onPress: 'reports'
      },
      {
        iconName: 'settings',
        title: 'Settings',
        description: 'User preferences',
        color: '#F59E0B',
        onPress: 'settings'
      }
    ],
    menuItems: [
      { title: 'Campaign', icon: 'campaign', screen: 'campaign', color: '#3B82F6' },
      { title: 'Supporters', icon: 'people', screen: 'supporters', color: '#10B981' },
      { title: 'Voter List', icon: 'how-to-vote', screen: 'voterList', color: '#8B5CF6' }
    ]
  },

  [USER_ROLES.VIDHAN_SABHA_PRABHARI]: {
    title: 'Vidhan Sabha Management',
    subtitle: 'Assembly Level Operations',
    stats: [
      {
        iconName: 'location-on',
        title: 'My Area',
        color: '#3B82F6',
        key: 'assignedArea',
        value: '1'
      },
      {
        iconName: 'group',
        title: 'Block Officers',
        color: '#10B981',
        key: 'blockOfficers',
        value: '0'
      },
      {
        iconName: 'how-to-vote',
        title: 'Total Voters',
        color: '#8B5CF6',
        key: 'totalVoters',
        value: '0'
      },
      {
        iconName: 'assessment',
        title: 'Reports',
        color: '#F59E0B',
        key: 'reports',
        value: '0'
      }
    ],
    actions: [
      {
        iconName: 'location-on',
        title: 'My Area',
        description: 'Assigned area',
        color: '#3B82F6',
        onPress: 'myArea'
      },
      {
        iconName: 'group',
        title: 'Manage Officers',
        description: 'Block officers',
        color: '#10B981',
        onPress: 'manageOfficers'
      },
      {
        iconName: 'assessment',
        title: 'Reports',
        description: 'View analytics',
        color: '#8B5CF6',
        onPress: 'reports'
      },
      {
        iconName: 'settings',
        title: 'Settings',
        description: 'User preferences',
        color: '#F59E0B',
        onPress: 'settings'
      }
    ],
    menuItems: [
      { title: 'My Area', icon: 'location-on', screen: 'myArea', color: '#3B82F6' },
      { title: 'Block Officers', icon: 'group', screen: 'blockOfficers', color: '#10B981' },
      { title: 'Voter List', icon: 'how-to-vote', screen: 'voterList', color: '#8B5CF6' }
    ]
  },

  [USER_ROLES.BLOCK_PRABHARI]: {
    title: 'Block Level Management',
    subtitle: 'Block Operations & Coordination',
    stats: [
      {
        iconName: 'location-on',
        title: 'My Block',
        color: '#3B82F6',
        key: 'assignedBlock',
        value: '1'
      },
      {
        iconName: 'group',
        title: 'Panchayat Officers',
        color: '#10B981',
        key: 'panchayatOfficers',
        value: '0'
      },
      {
        iconName: 'how-to-vote',
        title: 'Block Voters',
        color: '#8B5CF6',
        key: 'blockVoters',
        value: '0'
      },
      {
        iconName: 'trending-up',
        title: 'Progress',
        color: '#F59E0B',
        key: 'progress',
        value: '0%'
      }
    ],
    actions: [
      {
        iconName: 'location-on',
        title: 'My Block',
        description: 'Assigned block',
        color: '#3B82F6',
        onPress: 'myBlock'
      },
      {
        iconName: 'group',
        title: 'Panchayat Officers',
        description: 'Manage officers',
        color: '#10B981',
        onPress: 'panchayatOfficers'
      },
      {
        iconName: 'assessment',
        title: 'Reports',
        description: 'View analytics',
        color: '#8B5CF6',
        onPress: 'reports'
      },
      {
        iconName: 'settings',
        title: 'Settings',
        description: 'User preferences',
        color: '#F59E0B',
        onPress: 'settings'
      }
    ],
    menuItems: [
      { title: 'My Block', icon: 'location-on', screen: 'myBlock', color: '#3B82F6' },
      { title: 'Panchayat Officers', icon: 'group', screen: 'panchayatOfficers', color: '#10B981' },
      { title: 'Voter List', icon: 'how-to-vote', screen: 'voterList', color: '#8B5CF6' }
    ]
  },

  [USER_ROLES.PANCHAYAT_PRABHARI]: {
    title: 'Panchayat Level Management',
    subtitle: 'Local Area Operations',
    stats: [
      {
        iconName: 'location-on',
        title: 'My Panchayat',
        color: '#3B82F6',
        key: 'assignedPanchayat',
        value: '1'
      },
      {
        iconName: 'group',
        title: 'Booth Volunteers',
        color: '#10B981',
        key: 'boothVolunteers',
        value: '0'
      },
      {
        iconName: 'how-to-vote',
        title: 'Local Voters',
        color: '#8B5CF6',
        key: 'localVoters',
        value: '0'
      },
      {
        iconName: 'check-circle',
        title: 'Coverage',
        color: '#F59E0B',
        key: 'coverage',
        value: '0%'
      }
    ],
    actions: [
      {
        iconName: 'location-on',
        title: 'My Panchayat',
        description: 'Assigned area',
        color: '#3B82F6',
        onPress: 'myPanchayat'
      },
      {
        iconName: 'group',
        title: 'Volunteers',
        description: 'Manage volunteers',
        color: '#10B981',
        onPress: 'volunteers'
      },
      {
        iconName: 'assessment',
        title: 'Reports',
        description: 'View analytics',
        color: '#8B5CF6',
        onPress: 'reports'
      },
      {
        iconName: 'settings',
        title: 'Settings',
        description: 'User preferences',
        color: '#F59E0B',
        onPress: 'settings'
      }
    ],
    menuItems: [
      { title: 'My Panchayat', icon: 'location-on', screen: 'myPanchayat', color: '#3B82F6' },
      { title: 'Booth Volunteers', icon: 'group', screen: 'boothVolunteers', color: '#10B981' },
      { title: 'Voter List', icon: 'how-to-vote', screen: 'voterList', color: '#8B5CF6' }
    ]
  },

  [USER_ROLES.BOOTH_VOLUNTEER]: {
    title: 'Booth Boy Dashboard',
    subtitle: 'Ground Level Data Management',
    stats: [
      {
        iconName: 'how-to-vote',
        title: 'Total',
        color: '#111827',
        key: 'total',
        onPress: 'voterList'
      },
      {
        iconName: 'verified',
        title: 'Verified',
        color: '#10B981',
        key: 'verified',
        onPress: 'voterList'
      },
      {
        iconName: 'pending',
        title: 'Unverified',
        color: '#EF4444',
        key: 'unverified',
        onPress: 'voterList'
      },
      {
        iconName: 'male',
        title: 'Male',
        color: '#3B82F6',
        key: 'male',
        onPress: 'voterList'
      },
      {
        iconName: 'female',
        title: 'Female',
        color: '#EC4899',
        key: 'female',
        onPress: 'voterList'
      },
      {
        iconName: 'people',
        title: 'Third Gender',
        color: '#8B5CF6',
        key: 'thirdGender',
        onPress: 'voterList'
      }
    ],
    actions: [
      {
        iconName: 'location-on',
        title: 'Booth Wise',
        description: 'Filter by booth',
        color: '#3B82F6',
        onPress: 'filterBooth'
      },
      {
        iconName: 'home',
        title: 'Address Wise',
        description: 'Filter by address',
        color: '#10B981',
        onPress: 'filterAddress'
      },
      {
        iconName: 'cake',
        title: 'Age Wise',
        description: 'Filter by age',
        color: '#F59E0B',
        onPress: 'filterAge'
      },
      {
        iconName: 'group',
        title: 'Caste Wise',
        description: 'Filter by caste',
        color: '#8B5CF6',
        onPress: 'filterCaste'
      },
      {
        iconName: 'verified',
        title: 'Verification Status',
        description: 'Filter by status',
        color: '#EF4444',
        onPress: 'filterVerification'
      },
      {
        iconName: 'person',
        title: 'Gender Wise',
        description: 'Filter by gender',
        color: '#EC4899',
        onPress: 'filterGender'
      }
    ],
    menuItems: [
      { title: 'All Voters', icon: 'how-to-vote', screen: 'voterList', color: '#10B981' },
      { title: 'Profile', icon: 'person', screen: 'profile', color: '#3B82F6' },
      { title: 'Sync Data', icon: 'sync', screen: 'syncData', color: '#8B5CF6' }
    ],
    customComponents: {
      showProfile: true,
      showAllVotersButton: true
    }
  }
};

// Form configurations for different user creation forms
export const FORM_CONFIGS = {
  CREATE_ADMIN: {
    title: 'Create Admin User',
    sections: [
      {
        title: 'Personal Information',
        fields: [
          {
            name: 'full_name',
            label: 'Full Name *',
            type: 'text',
            placeholder: 'Enter full name'
          },
          {
            name: 'email',
            label: 'Email Address *',
            type: 'email',
            placeholder: 'Enter email address',
            keyboardType: 'email-address'
          },
          {
            name: 'phone',
            label: 'Phone Number *',
            type: 'phone',
            placeholder: 'Enter 10-digit phone number',
            keyboardType: 'phone-pad',
            maxLength: 10
          }
        ]
      },
      {
        title: 'Account Setup',
        fields: [
          {
            name: 'username',
            label: 'Username *',
            type: 'text',
            placeholder: 'Enter username (letters, numbers, underscore)'
          },
          {
            name: 'password',
            label: 'Password *',
            type: 'password',
            placeholder: 'Must contain: A-Z, a-z, 0-9, min 8 chars'
          },
          {
            name: 'confirmPassword',
            label: 'Confirm Password *',
            type: 'password',
            placeholder: 'Re-enter password'
          },
          {
            name: 'role',
            label: 'Admin Type *',
            type: 'select',
            placeholder: 'Select admin type',
            options: [
              { label: 'Political Party', value: 'political_party' },
              { label: 'Candidate', value: 'candidate' },
              { label: 'Vidhan Sabha Prabhari', value: 'vidhan_sabha_prabhari' },
              { label: 'Block Prabhari', value: 'block_prabhari' },
              { label: 'Panchayat Prabhari', value: 'panchayat_prabhari' }
            ]
          }
        ]
      }
    ],
    validationRules: {
      full_name: [
        { type: 'required', message: 'Full name is required' },
        { type: 'minLength', value: 2, message: 'Full name must be at least 2 characters' }
      ],
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' }
      ],
      phone: [
        { type: 'required', message: 'Phone is required' },
        { type: 'phone', message: 'Invalid phone number' }
      ],
      username: [
        { type: 'required', message: 'Username is required' },
        { type: 'minLength', value: 4, message: 'Username must be at least 4 characters' },
        { type: 'username', message: 'Username can only contain letters, numbers, and underscores' }
      ],
      password: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
        { type: 'password', message: 'Password must contain uppercase, lowercase, and number' }
      ],
      confirmPassword: [
        { type: 'required', message: 'Please confirm password' },
        { type: 'match', field: 'password', message: 'Passwords do not match' }
      ],
      role: [
        { type: 'required', message: 'Please select admin type' }
      ]
    },
    submitButtonText: 'Create Admin User',
    submitIcon: 'admin-panel-settings',
    permissions: [
      'Create and manage users within assigned area',
      'Assign booths and constituencies',
      'View and export voter data',
      'Generate reports and analytics',
      'Manage local operations'
    ]
  },

  CREATE_BOOTH_VOLUNTEER: {
    title: 'Create Booth Volunteer',
    sections: [
      {
        title: 'Personal Information',
        fields: [
          {
            name: 'full_name',
            label: 'Full Name *',
            type: 'text',
            placeholder: 'Enter full name'
          },
          {
            name: 'email',
            label: 'Email Address *',
            type: 'email',
            placeholder: 'Enter email address',
            keyboardType: 'email-address'
          },
          {
            name: 'phone',
            label: 'Phone Number *',
            type: 'phone',
            placeholder: 'Enter 10-digit phone number',
            keyboardType: 'phone-pad',
            maxLength: 10
          }
        ]
      },
      {
        title: 'Account Setup',
        fields: [
          {
            name: 'username',
            label: 'Username *',
            type: 'text',
            placeholder: 'Enter username (letters, numbers, underscore)'
          },
          {
            name: 'password',
            label: 'Password *',
            type: 'password',
            placeholder: 'Must contain: A-Z, a-z, 0-9, min 8 chars'
          },
          {
            name: 'confirmPassword',
            label: 'Confirm Password *',
            type: 'password',
            placeholder: 'Re-enter password'
          }
        ]
      }
    ],
    validationRules: {
      full_name: [
        { type: 'required', message: 'Full name is required' },
        { type: 'minLength', value: 2, message: 'Full name must be at least 2 characters' }
      ],
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' }
      ],
      phone: [
        { type: 'required', message: 'Phone is required' },
        { type: 'phone', message: 'Invalid phone number' }
      ],
      username: [
        { type: 'required', message: 'Username is required' },
        { type: 'minLength', value: 4, message: 'Username must be at least 4 characters' },
        { type: 'username', message: 'Username can only contain letters, numbers, and underscores' }
      ],
      password: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
        { type: 'password', message: 'Password must contain uppercase, lowercase, and number' }
      ],
      confirmPassword: [
        { type: 'required', message: 'Please confirm password' },
        { type: 'match', field: 'password', message: 'Passwords do not match' }
      ]
    },
    submitButtonText: 'Create Booth Volunteer',
    submitIcon: 'person-add',
    permissions: [
      'View assigned booth voter lists',
      'Edit voter information',
      'Export voter data',
      'Sync data offline'
    ]
  }
};

// List configurations for different data types
export const LIST_CONFIGS = {
  USERS: {
    title: 'User Management',
    columns: [
      {
        key: 'FullName',
        accessor: (item) => item.FullName || item.Username,
        label: 'Name',
        searchable: true
      },
      {
        key: 'Role',
        label: 'Role',
        render: (value) => value?.replace('_', ' ').toUpperCase() || 'User'
      },
      {
        key: 'Email',
        label: 'Email',
        searchable: true
      },
      {
        key: 'Phone',
        label: 'Phone'
      },
      {
        key: 'assigned_scope',
        label: 'Assigned Area',
        render: (value) => value || 'Not assigned'
      }
    ],
    filters: [
      {
        key: 'role',
        label: 'Role',
        options: [
          { label: 'Political Party', value: 'political_party' },
          { label: 'Candidate', value: 'candidate' },
          { label: 'Vidhan Sabha Prabhari', value: 'vidhan_sabha_prabhari' },
          { label: 'Block Prabhari', value: 'block_prabhari' },
          { label: 'Panchayat Prabhari', value: 'panchayat_prabhari' },
          { label: 'Booth Volunteer', value: 'booth_volunteer' }
        ],
        filterFn: (item, value) => item.role === value
      }
    ],
    actions: [
      {
        title: 'Create User',
        icon: 'add',
        color: '#3B82F6',
        onPress: 'createUser'
      }
    ],
    itemActions: [
      {
        icon: 'edit',
        color: '#F59E0B',
        onPress: 'editUser'
      },
      {
        icon: 'delete',
        color: '#EF4444',
        onPress: 'deleteUser'
      }
    ]
  },

  VOTERS: {
    title: 'Voter Management',
    columns: [
      {
        key: 'name',
        label: 'Name',
        searchable: true,
        accessor: (item) => item.name || item.name_phonetic
      },
      {
        key: 'name_phonetic',
        label: 'English Name',
        searchable: true
      },
      {
        key: 'epic_id',
        label: 'EPIC ID',
        searchable: true
      },
      {
        key: 'age',
        label: 'Age',
        render: (value, item) => `${value} • ${item.gender === 'M' ? 'Male' : item.gender === 'F' ? 'Female' : 'Other'}`
      },
      {
        key: 'mobile',
        label: 'Mobile',
        render: (value) => value || 'N/A'
      },
      {
        key: 'booth_id',
        label: 'Booth',
        render: (value) => value || 'N/A'
      },
      {
        key: 'area',
        label: 'Area'
      },
      {
        key: 'house_number',
        label: 'House No.'
      },
      {
        key: 'voting_preference',
        label: 'Preference',
        render: (value) => value || 'Not Set'
      },
      {
        key: 'verification_status',
        label: 'Status',
        render: (value) => value || 'Unverified'
      }
    ],
    filters: [
      {
        key: 'gender',
        label: 'Gender',
        options: [
          { label: 'Male', value: 'M' },
          { label: 'Female', value: 'F' },
          { label: 'Other', value: 'O' }
        ],
        filterFn: (item, value) => item.gender === value
      },
      {
        key: 'age_group',
        label: 'Age Group',
        options: [
          { label: '18-25', value: '18-25' },
          { label: '26-35', value: '26-35' },
          { label: '36-50', value: '36-50' },
          { label: '50+', value: '50+' }
        ],
        filterFn: (item, value) => {
          const age = parseInt(item.age);
          switch (value) {
            case '18-25': return age >= 18 && age <= 25;
            case '26-35': return age >= 26 && age <= 35;
            case '36-50': return age >= 36 && age <= 50;
            case '50+': return age >= 50;
            default: return true;
          }
        }
      },
      {
        key: 'booth_id',
        label: 'Booth',
        options: [
          { label: 'B001', value: 'B001' },
          { label: 'B002', value: 'B002' },
          { label: 'B003', value: 'B003' }
        ],
        filterFn: (item, value) => item.booth_id === value
      },
      {
        key: 'verification_status',
        label: 'Verification Status',
        options: [
          { label: 'Verified', value: 'Verified' },
          { label: 'Unverified', value: 'Unverified' }
        ],
        filterFn: (item, value) => item.verification_status === value
      },
      {
        key: 'caste',
        label: 'Caste',
        options: [
          { label: 'General', value: 'General' },
          { label: 'OBC', value: 'OBC' },
          { label: 'SC', value: 'SC' },
          { label: 'ST', value: 'ST' }
        ],
        filterFn: (item, value) => item.caste === value
      }
    ],
    actions: [
      {
        title: 'Export',
        icon: 'download',
        color: '#10B981',
        onPress: 'exportVoters'
      },
      {
        title: 'Sync',
        icon: 'sync',
        color: '#3B82F6',
        onPress: 'syncVoters'
      }
    ],
    itemActions: [
      {
        icon: 'edit',
        color: '#F59E0B',
        onPress: 'editVoter'
      },
      {
        icon: 'phone',
        color: '#3B82F6',
        onPress: 'callVoter'
      }
    ],
    customItemRender: true // Use custom voter card rendering
  },

  BOOTHS: {
    title: 'Booth Management',
    columns: [
      {
        key: 'booth_no',
        label: 'Booth No.',
        searchable: true,
        style: { flex: 1 }
      },
      {
        key: 'booth_name',
        label: 'Booth Name',
        searchable: true,
        style: { flex: 2 }
      },
      {
        key: 'constituency',
        label: 'Constituency',
        style: { flex: 1 }
      },
      {
        key: 'assigned_user',
        label: 'Assigned To',
        accessor: (item) => item.assigned_user?.full_name || 'Unassigned',
        style: { flex: 1 }
      }
    ],
    filters: [
      {
        key: 'assignment_status',
        label: 'Assignment Status',
        options: [
          { label: 'Assigned', value: 'assigned' },
          { label: 'Unassigned', value: 'unassigned' }
        ],
        filterFn: (item, value) => {
          const isAssigned = !!item.assigned_user;
          return value === 'assigned' ? isAssigned : !isAssigned;
        }
      }
    ],
    actions: [
      {
        title: 'Assign Booths',
        icon: 'assignment',
        color: '#3B82F6',
        onPress: 'assignBooths'
      }
    ],
    itemActions: [
      {
        icon: 'assignment',
        color: '#3B82F6',
        onPress: 'assignBooth'
      },
      {
        icon: 'info',
        color: '#10B981',
        onPress: 'viewBooth'
      }
    ]
  }
};

// Permission system
export const PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: {
    dashboard: ['view_all_stats', 'system_health', 'all_actions'],
    users: ['create', 'read', 'update', 'delete', 'list_all'],
    voters: ['create', 'read', 'update', 'delete', 'list_all', 'export', 'import'],
    booths: ['create', 'read', 'update', 'delete', 'list_all', 'assign'],
    constituencies: ['create', 'read', 'update', 'delete', 'list_all', 'assign'],
    reports: ['create', 'read', 'export', 'system_reports'],
    settings: ['system_settings', 'user_settings']
  },
  
  [USER_ROLES.POLITICAL_PARTY]: {
    dashboard: ['view_assigned_stats', 'party_actions'],
    users: ['create_booth_volunteer', 'read_created', 'update_created', 'delete_created'],
    voters: ['read_assigned', 'update_assigned', 'export_assigned'],
    booths: ['read_assigned', 'assign_to_volunteers'],
    constituencies: ['read_assigned'],
    reports: ['create', 'read_assigned', 'export'],
    settings: ['user_settings']
  },
  
  [USER_ROLES.CANDIDATE]: {
    dashboard: ['view_campaign_stats', 'campaign_actions'],
    voters: ['read_constituency', 'export_constituency'],
    booths: ['read_constituency'],
    constituencies: ['read_assigned'],
    reports: ['create_campaign', 'read_campaign', 'export'],
    settings: ['user_settings']
  },
  
  [USER_ROLES.VIDHAN_SABHA_PRABHARI]: {
    dashboard: ['view_assembly_stats', 'assembly_actions'],
    users: ['read_subordinates', 'create_block_prabhari'],
    voters: ['read_assembly', 'update_assembly', 'export_assembly'],
    booths: ['read_assembly'],
    constituencies: ['read_assigned'],
    reports: ['create_assembly', 'read_assembly', 'export'],
    settings: ['user_settings']
  },
  
  [USER_ROLES.BLOCK_PRABHARI]: {
    dashboard: ['view_block_stats', 'block_actions'],
    users: ['read_subordinates', 'create_panchayat_prabhari'],
    voters: ['read_block', 'update_block', 'export_block'],
    booths: ['read_block'],
    reports: ['create_block', 'read_block', 'export'],
    settings: ['user_settings']
  },
  
  [USER_ROLES.PANCHAYAT_PRABHARI]: {
    dashboard: ['view_panchayat_stats', 'panchayat_actions'],
    users: ['read_subordinates', 'create_booth_volunteer'],
    voters: ['read_panchayat', 'update_panchayat', 'export_panchayat'],
    booths: ['read_panchayat', 'assign_volunteers'],
    reports: ['create_panchayat', 'read_panchayat', 'export'],
    settings: ['user_settings']
  },
  
  [USER_ROLES.BOOTH_VOLUNTEER]: {
    dashboard: ['view_booth_stats', 'booth_actions'],
    voters: ['read_booth', 'update_booth', 'export_booth'],
    booths: ['read_assigned'],
    reports: ['create_booth', 'read_booth'],
    settings: ['user_settings']
  }
};

// Helper functions
export const getDashboardConfig = (userRole) => {
  return DASHBOARD_CONFIGS[userRole] || DASHBOARD_CONFIGS[USER_ROLES.BOOTH_VOLUNTEER];
};

export const getFormConfig = (formType) => {
  return FORM_CONFIGS[formType];
};

export const getListConfig = (listType) => {
  return LIST_CONFIGS[listType];
};

export const hasPermission = (userRole, resource, action) => {
  const permissions = PERMISSIONS[userRole];
  if (!permissions || !permissions[resource]) return false;
  return permissions[resource].includes(action);
};

export const getRoleDisplayName = (userRole) => {
  const roleNames = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
    [USER_ROLES.POLITICAL_PARTY]: 'Political Party',
    [USER_ROLES.CANDIDATE]: 'Candidate',
    [USER_ROLES.VIDHAN_SABHA_PRABHARI]: 'Vidhan Sabha Prabhari',
    [USER_ROLES.BLOCK_PRABHARI]: 'Block Prabhari',
    [USER_ROLES.PANCHAYAT_PRABHARI]: 'Panchayat Prabhari',
    [USER_ROLES.BOOTH_VOLUNTEER]: 'Booth Volunteer'
  };
  return roleNames[userRole] || 'User';
};