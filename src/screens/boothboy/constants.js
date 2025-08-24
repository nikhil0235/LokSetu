// Booth Boy Constants
export const MOCK_BOOTH_BOY_DATA = {
  id: 'BB001',
  name: 'राम कुमार',
  phone: '<phone_number>',
  assignedBooths: ['B001', 'B002', 'B003'],
  constituency: 'Constituency-1',
  area: 'North Zone',
  totalVoters: 2847,
  role: 'booth_volunteer'
};

export const MOCK_VOTER_STATS = {
  total: 2847,
  verified: 1923,
  unverified: 924,
  male: 1456,
  female: 1341,
  thirdGender: 50
};

export const MOCK_PERFORMANCE_DATA = {
  todayUpdates: 47,
  weeklyUpdates: 320,
  dataCompleteness: 89,
  boothCoverage: 95,
  voterContactRate: 78,
  issuesReported: 3,
  pendingVerifications: 24
};

export const FILTER_MAP = {
  'filterBooth': 'booth',
  'filterAddress': 'address',
  'filterAge': 'age',
  'filterCaste': 'caste',
  'filterVerification': 'verification',
  'filterGender': 'gender'
};

// Voter Data Form Constants
export const POLITICAL_PARTIES = [
  { label: 'NDA', value: 'NDA' },
  { label: 'INDIA (UPA)', value: 'INDIA_UPA' },
  { label: 'LJP', value: 'LJP' },
  { label: 'AIMIM', value: 'AIMIM' },
  { label: 'BSP', value: 'BSP' },
  { label: 'Others', value: 'Others' },
  { label: 'Independent', value: 'Independent' }
];

export const EDUCATION_LEVELS = [
  { label: 'Illiterate', value: 'Illiterate' },
  { label: 'Just Literate', value: 'JustLiterate' },
  { label: 'Below 10th', value: 'Below10th' },
  { label: '10th Pass', value: '10thPass' },
  { label: '12th Pass', value: '12thPass' },
  { label: 'Technical Graduate', value: 'TechnicalGraduate' },
  { label: 'Normal Graduate', value: 'NormalGraduate' },
  { label: 'Masters (PG)', value: 'Masters' },
  { label: 'PhD', value: 'PhD' }
];

export const EMPLOYMENT_TYPES = [
  { label: 'Employed (Govt / Private)', value: 'Employed' },
  { label: 'Gig Worker', value: 'GigWorker' },
  { label: 'Self-Employed', value: 'SelfEmployed' },
  { label: 'Business Owner', value: 'BusinessOwner' },
  { label: 'Agriculture', value: 'Agriculture' },
  { label: 'Unemployed', value: 'Unemployed' },
  { label: 'Digital Creator', value: 'DigitalCreator' }
];

export const COMMON_ISSUES = [
  { label: 'Education', value: 'Education' },
  { label: 'Employment', value: 'Employment' },
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Road/Infrastructure', value: 'RoadInfrastructure' },
  { label: 'Electricity', value: 'Electricity' },
  { label: 'Water Supply', value: 'WaterSupply' },
  { label: 'Traffic Management', value: 'TrafficManagement' },
  { label: 'Corruption', value: 'Corruption' },
  { label: 'Agriculture & Irrigation', value: 'AgricultureIrrigation' },
  { label: 'Flood Management', value: 'FloodManagement' },
  { label: 'School/College Access', value: 'SchoolCollegeAccess' },
  { label: 'Private Job Opportunities', value: 'PrivateJobOpportunities' },
  { label: 'Community Halls', value: 'CommunityHalls' },
  { label: 'Any Other Issue', value: 'OtherIssue' }
];

// Form validation rules
export const FORM_VALIDATION = {
  mobile: {
    required: true,
    pattern: /^[6-9]\d{9}$/,
    message: 'Please enter a valid 10-digit mobile number'
  },
  epicId: {
    required: true,
    minLength: 10,
    message: 'Epic ID should be at least 10 characters'
  }
};