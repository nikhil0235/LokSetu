import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  TextInput,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import { CompactHeader, FilterTabs, VoterCard, AppIcon } from '../../components/common';
import FilterModal from '../../components/common/FilterModal';
import { getCasteCategory, getCastesByCategoryForFilter } from '../../utils/casteMapping';

const VoterListScreen = ({ filters, boothBoyInfo, onBack, onEditVoter }) => {
  const [voters, setVoters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState(filters?.type || 'all');
  const [activeSubFilter, setActiveSubFilter] = useState(filters?.value || 'all');
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [ageRange, setAgeRange] = useState({ min: '', max: '' });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const ageModalScale = useRef(new Animated.Value(0)).current;
  const ageModalBackdrop = useRef(new Animated.Value(0)).current;


  // Mock voter data with more entries
  const mockVoters = useMemo(() => [
    {
      epic_id: 'ABC1234567', name: 'राम कुमार सिंह', name_phonetic: 'Ram Kumar Singh',
      age: 45, gender: 'M', mobile: '9876543210', booth_id: 'B001', caste: 'Brahmin', category: 'General',
      religion: 'Hindu', last_voted_party: 'BJP', voting_preference: 'BJP', verification_status: 'Verified', 
      house_number: '123A', certainty_of_vote: 'High', availability: 'Available', education_level: 'Graduate',
      employment_status: 'Government', monthly_salary_range: '50k-1L', residing_in: 'Same Constituency', migrated: 'No', area: 'Ward 1'
    },
    {
      epic_id: 'DEF7890123', name: 'सीता देवी', name_phonetic: 'Sita Devi',
      age: 38, gender: 'F', mobile: '9876543211', booth_id: 'B002', caste: 'Yadav', category: 'OBC',
      religion: 'Hindu', last_voted_party: 'RJD', voting_preference: 'RJD', verification_status: 'Unverified', 
      house_number: '456B', certainty_of_vote: 'Medium', availability: 'Available', education_level: 'Secondary',
      employment_status: 'Homemaker', monthly_salary_range: 'Below 10k', residing_in: 'Same Constituency', migrated: 'No', area: 'Ward 2'
    },
    {
      epic_id: 'GHI4567890', name: 'अमित शर्मा', name_phonetic: 'Amit Sharma',
      age: 29, gender: 'M', mobile: '9876543212', booth_id: 'B001', caste: 'General', category: 'General',
      religion: 'Hindu', last_voted_party: 'Congress', voting_preference: 'BJP', verification_status: 'Verified', 
      house_number: '789C', certainty_of_vote: 'High', availability: 'Available', education_level: 'Post Graduate',
      employment_status: 'Private', monthly_salary_range: '1L-2L', residing_in: 'Same Constituency', migrated: 'No', area: 'Ward 1'
    },
    {
      epic_id: 'JKL1234567', name: 'प्रिया कुमारी', name_phonetic: 'Priya Kumari',
      age: 25, gender: 'F', mobile: '9876543213', booth_id: 'B001', caste: 'Chamar', category: 'SC',
      religion: 'Hindu', last_voted_party: 'RJD', voting_preference: 'RJD', verification_status: 'Verified', 
      house_number: '321D', certainty_of_vote: 'Medium', availability: 'Available', education_level: 'Higher Secondary',
      employment_status: 'Student', monthly_salary_range: 'Below 10k', residing_in: 'Same Constituency', migrated: 'No', area: 'Ward 3'
    },
    {
      epic_id: 'MNO7890123', name: 'राजेश यादव', name_phonetic: 'Rajesh Yadav',
      age: 52, gender: 'M', mobile: '9876543214', booth_id: 'B002', caste: 'Yadav', category: 'OBC',
      religion: 'Hindu', last_voted_party: 'RJD', voting_preference: 'RJD', verification_status: 'Verified', 
      house_number: '654E', certainty_of_vote: 'High', availability: 'Available', education_level: 'Primary',
      employment_status: 'Self-employed', monthly_salary_range: '25k-50k', residing_in: 'Same Constituency', migrated: 'No', area: 'Ward 2'
    },
    {
      epic_id: 'PQR4567890', name: 'सुनीता सिंह', name_phonetic: 'Sunita Singh',
      age: 33, gender: 'F', mobile: '<mobile_number>', booth_id: 'B001', caste: 'Rajput', category: 'General',
      religion: 'Hindu', last_voted_party: 'BJP', voting_preference: 'BJP', verification_status: 'Unverified', 
      house_number: '987F', certainty_of_vote: 'Low', availability: 'Uncertain', education_level: 'Graduate',
      employment_status: 'Unemployed', monthly_salary_range: 'Below 10k', residing_in: 'Different Constituency', migrated: 'Yes', area: 'Ward 1'
    }
  ], []);

  // Apply comprehensive filters
  const applyComprehensiveFilters = (voters, filters) => {
    let filtered = [...voters];

    Object.entries(filters).forEach(([key, value]) => {
      if (!value || value === '') return;

      switch (key) {
        case 'verification':
          filtered = filtered.filter(v => v.verification_status === value);
          break;
        case 'gender':
          filtered = filtered.filter(v => v.gender === value);
          break;
        case 'ageMin':
          filtered = filtered.filter(v => v.age >= parseInt(value));
          break;
        case 'ageMax':
          filtered = filtered.filter(v => v.age <= parseInt(value));
          break;
        case 'caste':
          filtered = filtered.filter(v => v.caste === value);
          break;
        case 'category':
          filtered = filtered.filter(v => v.category === value);
          break;
        case 'religion':
          filtered = filtered.filter(v => v.religion === value);
          break;
        case 'votingPreference':
          filtered = filtered.filter(v => v.voting_preference === value);
          break;
        case 'lastVotedParty':
          filtered = filtered.filter(v => v.last_voted_party === value);
          break;
        case 'certaintyOfVote':
          filtered = filtered.filter(v => v.certainty_of_vote === value);
          break;
        case 'availability':
          filtered = filtered.filter(v => v.availability === value);
          break;
        case 'educationLevel':
          filtered = filtered.filter(v => v.education_level === value);
          break;
        case 'employmentStatus':
          filtered = filtered.filter(v => v.employment_status === value);
          break;
        case 'salaryRange':
          filtered = filtered.filter(v => v.monthly_salary_range === value);
          break;
        case 'residingIn':
          filtered = filtered.filter(v => v.residing_in === value);
          break;
        case 'migrated':
          filtered = filtered.filter(v => v.migrated === value);
          break;
        case 'booth':
          filtered = filtered.filter(v => v.booth_id?.toLowerCase().includes(value.toLowerCase()));
          break;
        case 'area':
          filtered = filtered.filter(v => v.area?.toLowerCase().includes(value.toLowerCase()));
          break;
      }
    });

    return filtered;
  };

  // Filter voters based on active filters and search
  const filteredVoters = useMemo(() => {
    let filtered = mockVoters;

    // Apply comprehensive filters first
    filtered = applyComprehensiveFilters(filtered, appliedFilters);

    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase().trim();
      filtered = filtered.filter(voter => 
        voter.name.toLowerCase().includes(searchLower) ||
        voter.name_phonetic.toLowerCase().includes(searchLower) ||
        voter.epic_id.toLowerCase().includes(searchLower) ||
        (voter.mobile && voter.mobile.includes(searchText.trim())) ||
        voter.house_number.toLowerCase().includes(searchLower) ||
        voter.voting_preference.toLowerCase().includes(searchLower) ||
        (voter.area && voter.area.toLowerCase().includes(searchLower))
      );
    }

    // Apply main filter
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'status':
          if (activeSubFilter !== 'all') {
            filtered = filtered.filter(v => v.verification_status === activeSubFilter);
          }
          break;
        case 'gender':
          if (activeSubFilter !== 'all') {
            filtered = filtered.filter(v => v.gender === activeSubFilter);
          }
          break;
        case 'age':
          if (activeSubFilter !== 'all') {
            if (activeSubFilter === 'custom' && ageRange.min && ageRange.max) {
              filtered = filtered.filter(v => v.age >= parseInt(ageRange.min) && v.age <= parseInt(ageRange.max));
            } else if (activeSubFilter.includes('-')) {
              const [min, max] = activeSubFilter.split('-').map(Number);
              filtered = filtered.filter(v => v.age >= min && v.age <= max);
            }
          }
          break;
        case 'caste':
          if (activeSubFilter !== 'all') {
            filtered = filtered.filter(v => getCasteCategory(v.caste) === activeSubFilter);
          }
          break;
        case 'party':
          if (activeSubFilter !== 'all') {
            filtered = filtered.filter(v => v.voting_preference === activeSubFilter || v.last_voted_party === activeSubFilter);
          }
          break;
        case 'alliance':
          const allAlliances = {
            'NDA': ['BJP', 'JDU', 'Janswag'],
            'INDIA': ['RJD', 'Congress'],
            'Janaswaraj': ['Janaswaraj'],
            'Others': ['Others']
          };
          
          const selectedAlliance = activeSubFilter || filters?.value || 'NDA';
          const allianceParties = allAlliances[selectedAlliance] || [];
          
          filtered = filtered.filter(v => 
            allianceParties.includes(v.voting_preference) || allianceParties.includes(v.last_voted_party)
          );
          break;
        case 'all':
          // No additional filtering for 'all' case
          break;
        case 'family':
          if (activeSubFilter) {
            const familyName = activeSubFilter.split(' ')[0];
            filtered = filtered.filter(v => v.name.includes(familyName));
          }
          break;
      }
    }

    return filtered;
  }, [mockVoters, searchText, activeFilter, activeSubFilter, ageRange, appliedFilters]);

  // Initialize filters based on incoming filter
  useEffect(() => {
    if (filters?.type) {
      setActiveFilter(filters.type);
      if (filters.type === 'alliance') {
        setActiveSubFilter(''); 
      } else if (filters.type === 'all') {
        setActiveSubFilter('all');
      } else {
        setActiveSubFilter(filters.value || 'all');
      }
    } else {
      setActiveFilter('all');
      setActiveSubFilter('all');
    }
  }, [filters]);

  useEffect(() => {
    setVoters(filteredVoters);
  }, [filteredVoters]);

  // Generate filter tabs based on current filter type
  const getFilterTabs = () => {
    const baseTabs = [
      { key: 'all', label: 'All', count: mockVoters.length }
    ];

    switch (activeFilter) {
      case 'status':
        return [
          ...baseTabs,
          { key: 'Verified', label: 'Verified', count: mockVoters.filter(v => v.verification_status === 'Verified').length },
          { key: 'Unverified', label: 'Pending', count: mockVoters.filter(v => v.verification_status === 'Unverified').length }
        ];
      case 'gender':
        return [
          ...baseTabs,
          { key: 'M', label: 'Male', count: mockVoters.filter(v => v.gender === 'M').length },
          { key: 'F', label: 'Female', count: mockVoters.filter(v => v.gender === 'F').length },
          { key: 'O', label: 'Others', count: mockVoters.filter(v => v.gender === 'O').length }
        ];
      case 'age':
        return [
          ...baseTabs,
          { key: '18-35', label: '18-35', count: mockVoters.filter(v => v.age >= 18 && v.age <= 35).length },
          { key: '36-55', label: '36-55', count: mockVoters.filter(v => v.age >= 36 && v.age <= 55).length },
          { key: '56-100', label: '56+', count: mockVoters.filter(v => v.age >= 56).length },
          { key: 'custom', label: 'Custom', count: 0 }
        ];
      case 'caste':
        return [
          ...baseTabs,
          { key: 'General', label: 'General', count: mockVoters.filter(v => getCasteCategory(v.caste) === 'General').length },
          { key: 'OBC', label: 'OBC', count: mockVoters.filter(v => getCasteCategory(v.caste) === 'OBC').length },
          { key: 'SC', label: 'SC', count: mockVoters.filter(v => getCasteCategory(v.caste) === 'SC').length },
          { key: 'ST', label: 'ST', count: mockVoters.filter(v => getCasteCategory(v.caste) === 'ST').length }
        ];
      case 'party':
        const parties = ['BJP', 'RJD', 'JDU', 'Congress', 'Others'];
        return [
          ...baseTabs,
          ...parties.map(party => ({
            key: party,
            label: party,
            count: mockVoters.filter(v => v.voting_preference === party || v.last_voted_party === party).length
          }))
        ];
      case 'alliance':
        // Show all alliances as tabs to allow switching
        const allAlliances = [
          { name: 'NDA', parties: ['BJP', 'JDU', 'Janswag'] },
          { name: 'INDIA', parties: ['RJD', 'Congress'] },
          { name: 'Janaswaraj', parties: ['Janaswaraj'] },
          { name: 'Others', parties: ['Others'] }
        ];
        return allAlliances.map(alliance => ({
          key: alliance.name,
          label: alliance.name,
          count: mockVoters.filter(v => 
            alliance.parties.includes(v.voting_preference) || alliance.parties.includes(v.last_voted_party)
          ).length
        }));
      case 'all':
        return [
          { key: 'all', label: 'All' },
          { key: 'status', label: 'Status' },
          { key: 'gender', label: 'Gender' },
          { key: 'age', label: 'Age' },
          { key: 'caste', label: 'Caste' },
          { key: 'party', label: 'Party' },
          { key: 'alliance', label: 'Alliance' }
        ];
      case 'family':
        const families = ['Kumar Family', 'Singh Family', 'Sharma Family', 'Yadav Family', 'Prasad Family'];
        return families.map(family => ({
          key: family,
          label: family.split(' ')[0],
          count: mockVoters.filter(v => v.name.includes(family.split(' ')[0])).length
        }));
      default:
        return baseTabs;
    }
  };

  const handleEditVoter = useCallback((voter) => {
    console.log('Edit voter clicked:', voter);
    if (onEditVoter) {
      onEditVoter(voter);
    } else {
      Alert.alert('Error', 'Edit function not available');
    }
  }, [onEditVoter]);

  const handleCallVoter = useCallback((voter) => {
    if (voter.mobile && voter.mobile !== '<mobile_number>') {
      Alert.alert('Call Voter', `Call ${voter.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling:', voter.mobile) }
      ]);
    } else {
      Alert.alert('No Phone', 'This voter has no phone number on record');
    }
  }, []);

  const handleExport = () => {
    Alert.alert('Export', `Exporting ${voters.length} voters...`);
  };

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const getActiveFilterCount = () => {
    return Object.values(appliedFilters).filter(value => value && value !== '').length;
  };

  const handleAgeRangeSubmit = () => {
    if (ageRange.min && ageRange.max) {
      setActiveSubFilter('custom');
      closeAgeModal();
    }
  };

  const openAgeModal = () => {
    setShowAgeModal(true);
  };

  const closeAgeModal = () => {
    Animated.parallel([
      Animated.timing(ageModalScale, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(ageModalBackdrop, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => setShowAgeModal(false));
  };

  const getTitle = () => {
    const filterLabels = {
      status: 'Voter Status',
      gender: 'Gender Filter', 
      age: 'Age Groups',
      caste: 'Caste Categories',
      party: 'Party Voters',
      alliance: `${activeSubFilter || filters?.value || 'Alliance'} Voters`,
      family: 'Family Voters',
      all: 'All Voters'
    };
    return filterLabels[activeFilter] || 'All Voters';
  };

  const getSubtitle = () => {
    const filterText = getActiveFilterCount() > 0 ? ` • ${getActiveFilterCount()} filters` : '';
    return `${voters.length} voters • Booth: ${boothBoyInfo?.assignedBooths?.join(', ') || 'All'}${filterText}`;
  };

  const renderVoter = ({ item }) => (
    <VoterCard
      voter={item}
      onEdit={handleEditVoter}
      onCall={handleCallVoter}
    />
  );

  const renderAgeModal = () => (
    <Modal 
      visible={showAgeModal} 
      transparent 
      animationType="none" 
      statusBarTranslucent
      onShow={() => {
        ageModalScale.setValue(0);
        ageModalBackdrop.setValue(0);
        setTimeout(() => {
          Animated.parallel([
            Animated.spring(ageModalScale, {
              toValue: 1,
              useNativeDriver: true,
              tension: 65,
              friction: 7,
            }),
            Animated.timing(ageModalBackdrop, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }, 10);
      }}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalBackdrop, { opacity: ageModalBackdrop }]}>
          <TouchableOpacity style={styles.backdropTouch} onPress={closeAgeModal} activeOpacity={1} />
        </Animated.View>
        <Animated.View style={[styles.modalContent, { transform: [{ scale: ageModalScale }] }]}>
          <Text style={styles.modalTitle}>Custom Age Range</Text>
          <View style={styles.ageInputs}>
            <TextInput
              style={styles.ageInput}
              placeholder="Min Age"
              value={ageRange.min}
              onChangeText={(text) => setAgeRange(prev => ({ ...prev, min: text }))}
              keyboardType="numeric"
            />
            <Text style={styles.ageInputSeparator}>to</Text>
            <TextInput
              style={styles.ageInput}
              placeholder="Max Age"
              value={ageRange.max}
              onChangeText={(text) => setAgeRange(prev => ({ ...prev, max: text }))}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalButton} onPress={closeAgeModal}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={handleAgeRangeSubmit}>
              <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <CompactHeader
        title={getTitle()}
        subtitle={getSubtitle()}
        onBack={onBack}
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.filterButton, getActiveFilterCount() > 0 && styles.filterButtonActive]} 
              onPress={() => setShowFilterModal(true)}
            >
              <AppIcon name="filter-list" size={20} color={getActiveFilterCount() > 0 ? "#FFFFFF" : "#6B7280"} />
              {getActiveFilterCount() > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
              <AppIcon name="file-download" size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <AppIcon name="search" size={16} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, EPIC ID, mobile..."
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
              <AppIcon name="cancel" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FilterTabs
        activeTab={activeSubFilter}
        tabs={getFilterTabs()}
        onTabChange={(tab) => {
          if (tab === 'custom' && activeFilter === 'age') {
            openAgeModal();
          } else if (activeFilter === 'all' && tab !== 'all') {
            // Switch filter type from 'all' screen
            setActiveFilter(tab);
            if (tab === 'alliance') {
              setActiveSubFilter('NDA'); // Default to NDA alliance
            } else {
              setActiveSubFilter('all');
            }
          } else {
            setActiveSubFilter(tab);
          }
        }}
      />

      <FlatList
        data={voters}
        renderItem={renderVoter}
        keyExtractor={(item) => item.epic_id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No voters found</Text>
            <Text style={styles.emptySubText}>Try adjusting your search or filters</Text>
          </View>
        }
      />

      {renderAgeModal()}
      
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={appliedFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    padding: 10,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: 8,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  exportButton: {
    padding: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
  },
  list: {
    flex: 1,
    paddingTop: 4,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdropTouch: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    minWidth: 280,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  ageInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  ageInputSeparator: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  modalButtonPrimary: {
    backgroundColor: '#3B82F6',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalButtonTextPrimary: {
    color: '#FFFFFF',
  },
});

export default VoterListScreen;