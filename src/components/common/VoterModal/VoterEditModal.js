import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler,
  Animated,
  Keyboard
} from 'react-native';
import { AppIcon } from '../';

// Step Components
import PersonalStep from './steps/PersonalStep';
import VotingStep from './steps/VotingStep';
import CulturalStep from './steps/CulturalStep';
import EducationEmploymentStep from './steps/EducationEmploymentStep';
import ResidenceStep from './steps/ResidenceStep';
import FeedbackStep from './steps/FeedbackStep';

const { width, height } = Dimensions.get('window');

const VoterEditModal = ({ visible, voter, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const keyboardHeightAnim = useRef(new Animated.Value(0)).current;

  const steps = [
    {
      title: 'Personal Info',
      icon: 'person',
      component: PersonalStep
    },
    {
      title: 'Voting Behavior',
      icon: 'how-to-vote',
      component: VotingStep
    },
    {
      title: 'Cultural Info',
      icon: 'account-balance',
      component: CulturalStep
    },
    {
      title: 'Education & Employment',
      icon: 'work',
      component: EducationEmploymentStep
    },
    {
      title: 'Residence Info',
      icon: 'home',
      component: ResidenceStep
    },
    {
      title: 'Feedback & Issues',
      icon: 'feedback',
      component: FeedbackStep
    }
  ];

  useEffect(() => {
    if (visible && voter) {
      // Initialize form data with existing voter data
      setFormData({
        // Personal Info
        serial_number: voter.serial_number || '',
        epic_id: voter.epic_id || '',
        name: voter.name || '',
        name_phonetic: voter.name_phonetic || '',
        guardian_name: voter.guardian_name || '',
        gender: voter.gender || '',
        age: voter.age?.toString() || '',
        dob: voter.dob || '',
        mobile: voter.mobile || '',
        email: voter.email || '',
        first_time_voter: voter.first_time_voter || false,

        // Voting Behavior
        last_voted_party: voter.last_voted_party || '',
        voting_preference: voter.voting_preference || '',
        vote_certainty: voter.vote_certainty || '',
        vote_type: voter.vote_type || '',
        vote_availability: voter.vote_availability || '',
        family_votes_together: voter.family_votes_together || false,
        influenced_by_leaders: voter.influenced_by_leaders || false,
        is_party_worker: voter.is_party_worker || false,

        // Cultural Info
        religion: voter.religion || '',
        category: voter.category || '',
        obc_subtype: voter.obc_subtype || '',
        caste: voter.caste || '',
        caste_other: voter.caste_other || '',
        communication_language: voter.communication_language || '',
        language_other: voter.language_other || '',
        community_details: voter.community_details || '',

        // Education & Employment
        education_level: voter.education_level || '',
        employment_status: voter.employment_status || '',
        govt_job_type: voter.govt_job_type || '',
        govt_job_group: voter.govt_job_group || '',
        job_role: voter.job_role || '',
        salary_range: voter.salary_range || '',
        company_name: voter.company_name || '',
        business_type: voter.business_type || '',
        business_type_other: voter.business_type_other || '',
        business_name: voter.business_name || '',
        gig_worker_type: voter.gig_worker_type || '',
        land_holding: voter.land_holding || '',
        crop_type: voter.crop_type || '',
        unemployment_reason: voter.unemployment_reason || '',
        work_experience: voter.work_experience || '',

        // Residence Info
        house_number: voter.house_number || '',
        street: voter.street || '',
        village_ward: voter.village_ward || '',
        post_office: voter.post_office || '',
        pin_code: voter.pin_code || '',
        residing_in: voter.residing_in || '',
        current_location: voter.current_location || '',
        permanent_resident_bihar: voter.permanent_resident_bihar || false,
        migrated: voter.migrated || false,
        migration_reason: voter.migration_reason || '',
        years_since_migration: voter.years_since_migration || '',
        house_type: voter.house_type || '',
        address_proof: voter.address_proof || '',
        landmark: voter.landmark || '',
        address_notes: voter.address_notes || '',

        // Feedback & Issues
        issues_faced: voter.issues_faced || [],
        other_issues: voter.other_issues || '',
        most_important_issue: voter.most_important_issue || '',
        govt_schemes: voter.govt_schemes || '',
        mla_satisfaction: voter.mla_satisfaction || null,
        development_suggestions: voter.development_suggestions || '',
        community_participation: voter.community_participation || false,
        family_contact_person: voter.family_contact_person || '',
        family_contact_number: voter.family_contact_number || '',
        additional_comments: voter.additional_comments || '',
        data_consent: voter.data_consent || false
      });
      setCurrentStep(0);
      setErrors({});
      setIsDirty(false);
    }
  }, [visible, voter]);

  // Handle keyboard events
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        Animated.timing(keyboardHeightAnim, {
          toValue: e.endCoordinates.height,
          duration: Platform.OS === 'ios' ? e.duration : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (e) => {
        setKeyboardHeight(0);
        Animated.timing(keyboardHeightAnim, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? e.duration : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // Handle back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        handleClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [visible, isDirty]);

  const handleDataChange = (newData) => {
    setFormData(newData);
    setIsDirty(true);
  };

  const handleClose = () => {
    if (isDirty) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to close?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Close', style: 'destructive', onPress: onClose }
        ]
      );
    } else {
      onClose();
    }
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    
    switch (stepIndex) {
      case 0: // Personal Info
        if (!formData.epic_id?.trim()) newErrors.epic_id = 'EPIC ID is required';
        if (!formData.name?.trim()) newErrors.name = 'Name is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        break;
      
      case 1: // Voting Behavior
        if (!formData.voting_preference) newErrors.voting_preference = 'Voting preference is required';
        break;
      
      case 2: // Cultural Info
        if (!formData.category) newErrors.category = 'Category is required';
        break;
      
      case 4: // Residence Info
        if (!formData.house_number?.trim()) newErrors.house_number = 'House number is required';
        if (!formData.village_ward?.trim()) newErrors.village_ward = 'Village/Ward is required';
        if (!formData.residing_in) newErrors.residing_in = 'Residence location is required';
        break;

      case 5: // Feedback
        if (!formData.data_consent) newErrors.data_consent = 'Data consent is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSave = () => {
    // Validate all steps before saving
    let allValid = true;
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        allValid = false;
        break;
      }
    }

    if (allValid) {
      onSave(formData);
      setIsDirty(false);
    } else {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
    }
  };

  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      {steps.map((step, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.progressDot,
            index <= currentStep && styles.progressDotActive,
            index === currentStep && styles.progressDotCurrent
          ]}
          onPress={() => setCurrentStep(index)}
        >
          <AppIcon
            name={step.icon}
            size={16}
            color={index <= currentStep ? '#FFFFFF' : '#9CA3AF'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStepContent = () => {
    const CurrentStepComponent = steps[currentStep].component;
    return (
      <CurrentStepComponent
        data={formData}
        onDataChange={handleDataChange}
        errors={errors}
      />
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <AppIcon name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Edit Voter Details</Text>
            <Text style={styles.headerSubtitle}>{steps[currentStep].title}</Text>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <AppIcon name="save" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Step Content */}
        <View style={styles.content}>
          {renderStepContent()}
        </View>

        {/* Navigation Footer */}
        <Animated.View style={[
          styles.footer,
          { paddingBottom: Math.max(15, keyboardHeightAnim) }
        ]}>
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton, currentStep === 0 && styles.navButtonDisabled]}
              onPress={handlePrevious}
              disabled={currentStep === 0}
            >
              <AppIcon name="chevron-left" size={28} color={currentStep === 0 ? '#9CA3AF' : '#FFFFFF'} />
            </TouchableOpacity>

            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>{currentStep + 1} of {steps.length}</Text>
            </View>

            {currentStep === steps.length - 1 ? (
              <TouchableOpacity style={[styles.navButton, styles.saveButton]} onPress={handleSave}>
                <AppIcon name="check" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={handleNext}>
                <AppIcon name="chevron-right" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  saveButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  progressDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  progressDotActive: {
    backgroundColor: '#10B981',
  },
  progressDotCurrent: {
    backgroundColor: '#3B82F6',
    transform: [{ scale: 1.1 }],
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  prevButton: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
  },
  nextButton: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  saveButton: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
  },
  navButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 24,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },


});

export default VoterEditModal;