import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { AppIcon } from './index';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FilterModal = ({ visible, onClose, onApplyFilters, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    verification: '',
    gender: '',
    ageMin: '',
    ageMax: '',
    caste: '',
    category: '',
    religion: '',
    votingPreference: '',
    lastVotedParty: '',
    certaintyOfVote: '',
    availability: '',
    educationLevel: '',
    employmentStatus: '',
    salaryRange: '',
    residingIn: '',
    migrated: '',
    booth: '',
    area: '',
    ...currentFilters
  });

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    }
  }, [visible]);



  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const casteByCategory = {
    'General': ['Brahmin', 'Rajput', 'Bhumihar', 'Kayastha', 'Baniya'],
    'OBC': ['Yadav', 'Kurmi', 'Koeri', 'Teli', 'Nai', 'Kumhar'],
    'SC': ['Chamar', 'Dusadh', 'Musahar', 'Dom', 'Dhobi'],
    'ST': ['Santhal', 'Oraon', 'Munda', 'Kharia'],
    'EBC': ['Nai', 'Dhanuk', 'Mallah', 'Kanu']
  };

  const filterOptions = {
    verification: ['Verified', 'Unverified'],
    gender: ['M', 'F', 'O'],
    category: ['General', 'OBC', 'SC', 'ST', 'EBC'],
    religion: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Others'],
    votingPreference: ['BJP', 'RJD', 'JDU', 'Congress', 'AAP', 'BSP', 'AIMIM', 'Others', 'Undecided'],
    lastVotedParty: ['BJP', 'RJD', 'JDU', 'Congress', 'AAP', 'BSP', 'AIMIM', 'Others', 'Did not vote'],
    certaintyOfVote: ['High', 'Medium', 'Low'],
    availability: ['Available', 'Not Available', 'Uncertain'],
    educationLevel: ['Illiterate', 'Primary', 'Secondary', 'Higher Secondary', 'Graduate', 'Post Graduate', 'Professional'],
    employmentStatus: ['Government', 'Private', 'Self-employed', 'Unemployed', 'Student', 'Retired', 'Homemaker'],
    salaryRange: ['Below 10k', '10k-25k', '25k-50k', '50k-1L', '1L-2L', 'Above 2L'],
    residingIn: ['Same Constituency', 'Different Constituency', 'Different State'],
    migrated: ['Yes', 'No']
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value
    }));
  };

  const handleApply = () => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    onApplyFilters(activeFilters);
    handleClose();
  };

  const handleClear = () => {
    setFilters({
      verification: '',
      gender: '',
      ageMin: '',
      ageMax: '',
      caste: '',
      category: '',
      religion: '',
      votingPreference: '',
      lastVotedParty: '',
      certaintyOfVote: '',
      availability: '',
      educationLevel: '',
      employmentStatus: '',
      salaryRange: '',
      residingIn: '',
      migrated: '',
      booth: '',
      area: ''
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value && value !== '').length;
  };

  const renderFilterSection = (title, filterKey, options, icon) => (
    <View style={styles.filterSection}>
      <View style={styles.sectionHeader}>
        <AppIcon name={icon} size={18} color="#6B7280" />
        <Text style={styles.sectionTitle}>{title}</Text>
        {filters[filterKey] && (
          <TouchableOpacity onPress={() => handleFilterChange(filterKey, '')} style={styles.clearSectionButton}>
            <AppIcon name="clear" size={16} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionChip,
              filters[filterKey] === option && styles.optionChipActive
            ]}
            onPress={() => handleFilterChange(filterKey, option)}
            activeOpacity={0.7}
          >

            <Text style={[
              styles.optionText,
              filters[filterKey] === option && styles.optionTextActive
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderAgeSection = () => (
    <View style={styles.filterSection}>
      <View style={styles.sectionHeader}>
        <AppIcon name="cake" size={18} color="#6B7280" />
        <Text style={styles.sectionTitle}>Age Range</Text>
        {(filters.ageMin || filters.ageMax) && (
          <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, ageMin: '', ageMax: '' }))} style={styles.clearSectionButton}>
            <AppIcon name="clear" size={16} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.ageInputContainer}>
        <View style={styles.ageInputWrapper}>
          <AppIcon name="keyboard-arrow-up" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.ageInput}
            placeholder="Min age"
            value={filters.ageMin}
            onChangeText={(text) => setFilters(prev => ({ ...prev, ageMin: text }))}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
        <View style={styles.rangeSeparator}>
          <View style={styles.rangeLine} />
        </View>
        <View style={styles.ageInputWrapper}>
          <AppIcon name="keyboard-arrow-down" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.ageInput}
            placeholder="Max age"
            value={filters.ageMax}
            onChangeText={(text) => setFilters(prev => ({ ...prev, ageMax: text }))}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
      </View>
    </View>
  );

  const renderTextInputSection = (title, filterKey, placeholder, icon) => (
    <View style={styles.filterSection}>
      <View style={styles.sectionHeader}>
        <AppIcon name={icon} size={18} color="#6B7280" />
        <Text style={styles.sectionTitle}>{title}</Text>
        {filters[filterKey] && (
          <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, [filterKey]: '' }))} style={styles.clearSectionButton}>
            <AppIcon name="clear" size={16} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.textInputContainer}>
        <AppIcon name="search" size={16} color="#9CA3AF" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={filters[filterKey]}
          onChangeText={(text) => setFilters(prev => ({ ...prev, [filterKey]: text }))}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );

  if (!isVisible) return null;

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="slide" 
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalContainer}>
        <View style={styles.backdrop}>
          <TouchableOpacity style={styles.backdropTouch} onPress={handleClose} activeOpacity={1} />
        </View>
        <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <View style={styles.closeButtonInner}>
                <AppIcon name="keyboard-arrow-down" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <View>
              <View style={styles.titleContainer}>
                <AppIcon name="tune" size={20} color="#3B82F6" />
                <Text style={styles.headerTitle}>Filters</Text>
              </View>
              <View style={styles.subtitleContainer}>
                <AppIcon name="filter-alt" size={14} color="#6B7280" />
                <Text style={styles.headerSubtitle}>{getActiveFilterCount()} active filters</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleClear} style={styles.clearAllButton}>
            <View style={styles.resetIcon}>
              <AppIcon name="refresh" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.clearAllText}>Reset All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderFilterSection('Verification Status', 'verification', filterOptions.verification, 'verified-user')}
          {renderFilterSection('Gender', 'gender', filterOptions.gender, 'person')}
          {renderAgeSection()}
          {renderFilterSection('Category', 'category', filterOptions.category, 'category')}
          {filters.category && renderFilterSection('Caste', 'caste', casteByCategory[filters.category] || [], 'group')}
          {renderFilterSection('Religion', 'religion', filterOptions.religion, 'place')}
          {renderFilterSection('Voting Preference', 'votingPreference', filterOptions.votingPreference, 'how-to-vote')}
          {renderFilterSection('Last Voted Party', 'lastVotedParty', filterOptions.lastVotedParty, 'history')}
          {renderFilterSection('Vote Certainty', 'certaintyOfVote', filterOptions.certaintyOfVote, 'trending-up')}
          {renderFilterSection('Availability', 'availability', filterOptions.availability, 'schedule')}
          {renderFilterSection('Education Level', 'educationLevel', filterOptions.educationLevel, 'school')}
          {renderFilterSection('Employment Status', 'employmentStatus', filterOptions.employmentStatus, 'work')}
          {renderFilterSection('Salary Range', 'salaryRange', filterOptions.salaryRange, 'attach-money')}
          {renderFilterSection('Residing In', 'residingIn', filterOptions.residingIn, 'location-on')}
          {renderFilterSection('Migrated', 'migrated', filterOptions.migrated, 'flight')}
          {renderTextInputSection('Booth ID', 'booth', 'Enter booth ID', 'ballot')}
          {renderTextInputSection('Area', 'area', 'Enter area name', 'map')}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <View style={styles.applyButtonContent}>
              <View style={styles.applyIcon}>
                <AppIcon name="filter-list" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.applyButtonText}>
                Apply Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backdropTouch: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.9,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  closeButton: {
    marginRight: 12,
  },
  closeButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#EF4444',
    borderRadius: 20,
    gap: 6,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  resetIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearAllText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  clearSectionButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  filterSection: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    letterSpacing: 0.3,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 6,
    gap: 4,
  },
  optionChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ scale: 1.02 }],
  },

  optionText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  ageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ageInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  ageInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  rangeSeparator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeLine: {
    width: 20,
    height: 2,
    backgroundColor: '#D1D5DB',
    borderRadius: 1,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  inputIcon: {
    opacity: 0.7,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    paddingVertical: 18,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  applyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  applyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default FilterModal;