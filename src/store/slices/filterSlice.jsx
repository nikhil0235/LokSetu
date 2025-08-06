import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialState = {
  // Search & Basic Filters
  searchTerm: '',
  gender: 'all', // all, male, female, third_gender
  ageRange: {
    min: 18,
    max: 100,
  },
  
  // Location Filters
  constituency: null,
  booth: null,
  area: '',
  
  // Political Data Filters
  lastVotedParty: 'all',
  votingPreference: 'all',
  certaintyOfVote: 'all',
  voteType: 'all',
  availability: 'all',
  
  // Demographic Filters
  religion: 'all',
  category: 'all',
  caste: 'all',
  languagePreference: 'all',
  
  // Employment Filters
  educationLevel: 'all',
  employmentStatus: 'all',
  salaryRange: {
    min: 0,
    max: 1000000,
  },
  
  // Location Status Filters
  residingIn: 'all',
  permanentInBihar: 'all', // all, yes, no
  migrated: 'all', // all, yes, no
  
  // Data Completeness Filters
  hasPhoto: 'all', // all, yes, no
  hasMobile: 'all', // all, yes, no
  hasFeedback: 'all', // all, yes, no
  isDataComplete: 'all', // all, yes, no
  
  // Custom Filters
  customFilters: [],
  
  // Filter Management
  savedFilters: {},
  activeFilterSet: null,
  isActive: false,
  appliedFiltersCount: 0,
  quickFilters: {
    recentlyUpdated: false,
    incompleteData: false,
    noPhoto: false,
    noMobile: false,
    youngVoters: false, // 18-25
    seniorVoters: false, // 65+
  },
};

// Filters Slice
const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Basic Filters
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setGenderFilter: (state, action) => {
      state.gender = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setAgeRange: (state, action) => {
      state.ageRange = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    // Location Filters
    setConstituencyFilter: (state, action) => {
      state.constituency = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setBoothFilter: (state, action) => {
      state.booth = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setAreaFilter: (state, action) => {
      state.area = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    // Political Data Filters
    setLastVotedPartyFilter: (state, action) => {
      state.lastVotedParty = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setVotingPreferenceFilter: (state, action) => {
      state.votingPreference = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setCertaintyOfVoteFilter: (state, action) => {
      state.certaintyOfVote = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setVoteTypeFilter: (state, action) => {
      state.voteType = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setAvailabilityFilter: (state, action) => {
      state.availability = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    // Demographic Filters
    setReligionFilter: (state, action) => {
      state.religion = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setCategoryFilter: (state, action) => {
      state.category = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setCasteFilter: (state, action) => {
      state.caste = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setLanguagePreferenceFilter: (state, action) => {
      state.languagePreference = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    // Employment Filters
    setEducationLevelFilter: (state, action) => {
      state.educationLevel = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setEmploymentStatusFilter: (state, action) => {
      state.employmentStatus = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setSalaryRangeFilter: (state, action) => {
      state.salaryRange = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    // Data Completeness Filters
    setHasPhotoFilter: (state, action) => {
      state.hasPhoto = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setHasMobileFilter: (state, action) => {
      state.hasMobile = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    setDataCompletenessFilter: (state, action) => {
      state.isDataComplete = action.payload;
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    // Custom Filters
    addCustomFilter: (state, action) => {
      const newFilter = {
        id: Date.now() + Math.random(),
        field: action.payload.field,
        operator: action.payload.operator,
        value: action.payload.value,
        label: action.payload.label || `${action.payload.field} ${action.payload.operator} ${action.payload.value}`,
      };
      state.customFilters.push(newFilter);
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    removeCustomFilter: (state, action) => {
      const filterId = action.payload;
      state.customFilters = state.customFilters.filter(filter => filter.id !== filterId);
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    updateCustomFilter: (state, action) => {
      const { id, updates } = action.payload;
      const filterIndex = state.customFilters.findIndex(filter => filter.id === id);
      if (filterIndex !== -1) {
        state.customFilters[filterIndex] = { ...state.customFilters[filterIndex], ...updates };
      }
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    // Quick Filters
    setQuickFilter: (state, action) => {
      const { filterName, value } = action.payload;
      state.quickFilters[filterName] = value;
      
      // Apply corresponding filter logic
      switch (filterName) {
        case 'youngVoters':
          if (value) {
            state.ageRange = { min: 18, max: 25 };
          }
          break;
        case 'seniorVoters':
          if (value) {
            state.ageRange = { min: 65, max: 100 };
          }
          break;
        case 'noPhoto':
          state.hasPhoto = value ? 'no' : 'all';
          break;
        case 'noMobile':
          state.hasMobile = value ? 'no' : 'all';
          break;
        case 'incompleteData':
          state.isDataComplete = value ? 'no' : 'all';
          break;
      }
      
      filtersSlice.caseReducers.updateFilterStatus(state);
    },
    
    // Filter Set Management
    saveFilterSet: (state, action) => {
      const { name, filters } = action.payload;
      state.savedFilters[name] = {
        ...filters,
        savedAt: Date.now(),
      };
    },
    
    loadFilterSet: (state, action) => {
      const filterSetName = action.payload;
      const filterSet = state.savedFilters[filterSetName];
      
      if (filterSet) {
        Object.keys(filterSet).forEach(key => {
          if (key !== 'savedAt' && state.hasOwnProperty(key)) {
            state[key] = filterSet[key];
          }
        });
        state.activeFilterSet = filterSetName;
        filtersSlice.caseReducers.updateFilterStatus(state);
      }
    },
    
    deleteFilterSet: (state, action) => {
      const filterSetName = action.payload;
      delete state.savedFilters[filterSetName];
      if (state.activeFilterSet === filterSetName) {
        state.activeFilterSet = null;
      }
    },
    
    // Filter Actions
    applyFilters: (state) => {
      state.isActive = true;
    },
    
    clearFilters: (state) => {
      return { ...initialState, savedFilters: state.savedFilters };
    },
    
    clearActiveFilters: (state) => {
      state.isActive = false;
    },
    
    // Internal Helper
    updateFilterStatus: (state) => {
      let count = 0;
      
      if (state.searchTerm) count++;
      if (state.gender !== 'all') count++;
      if (state.ageRange.min > 18 || state.ageRange.max < 100) count++;
      if (state.constituency) count++;
      if (state.booth) count++;
      if (state.area) count++;
      if (state.lastVotedParty !== 'all') count++;
      if (state.votingPreference !== 'all') count++;
      if (state.certaintyOfVote !== 'all') count++;
      if (state.voteType !== 'all') count++;
      if (state.availability !== 'all') count++;
      if (state.religion !== 'all') count++;
      if (state.category !== 'all') count++;
      if (state.caste !== 'all') count++;
      if (state.languagePreference !== 'all') count++;
      if (state.educationLevel !== 'all') count++;
      if (state.employmentStatus !== 'all') count++;
      if (state.hasPhoto !== 'all') count++;
      if (state.hasMobile !== 'all') count++;
      if (state.isDataComplete !== 'all') count++;
      
      count += state.customFilters.length;
      count += Object.values(state.quickFilters).filter(Boolean).length;
      
      state.appliedFiltersCount = count;
      state.isActive = count > 0;
    },
  },
});

export const {
  setSearchTerm,
  setGenderFilter,
  setAgeRange,
  setConstituencyFilter,
  setBoothFilter,
  setAreaFilter,
  setLastVotedPartyFilter,
  setVotingPreferenceFilter,
  setCertaintyOfVoteFilter,
  setVoteTypeFilter,
  setAvailabilityFilter,
  setReligionFilter,
  setCategoryFilter,
  setCasteFilter,
  setLanguagePreferenceFilter,
  setEducationLevelFilter,
  setEmploymentStatusFilter,
  setSalaryRangeFilter,
  setHasPhotoFilter,
  setHasMobileFilter,
  setDataCompletenessFilter,
  addCustomFilter,
  removeCustomFilter,
  updateCustomFilter,
  saveFilterSet,
  loadFilterSet,
  deleteFilterSet,
  applyFilters,
  clearFilters,
  clearActiveFilters,
  setQuickFilter,
} = filtersSlice.actions;