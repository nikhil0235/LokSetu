/**
 * Utility functions for filtering voters
 */

export const FILTER_TYPES = {
  BOOTH: 'booth',
  ADDRESS: 'address',
  AGE: 'age',
  CASTE: 'caste',
  VERIFICATION: 'verification',
  GENDER: 'gender'
};

export const AGE_GROUPS = [
  { label: '18-25', value: '18-25' },
  { label: '26-35', value: '26-35' },
  { label: '36-45', value: '36-45' },
  { label: '46-55', value: '46-55' },
  { label: '56-65', value: '56-65' },
  { label: '65+', value: '65+' }
];

export const CASTE_CATEGORIES = [
  { label: 'General', value: 'General' },
  { label: 'OBC', value: 'OBC' },
  { label: 'SC', value: 'SC' },
  { label: 'ST', value: 'ST' }
];

export const VERIFICATION_STATUS = [
  { label: 'Verified', value: 'Verified' },
  { label: 'Unverified', value: 'Unverified' }
];

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
  { label: 'Other', value: 'O' }
];

export const POLITICAL_PARTIES = [
  'BJP',
  'Congress',
  'RJD',
  'JDU',
  'AAP',
  'Others',
  'Undecided'
];

export const VOTE_CERTAINTY = [
  'High',
  'Medium',
  'Low'
];

/**
 * Apply filters to voter list
 */
export const applyFilters = (voters, filters) => {
  let filtered = [...voters];

  if (filters.type && filters.value) {
    switch (filters.type) {
      case FILTER_TYPES.BOOTH:
        filtered = filtered.filter(voter => voter.booth_id === filters.value);
        break;
      
      case FILTER_TYPES.AGE:
        const [min, max] = filters.value.includes('+') 
          ? [parseInt(filters.value), 999] 
          : filters.value.split('-').map(Number);
        filtered = filtered.filter(voter => voter.age >= min && voter.age <= max);
        break;
      
      case FILTER_TYPES.CASTE:
        filtered = filtered.filter(voter => voter.caste === filters.value);
        break;
      
      case FILTER_TYPES.VERIFICATION:
        filtered = filtered.filter(voter => voter.verification_status === filters.value);
        break;
      
      case FILTER_TYPES.GENDER:
        filtered = filtered.filter(voter => voter.gender === filters.value);
        break;
      
      case FILTER_TYPES.ADDRESS:
        filtered = filtered.filter(voter => 
          voter.area && voter.area.toLowerCase().includes(filters.value.toLowerCase())
        );
        break;
    }
  }

  return filtered;
};

/**
 * Search voters by query
 */
export const searchVoters = (voters, query) => {
  if (!query) return voters;

  const searchTerm = query.toLowerCase();
  return voters.filter(voter =>
    voter.name?.toLowerCase().includes(searchTerm) ||
    voter.name_phonetic?.toLowerCase().includes(searchTerm) ||
    voter.epic_id?.toLowerCase().includes(searchTerm) ||
    voter.mobile?.includes(searchTerm) ||
    voter.area?.toLowerCase().includes(searchTerm)
  );
};

/**
 * Sort voters by field
 */
export const sortVoters = (voters, sortBy) => {
  return [...voters].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name_phonetic || a.name || '').localeCompare(b.name_phonetic || b.name || '');
      case 'age':
        return (a.age || 0) - (b.age || 0);
      case 'booth':
        return (a.booth_id || '').localeCompare(b.booth_id || '');
      case 'verification':
        return (a.verification_status || '').localeCompare(b.verification_status || '');
      default:
        return 0;
    }
  });
};

/**
 * Get filter display text
 */
export const getFilterDisplayText = (filters) => {
  if (!filters.type) return 'All Voters';
  
  const titles = {
    [FILTER_TYPES.BOOTH]: `Booth: ${filters.value || 'All'}`,
    [FILTER_TYPES.AGE]: `Age: ${filters.value || 'All'}`,
    [FILTER_TYPES.CASTE]: `Caste: ${filters.value || 'All'}`,
    [FILTER_TYPES.VERIFICATION]: `Status: ${filters.value || 'All'}`,
    [FILTER_TYPES.GENDER]: `Gender: ${filters.value || 'All'}`,
    [FILTER_TYPES.ADDRESS]: `Address: ${filters.value || 'All'}`
  };
  
  return titles[filters.type] || 'Filtered Voters';
};