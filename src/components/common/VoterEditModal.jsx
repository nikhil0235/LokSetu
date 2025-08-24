import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const FORM_OPTIONS = {
  parties: ['NDA', 'INDIA (UPA)', 'Jansuraaj', 'LJP', 'AIMIM', 'BSP', 'Others', 'Independent'],
  certaintyLevels: ['Yes', 'Doubtful', 'Undecided'],
  verificationStatus: ['Verified', 'Unverified'],
  religions: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Others'],
  categories: ['General', 'OBC', 'SC', 'ST'],
  obcSubtypes: ['BC 1', 'EBC (BC 2)'],
  educationLevels: ['Illiterate', 'Below 10th', '10th Pass', '12th Pass', 'Technical Graduate', 'Normal Graduate', 'Masters (PG)', 'PhD'],
  employmentStatus: ['Government Job', 'Private Job', 'Gig Worker', 'Self-Employed', 'Business Owner', 'Agriculture', 'Unemployed', 'Digital Creator'],
  govtJobTypes: ['Central Government', 'Bihar State Government', 'Other State Government'],
  govtJobGroups: ['Group D & Below', 'Group C', 'Group B', 'Group A'],
  privateSalaryRanges: ['Below ₹15K', '₹15K-₹25K', '₹25K-₹35K', '₹35K-₹50K', '₹50K+'],
  businessTypes: ['Kirana Store', 'Mobile Shop', 'Hotel/Restaurant', 'Farming', 'Real Estate', 'Transport'],
  residenceOptions: ['Same Vidhan Sabha', 'Other Vidhan Sabha (Bihar)', 'Other State', 'Abroad'],
  feedbackIssues: ['Education', 'Employment', 'Healthcare', 'Road/Infrastructure', 'Electricity', 'Water Supply', 'Corruption', 'Agriculture & Irrigation', 'Any Other Issue']
};

const STEPS = [
  { id: 0, title: 'Personal', icon: 'person', progress: 1 },
  { id: 1, title: 'Voting', icon: 'how-to-vote', progress: 2 },
  { id: 2, title: 'Cultural', icon: 'groups', progress: 3 },
  { id: 3, title: 'Education', icon: 'school', progress: 4 },
  { id: 4, title: 'Residence', icon: 'location-on', progress: 5 },
  { id: 5, title: 'Feedback', icon: 'feedback', progress: 6 }
];

const VoterEditModal = ({ visible = false, onClose, voter = {}, onSave, loading = false, readOnly = false }) => {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    if (visible && voter) {
      setFormData({
        epic_id: voter.epic_id || '',
        serial_number: voter.serial_number || '',
        name: voter.name || '',
        name_phonetic: voter.name_phonetic || '',
        guardian_name: voter.guardian_name || '',
        gender: voter.gender || '',
        age: voter.age || '',
        mobile: voter.mobile || '',
        booth_id: voter.booth_id || '',
        house_number: voter.house_number || '',
        last_voted_party: voter.last_voted_party || '',
        voting_preference: voter.voting_preference || '',
        verification_status: voter.verification_status || '',
        certainty_of_vote: voter.certainty_of_vote || '',
        vote_type: voter.vote_type || '',
        availability: voter.availability || '',
        religion: voter.religion || '',
        category: voter.category || '',
        obc_subtype: voter.obc_subtype || '',
        caste: voter.caste || '',
        education_level: voter.education_level || '',
        employment_status: voter.employment_status || '',
        govt_job_type: voter.govt_job_type || '',
        govt_job_group: voter.govt_job_group || '',
        private_salary: voter.private_salary || '',
        business_type: voter.business_type || '',
        residing_in: voter.residing_in || '',
        other_city: voter.other_city || '',
        permanent_in_bihar: voter.permanent_in_bihar || false,
        migrated: voter.migrated || false,
        feedback_issues: voter.feedback_issues || [],
        custom_feedback: voter.custom_feedback || '',
        notes: voter.notes || ''
      });
      setPhotoUri(voter.photo || null);
      setErrors({});
      setIsDirty(false);
    }
  }, [visible, voter]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleMultiSelect = (field, option) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(option)
      ? currentValues.filter(item => item !== option)
      : [...currentValues, option];
    handleInputChange(field, newValues);
  };

  const handlePhotoSelect = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = () => {
    const options = { mediaType: 'photo', quality: 0.8 };
    launchCamera(options, (response) => {
      if (response.assets && response.assets[0]) {
        setPhotoUri(response.assets[0].uri);
        setIsDirty(true);
      }
    });
  };

  const openGallery = () => {
    const options = { mediaType: 'photo', quality: 0.8 };
    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0]) {
        setPhotoUri(response.assets[0].uri);
        setIsDirty(true);
      }
    });
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    switch (currentStep) {
      case 0: // Personal
        if (!formData.epic_id?.trim()) newErrors.epic_id = 'EPIC ID is required';
        if (!formData.name?.trim()) newErrors.name = 'Name is required';
        if (formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile)) {
          newErrors.mobile = 'Invalid mobile number';
        }
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields');
      return;
    }
    if (!isDirty) {
      onClose();
      return;
    }
    setIsSubmitting(true);
    try {
      const submitData = { ...formData, photo: photoUri };
      await onSave(submitData);
      setIsDirty(false);
      Alert.alert('Success', 'Voter information updated successfully', [
        { text: 'OK', onPress: onClose }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save voter information');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isDirty && !readOnly) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to close?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onClose }
        ]
      );
    } else {
      onClose();
    }
  };

  const renderInput = (label, field, placeholder = '', keyboardType = 'default', multiline = false, required = false) => {
    const hasError = !!errors[field];
    return (
      <View style={styles.inputContainer}>
        <Text style={[styles.label, hasError && styles.labelError]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <TextInput
          style={[styles.input, multiline && styles.textArea, hasError && styles.inputError, readOnly && styles.inputReadOnly]}
          value={String(formData[field] || '')}
          onChangeText={(value) => handleInputChange(field, value)}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          editable={!readOnly}
        />
        {hasError && <Text style={styles.errorText}>{errors[field]}</Text>}
      </View>
    );
  };

  const renderPicker = (label, field, options, placeholder = 'Select...', required = false) => {
    const hasError = !!errors[field];
    return (
      <View style={styles.inputContainer}>
        <Text style={[styles.label, hasError && styles.labelError]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        <View style={[styles.pickerContainer, hasError && styles.inputError, readOnly && styles.inputReadOnly]}>
          <Picker
            selectedValue={formData[field] || ''}
            onValueChange={(value) => handleInputChange(field, value)}
            style={styles.picker}
            enabled={!readOnly}
          >
            <Picker.Item label={placeholder} value="" />
            {options.map(option => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
        {hasError && <Text style={styles.errorText}>{errors[field]}</Text>}
      </View>
    );
  };

  const renderMultiSelect = (label, field, options) => {
    const selectedValues = formData[field] || [];
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.multiSelectContainer}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.checkboxItem}
              onPress={() => handleMultiSelect(field, option)}
              disabled={readOnly}
            >
              <Icon
                name={selectedValues.includes(option) ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={selectedValues.includes(option) ? '#4F46E5' : '#9CA3AF'}
              />
              <Text style={[styles.checkboxLabel, selectedValues.includes(option) && styles.checkboxLabelSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <View>
            <View style={styles.photoSection}>
              <TouchableOpacity style={styles.photoContainer} onPress={handlePhotoSelect} disabled={readOnly}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Icon name="camera-alt" size={32} color="#9CA3AF" />
                    <Text style={styles.photoText}>Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {renderInput('Serial Number', 'serial_number', 'From booth list')}
            {renderInput('EPIC ID', 'epic_id', 'e.g., ABC1234567', 'default', false, true)}
            {renderInput('Name', 'name', 'Full name', 'default', false, true)}
            {renderInput('Name (Phonetic)', 'name_phonetic', 'Name in regional script')}
            {renderInput('Guardian Name', 'guardian_name', 'Father/Husband name')}
            {renderInput('Gender', 'gender', 'Male/Female/Other')}
            {renderInput('Age', 'age', 'Age in years', 'numeric')}
            {renderInput('Mobile Number', 'mobile', '10-digit mobile number', 'phone-pad')}
            {renderInput('House Number', 'house_number', 'House/Flat number')}
          </View>
        );
      case 1: // Voting Behavior
        return (
          <View>
            {renderPicker('Last Election Voted Party', 'last_voted_party', FORM_OPTIONS.parties)}
            {renderPicker('This Election Voting Preference', 'voting_preference', FORM_OPTIONS.parties)}
            {renderPicker('Certainty of Vote Decision', 'certainty_of_vote', FORM_OPTIONS.certaintyLevels)}
            {renderPicker('Vote Type', 'vote_type', ['First-time', 'Normal', 'Postal Ballot', 'Others'])}
            {renderPicker('Availability to Vote', 'availability', ['Yes (100%)', 'Likely (75%)', 'Maybe (50%)', 'No (0%)', "Can't Say Now"])}
          </View>
        );
      case 2: // Cultural Information
        return (
          <View>
            {renderPicker('Religion', 'religion', FORM_OPTIONS.religions)}
            {renderPicker('Category', 'category', FORM_OPTIONS.categories)}
            {formData.category === 'OBC' && renderPicker('OBC Subtype', 'obc_subtype', FORM_OPTIONS.obcSubtypes)}
            {renderInput('Caste', 'caste', 'Enter caste')}
          </View>
        );
      case 3: // Education & Employment
        return (
          <View>
            {renderPicker('Education Level', 'education_level', FORM_OPTIONS.educationLevels)}
            {renderPicker('Employment Status', 'employment_status', FORM_OPTIONS.employmentStatus)}
            {formData.employment_status === 'Government Job' && (
              <>
                {renderPicker('Government Job Type', 'govt_job_type', FORM_OPTIONS.govtJobTypes)}
                {renderPicker('Job Group', 'govt_job_group', FORM_OPTIONS.govtJobGroups)}
              </>
            )}
            {formData.employment_status === 'Private Job' && (
              renderPicker('Salary Range', 'private_salary', FORM_OPTIONS.privateSalaryRanges)
            )}
            {formData.employment_status === 'Business Owner' && (
              renderPicker('Business Type', 'business_type', FORM_OPTIONS.businessTypes)
            )}
          </View>
        );
      case 4: // Residence Information
        return (
          <View>
            {renderInput('Booth ID', 'booth_id', 'Booth identification')}
            {renderPicker('Currently Residing In', 'residing_in', FORM_OPTIONS.residenceOptions)}
            {(formData.residing_in === 'Other State' || formData.residing_in === 'Abroad') && 
              renderInput('Other City/Location', 'other_city', 'Specify city/location')}
          </View>
        );
      case 5: // Feedback
        return (
          <View>
            {renderMultiSelect('Issues/Concerns (Multi-select)', 'feedback_issues', FORM_OPTIONS.feedbackIssues)}
            {(formData.feedback_issues || []).includes('Any Other Issue') && 
              renderInput('Specify Other Issue', 'custom_feedback', 'Describe the issue', 'default', true)}
            {renderInput('Additional Notes', 'notes', 'Any additional notes', 'default', true)}
          </View>
        );
      default:
        return <View />;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{readOnly ? 'View Voter' : 'Edit Voter'}</Text>
          <View style={styles.headerRight}>
            <Text style={styles.stepIndicator}>{currentStep + 1} of {STEPS.length}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${((currentStep + 1) / STEPS.length) * 100}%` }]} />
        </View>

        {/* Step Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stepContainer}>
          {STEPS.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              style={[styles.step, currentStep === index && styles.activeStep]}
              onPress={() => setCurrentStep(index)}
            >
              <Icon name={step.icon} size={20} color={currentStep === index ? '#4F46E5' : '#9CA3AF'} />
              <Text style={[styles.stepText, currentStep === index && styles.activeStepText]}>{step.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {renderStepContent()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerButton, styles.previousButton, currentStep === 0 && styles.disabledButton]}
            onPress={handlePrevious}
            disabled={currentStep === 0}
          >
            <Text style={[styles.footerButtonText, currentStep === 0 && styles.disabledButtonText]}>Previous</Text>
          </TouchableOpacity>

          {currentStep === STEPS.length - 1 ? (
            <TouchableOpacity
              style={[styles.footerButton, styles.saveButton, (!isDirty || isSubmitting) && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={!isDirty || isSubmitting || readOnly}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.footerButton, styles.nextButton]} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  closeButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827', flex: 1, textAlign: 'center' },
  headerRight: { minWidth: 60, alignItems: 'flex-end' },
  stepIndicator: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  progressContainer: { height: 4, backgroundColor: '#E5E7EB', marginHorizontal: 20 },
  progressBar: { height: 4, backgroundColor: '#4F46E5', borderRadius: 2 },
  stepContainer: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#F9FAFB', paddingVertical: 8 },
  step: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  activeStep: { backgroundColor: '#EEF2FF', borderRadius: 8 },
  stepText: { marginLeft: 8, fontSize: 14, fontWeight: '500', color: '#6B7280' },
  activeStepText: { color: '#4F46E5', fontWeight: '600' },
  content: { flex: 1, padding: 20 },
  photoSection: { alignItems: 'center', marginBottom: 20 },
  photoContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed' },
  photo: { width: 96, height: 96, borderRadius: 48 },
  photoPlaceholder: { alignItems: 'center' },
  photoText: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  labelError: { color: '#EF4444' },
  required: { color: '#EF4444' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: '#111827', backgroundColor: '#FFFFFF' },
  textArea: { height: 80, textAlignVertical: 'top' },
  inputError: { borderColor: '#EF4444' },
  inputReadOnly: { backgroundColor: '#F9FAFB', color: '#6B7280' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },
  pickerContainer: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, backgroundColor: '#FFFFFF' },
  picker: { height: 50 },
  multiSelectContainer: { marginTop: 8 },
  checkboxItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  checkboxLabel: { fontSize: 14, color: '#374151', marginLeft: 8, flex: 1 },
  checkboxLabelSelected: { color: '#4F46E5', fontWeight: '500' },
  footer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 12 },
  footerButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  previousButton: { backgroundColor: '#F3F4F6' },
  nextButton: { backgroundColor: '#4F46E5' },
  saveButton: { backgroundColor: '#10B981' },
  disabledButton: { backgroundColor: '#E5E7EB' },
  footerButtonText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  disabledButtonText: { color: '#9CA3AF' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', justifyContent: 'center', alignItems: 'center' }
});

export default VoterEditModal;