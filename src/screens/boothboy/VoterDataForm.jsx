import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AppIcon, BackButton } from '../../components/common';
import { voterService } from '../../services/api/voter.service';
import { useSelector } from 'react-redux';

const VoterDataForm = ({
  route,
  navigation,
  epicId = null,
  initialData = {},
  onBack,
  onSave,
  isModalView = false,
}) => {
  const { token } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    // Default Voter Info (readonly for booth volunteer)
    serialNumber: '',
    epicId: '',
    name: '',
    guardianName: '',
    gender: '',
    age: '',
    voterPhoto: '',
    mobile: '',
    
    // Voting Behavior
    lastElectionParty: '',
    thisElectionPreference: '',
    voteCertainty: '',
    voteType: '',
    availabilityToVote: '',
    
    // Cultural Information
    religion: '',
    category: '',
    obcSubtype: '',
    caste: '',
    languagePreference: '',
    
    // Education & Employment
    education: '',
    employmentStatus: '',
    govtJobType: '',
    govtJobGroup: '',
    govtJobRole: '',
    govtSalary: '',
    privateSalary: '',
    privateJobRole: '',
    gigPlatforms: [],
    selfEmployedService: '',
    businessType: '',
    businessTurnover: '',
    unemploymentReason: '',
    digitalCreatorPlatforms: [],
    
    // Residence Information
    residingIn: '',
    otherCityName: '',
    permanentResidenceInBihar: '',
    migrated: '',
    
    // Feedback/Issues
    issuesFaced: [],
    otherIssue: '',
    
    // Additional metadata
    lastUpdated: new Date().toISOString(),
    updatedBy: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  // Static data options
  const politicalParties = [
    { label: 'NDA', value: 'NDA' },
    { label: 'INDIA (UPA)', value: 'INDIA_UPA' },
    { label: 'LJP', value: 'LJP' },
    { label: 'AIMIM', value: 'AIMIM' },
    { label: 'BSP', value: 'BSP' },
    { label: 'Others', value: 'Others' },
    { label: 'Independent', value: 'Independent' }
  ];

  const religionOptions = [
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Muslim', value: 'Muslim' },
    { label: 'Christian', value: 'Christian' },
    { label: 'Sikh', value: 'Sikh' },
    { label: 'Jain', value: 'Jain' },
    { label: 'Others', value: 'Others' }
  ];

  const categoryOptions = [
    { label: 'General', value: 'General' },
    { label: 'OBC', value: 'OBC' },
    { label: 'SC', value: 'SC' }
  ];

  const educationOptions = [
    { label: 'Illiterate', value: 'Illiterate' },
    { label: 'Just Literate', value: 'JustLiterate' },
    { label: 'Below 10th', value: 'Below10th' },
    { label: '10th Pass', value: '10thPass' },
    { label: '12th Pass', value: '12thPass' },
    { label: 'Technical Graduate (BTech, MBBS, BBA, etc.)', value: 'TechnicalGraduate' },
    { label: 'Normal Graduate (BA, BCom, BSc)', value: 'NormalGraduate' },
    { label: 'Masters (PG)', value: 'Masters' },
    { label: 'PhD', value: 'PhD' }
  ];

  const employmentOptions = [
    { label: 'Employed (Govt / Private)', value: 'Employed' },
    { label: 'Gig Worker', value: 'GigWorker' },
    { label: 'Self-Employed', value: 'SelfEmployed' },
    { label: 'Business Owner', value: 'BusinessOwner' },
    { label: 'Agriculture', value: 'Agriculture' },
    { label: 'Unemployed', value: 'Unemployed' },
    { label: 'Digital Creator', value: 'DigitalCreator' }
  ];

  const issuesOptions = [
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

  // Load existing voter data if epicId is provided or use initialData
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Map voter card data to form fields
      const mappedData = {
        serialNumber: initialData.serial_number || '',
        epicId: initialData.epic_id || '',
        name: initialData.name || '',
        guardianName: initialData.guardian_name || '',
        gender: initialData.gender || '',
        age: initialData.age?.toString() || '',
        mobile: initialData.mobile || '',
        lastElectionParty: initialData.last_voted_party || '',
        thisElectionPreference: initialData.voting_preference || '',
        caste: initialData.caste || '',
        // Keep other fields empty for user to fill
        voteCertainty: '',
        voteType: '',
        availabilityToVote: '',
        religion: '',
        category: '',
        obcSubtype: '',
        languagePreference: '',
        education: '',
        employmentStatus: '',
        govtJobType: '',
        govtJobGroup: '',
        govtJobRole: '',
        govtSalary: '',
        privateSalary: '',
        privateJobRole: '',
        gigPlatforms: [],
        selfEmployedService: '',
        businessType: '',
        businessTurnover: '',
        unemploymentReason: '',
        digitalCreatorPlatforms: [],
        residingIn: '',
        otherCityName: '',
        permanentResidenceInBihar: '',
        migrated: '',
        issuesFaced: [],
        otherIssue: '',
        lastUpdated: new Date().toISOString(),
        updatedBy: '',
        remarks: ''
      };
      setFormData(mappedData);
    } else if (epicId && token) {
      loadVoterData();
    }
  }, [epicId, token, initialData]);

  const loadVoterData = async () => {
    try {
      setLoading(true);
      const response = await voterService.getByEpicId(epicId, token);
      if (response.success) {
        setFormData(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load voter data');
      console.error('Load voter data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleMultiSelectChange = useCallback((field, option, checked) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, option] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== option) };
      }
    });
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.mobile?.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number';
    }

    if (!formData.lastElectionParty) {
      newErrors.lastElectionParty = 'Last election party is required';
    }

    if (!formData.thisElectionPreference) {
      newErrors.thisElectionPreference = 'This election preference is required';
    }

    if (!formData.voteCertainty) {
      newErrors.voteCertainty = 'Vote certainty is required';
    }

    if (!formData.religion) {
      newErrors.religion = 'Religion is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.education) {
      newErrors.education = 'Education is required';
    }

    if (!formData.employmentStatus) {
      newErrors.employmentStatus = 'Employment status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors before submitting');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'booth_volunteer' // This should come from auth context
      };

      if (epicId) {
        // Update existing voter
        const response = await voterService.updateVoter(epicId, submitData, token);
        if (response.success) {
          Alert.alert('Success', 'Voter data updated successfully');
          if (onSave) onSave(submitData);
          if (onBack) onBack();
        }
      } else {
        // For new voter data collection (if supported by API)
        Alert.alert('Success', 'Voter data collected successfully');
        if (onSave) onSave(submitData);
        if (onBack) onBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save voter data');
      console.error('Save voter data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderField = (label, value, field, options = null, type = 'text', additionalProps = {}) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {type === 'picker' && options ? (
        <View style={[styles.pickerContainer, errors[field] && styles.inputError]}>
          <Picker
            selectedValue={value}
            onValueChange={(itemValue) => handleFieldChange(field, itemValue)}
            style={styles.picker}
          >
            <Picker.Item label={`Select ${label}`} value="" />
            {options.map(option => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      ) : type === 'radio' && options ? (
        <View style={styles.radioContainer}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.radioOption,
                value === option.value && styles.selectedRadioOption
              ]}
              onPress={() => handleFieldChange(field, option.value)}
            >
              <Text style={[
                styles.radioText,
                value === option.value && styles.selectedRadioText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : type === 'multiselect' && options ? (
        <View style={styles.multiSelectContainer}>
          {options.map(option => {
            const isSelected = (value || []).includes(option.value);
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.checkboxOption,
                  isSelected && styles.selectedCheckboxOption
                ]}
                onPress={() => handleMultiSelectChange(field, option.value, !isSelected)}
              >
                <AppIcon 
                  name={isSelected ? 'check-box' : 'check-box-outline-blank'} 
                  size={20} 
                  color={isSelected ? '#3B82F6' : '#9CA3AF'} 
                />
                <Text style={[
                  styles.checkboxText,
                  isSelected && styles.selectedCheckboxText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <TextInput
          style={[
            styles.textInput,
            errors[field] && styles.inputError,
            additionalProps.readOnly && styles.readOnlyInput
          ]}
          value={value?.toString() || ''}
          onChangeText={(text) => handleFieldChange(field, text)}
          placeholder={`Enter ${label.toLowerCase()}`}
          editable={!additionalProps.readOnly}
          {...additionalProps}
        />
      )}
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderConditionalFields = () => {
    const conditionalFields = [];

    // OBC Subtype (show only if category is OBC)
    if (formData.category === 'OBC') {
      conditionalFields.push(
        renderField(
          'OBC Subtype',
          formData.obcSubtype,
          'obcSubtype',
          [
            { label: 'BC 1', value: 'BC1' },
            { label: 'EBC (BC 2)', value: 'EBC_BC2' }
          ],
          'radio'
        )
      );
    }

    // Employment-specific fields
    if (formData.employmentStatus === 'Employed') {
      conditionalFields.push(
        renderField('Government Job Type', formData.govtJobType, 'govtJobType', [
          { label: 'Central Govt', value: 'CentralGovt' },
          { label: 'Bihar State Govt', value: 'BiharStateGovt' },
          { label: 'Other State Govt', value: 'OtherStateGovt' },
          { label: 'Private', value: 'Private' }
        ], 'picker')
      );

      if (formData.govtJobType && formData.govtJobType !== 'Private') {
        conditionalFields.push(
          renderField('Government Job Group', formData.govtJobGroup, 'govtJobGroup', [
            { label: 'Group D & Below', value: 'GroupD' },
            { label: 'Group C', value: 'GroupC' },
            { label: 'Group B', value: 'GroupB' },
            { label: 'Group A', value: 'GroupA' }
          ], 'picker'),
          renderField('Monthly Salary', formData.govtSalary, 'govtSalary', [
            { label: '₹10K', value: '10K' },
            { label: '₹15K', value: '15K' },
            { label: '₹25K', value: '25K' },
            { label: '₹35K', value: '35K' },
            { label: '₹50K+', value: '50K+' }
          ], 'picker')
        );
      }

      if (formData.govtJobType === 'Private') {
        conditionalFields.push(
          renderField('Private Job Role', formData.privateJobRole, 'privateJobRole'),
          renderField('Private Job Salary', formData.privateSalary, 'privateSalary', [
            { label: 'up to ₹15K', value: '15K' },
            { label: '₹25K', value: '25K' },
            { label: '₹35K', value: '35K' },
            { label: '₹50K+', value: '50K+' }
          ], 'picker')
        );
      }
    }

    if (formData.employmentStatus === 'GigWorker') {
      conditionalFields.push(
        renderField('Gig Platforms', formData.gigPlatforms, 'gigPlatforms', [
          { label: 'Ola/Uber', value: 'OlaUber' },
          { label: 'Paytm', value: 'Paytm' },
          { label: 'Airtel Payments', value: 'AirtelPayments' },
          { label: 'Driver', value: 'Driver' },
          { label: 'Delivery Boy', value: 'DeliveryBoy' }
        ], 'multiselect')
      );
    }

    if (formData.employmentStatus === 'SelfEmployed') {
      conditionalFields.push(
        renderField('Service Type', formData.selfEmployedService, 'selfEmployedService', [
          { label: 'Carpenter', value: 'Carpenter' },
          { label: 'AC Repair', value: 'ACRepair' },
          { label: 'Painter', value: 'Painter' },
          { label: 'Electrician', value: 'Electrician' }
        ], 'picker')
      );
    }

    if (formData.employmentStatus === 'BusinessOwner') {
      conditionalFields.push(
        renderField('Business Type', formData.businessType, 'businessType', [
          { label: 'Kirana', value: 'Kirana' },
          { label: 'Mobile Shop', value: 'MobileShop' },
          { label: 'Hotel', value: 'Hotel' },
          { label: 'Farming', value: 'Farming' },
          { label: 'Real Estate', value: 'RealEstate' }
        ], 'picker'),
        renderField('Annual Turnover', formData.businessTurnover, 'businessTurnover', [
          { label: 'up to ₹5L', value: '5L' },
          { label: '₹10L', value: '10L' },
          { label: '₹15L', value: '15L' },
          { label: '₹30L', value: '30L' },
          { label: '₹50L+', value: '50L+' }
        ], 'picker')
      );
    }

    if (formData.employmentStatus === 'Unemployed') {
      conditionalFields.push(
        renderField('Unemployment Reason', formData.unemploymentReason, 'unemploymentReason', [
          { label: 'Preparing for Govt Job', value: 'PreparingGovtJob' },
          { label: 'Studying', value: 'Studying' },
          { label: 'Unable to find work', value: 'UnableToFindWork' },
          { label: 'Not skilled', value: 'NotSkilled' }
        ], 'picker')
      );
    }

    if (formData.employmentStatus === 'DigitalCreator') {
      conditionalFields.push(
        renderField('Digital Creator Platforms', formData.digitalCreatorPlatforms, 'digitalCreatorPlatforms', [
          { label: 'YouTube', value: 'YouTube' },
          { label: 'Instagram', value: 'Instagram' },
          { label: 'Twitter', value: 'Twitter' },
          { label: 'News/Media', value: 'NewsMedia' }
        ], 'multiselect')
      );
    }

    // Residence conditional fields
    if (formData.residingIn === 'OtherState' || formData.residingIn === 'Abroad') {
      conditionalFields.push(
        renderField('City Name', formData.otherCityName, 'otherCityName')
      );
    }

    // Other issue text field
    if ((formData.issuesFaced || []).includes('OtherIssue')) {
      conditionalFields.push(
        renderField('Specify Other Issue', formData.otherIssue, 'otherIssue', null, 'text', { multiline: true, numberOfLines: 3 })
      );
    }

    return conditionalFields;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading voter data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={onBack || navigation?.goBack} />
        <Text style={styles.headerTitle}>
          {epicId ? 'Edit Voter Data' : 'Collect Voter Data'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Default Voter Info Section */}
        {renderSection('Default Voter Info (Pre-filled from ECI)', (
          <View>
            {renderField('Serial Number (Booth List)', formData.serialNumber, 'serialNumber', null, 'text', { readOnly: true })}
            {renderField('EPIC/Voter ID', formData.epicId, 'epicId', null, 'text', { readOnly: true })}
            {renderField('Name', formData.name, 'name', null, 'text', { readOnly: true })}
            {renderField("Guardian/Father's/Husband's Name", formData.guardianName, 'guardianName', null, 'text', { readOnly: true })}
            {renderField('Gender', formData.gender, 'gender', null, 'text', { readOnly: true })}
            {renderField('Age/DOB', formData.age, 'age', null, 'text', { readOnly: true })}
            {renderField('Mobile Number (Editable)', formData.mobile, 'mobile', null, 'text', { keyboardType: 'phone-pad', maxLength: 10 })}
          </View>
        ))}

        {/* Voting Behavior Section */}
        {renderSection('Voting Behavior', (
          <View>
            {renderField('Last Election Voted Party/Alliance', formData.lastElectionParty, 'lastElectionParty', politicalParties, 'picker')}
            {renderField('This Election Voting Preference', formData.thisElectionPreference, 'thisElectionPreference', [
              ...politicalParties,
              { label: 'Jansuraaj', value: 'Jansuraaj' }
            ], 'picker')}
            {renderField('Certainty of Vote Decision', formData.voteCertainty, 'voteCertainty', [
              { label: 'Yes', value: 'Yes' },
              { label: 'Doubtful', value: 'Doubtful' }
            ], 'radio')}
            {renderField('Vote Type', formData.voteType, 'voteType', [
              { label: 'First-time', value: 'FirstTime' },
              { label: 'Normal', value: 'Normal' },
              { label: 'Postal Ballot', value: 'PostalBallot' },
              { label: 'Others', value: 'Others' }
            ], 'picker')}
            {renderField('Availability to Vote This Election', formData.availabilityToVote, 'availabilityToVote', [
              { label: 'Yes (100%)', value: 'Yes100' },
              { label: 'No (100%)', value: 'No100' },
              { label: '50%', value: '50Percent' },
              { label: "Can't Say Now", value: 'CantSayNow' }
            ], 'picker')}
          </View>
        ))}

        {/* Cultural Information Section */}
        {renderSection('Cultural Information', (
          <View>
            {renderField('Religion', formData.religion, 'religion', religionOptions, 'picker')}
            {renderField('Category', formData.category, 'category', categoryOptions, 'picker')}
            {renderField('Caste', formData.caste, 'caste')}
            {renderField('Language Preference for Communication', formData.languagePreference, 'languagePreference')}
          </View>
        ))}

        {/* Education & Employment Section */}
        {renderSection('Education & Employment', (
          <View>
            {renderField('Education', formData.education, 'education', educationOptions, 'picker')}
            {renderField('Employment Status', formData.employmentStatus, 'employmentStatus', employmentOptions, 'picker')}
          </View>
        ))}

        {/* Residence Information Section */}
        {renderSection('Residence Information', (
          <View>
            {renderField('Residing in', formData.residingIn, 'residingIn', [
              { label: 'Same Vidhan Sabha', value: 'SameVidhansabha' },
              { label: 'Other Vidhan Sabha (Bihar)', value: 'OtherVidhansabhaBihar' },
              { label: 'Other State', value: 'OtherState' },
              { label: 'Abroad', value: 'Abroad' }
            ], 'picker')}
            {renderField('Permanent residence inside Bihar?', formData.permanentResidenceInBihar, 'permanentResidenceInBihar', [
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' }
            ], 'radio')}
            {renderField('Migrated?', formData.migrated, 'migrated', [
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' }
            ], 'radio')}
          </View>
        ))}

        {/* Feedback/Issues Section */}
        {renderSection('Feedback / Issues Faced', (
          <View>
            {renderField('Issues Faced (Multi-select)', formData.issuesFaced, 'issuesFaced', issuesOptions, 'multiselect')}
          </View>
        ))}

        {/* Conditional Fields */}
        {renderConditionalFields()}

        {/* Remarks Section */}
        {renderSection('Additional Information', (
          <View>
            {renderField('Remarks', formData.remarks, 'remarks', null, 'text', { multiline: true, numberOfLines: 4 })}
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <AppIcon name="save" size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            {loading ? 'Saving...' : 'Save Voter Data'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    textAlignVertical: 'top',
  },
  readOnlyInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  radioOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedRadioOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  radioText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedRadioText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  multiSelectContainer: {
    marginTop: 8,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  selectedCheckboxOption: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  checkboxText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  selectedCheckboxText: {
    color: '#1E40AF',
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default VoterDataForm;