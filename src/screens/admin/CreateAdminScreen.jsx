import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { apiClient } from '../../services/api/client';
import { ENDPOINTS } from '../../services/api/config';
import InputField from '../../components/common/InputField';
import PasswordInputField from '../../components/common/PasswordInputField';

const icons = {
  User: '👤',
  Mail: '📧',
  Phone: '📱',
  Lock: '🔒',
  Eye: '👁️',
  EyeOff: '🙈',
  X: '✖️',
  Shield: '🛡️',
};

const CreateAdminScreen = ({ onBack, onLogout }) => {
  const { user, token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    assigned_constituencies: [],
    assigned_booths: '',
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});


  const validateField = (name, value) => {
    switch (name) {
      case 'full_name':
        return !value.trim() ? 'Full name is required' : 
               value.trim().length < 2 ? 'Full name must be at least 2 characters' : '';
      case 'email':
        return !value ? 'Email is required' :
               !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : '';
      case 'phone':
        return !value ? 'Phone is required' :
               !/^[6-9]\d{9}$/.test(value.replace(/\D/g, '')) ? 'Invalid phone number' : '';
      case 'username':
        return !value ? 'Username is required' :
               value.length < 4 ? 'Username must be at least 4 characters' :
               !/^[a-zA-Z0-9_]+$/.test(value) ? 'Username can only contain letters, numbers, and underscores' : '';
      case 'password':
        return !value ? 'Password is required' :
               value.length < 8 ? 'Password must be at least 8 characters' :
               !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) ? 'Password must contain uppercase, lowercase, and number' : '';
      case 'confirmPassword':
        return !value ? 'Please confirm password' :
               value !== formData.password ? 'Passwords do not match' : '';
      case 'assigned_constituencies':
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'role' && key !== 'assigned_booths') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Only clear error if field becomes valid and was previously touched
    if (touched[field]) {
      const error = validateField(field, value);
      if (!error) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const constituencies = [
    'Constituency-1', 'Constituency-2', 'Constituency-3', 'Constituency-4',
    'Constituency-5', 'Constituency-6', 'Constituency-7', 'Constituency-8'
  ];



  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, assigned_constituencies, ...userData } = formData;
      const userPayload = {
        ...userData,
        assigned_booths: assigned_constituencies.join(',')
      };
      await apiClient.post(ENDPOINTS.USERS.CREATE, userPayload, token);
      
      Alert.alert(
        'Success!',
        `Admin "${formData.full_name}" has been created successfully.`,
        [
          { 
            text: 'Create Another', 
            onPress: () => {
              setFormData({
                full_name: '',
                email: '',
                phone: '',
                username: '',
                password: '',
                confirmPassword: '',
                role: 'admin',
                assigned_constituencies: [],
                assigned_booths: [],
              });
              setErrors({});
              setTouched({});
            }
          },
          { text: 'Go Back', onPress: () => onBack() }
        ]
      );
    } catch (error) {
      const errorMessage = error.message || 'Failed to create admin. Please try again.';
      if (error.message?.includes('username')) {
        setErrors(prev => ({ ...prev, username: 'Username already exists' }));
      } else if (error.message?.includes('email')) {
        setErrors(prev => ({ ...prev, email: 'Email already exists' }));
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const hasAllFields = formData.full_name && formData.email && formData.phone && 
      formData.username && formData.password && formData.confirmPassword;
    
    const hasNoErrors = Object.values(errors).every(error => !error);
    
    return hasAllFields && hasNoErrors;
  };

  const getFieldStyle = (fieldName) => {
    if (errors[fieldName]) {
      return styles.inputError;
    } else if (touched[fieldName] && formData[fieldName] && !errors[fieldName]) {
      return styles.inputSuccess;
    }
    return {};
  };



  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.iconText}>{icons.X}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Admin</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <InputField
            label="Full Name *"
            value={formData.full_name}
            onChangeText={(text) => handleFieldChange('full_name', text)}
            onBlur={() => handleFieldBlur('full_name')}
            placeholder="Enter full name"
            style={getFieldStyle('full_name')}
          />
          {errors.full_name && <Text style={styles.errorText}>{errors.full_name}</Text>}

          <InputField
            label="Email Address *"
            value={formData.email}
            onChangeText={(text) => handleFieldChange('email', text.toLowerCase())}
            onBlur={() => handleFieldBlur('email')}
            placeholder="Enter email address"
            keyboardType="email-address"
            style={getFieldStyle('email')}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <InputField
            label="Phone Number *"
            value={formData.phone}
            onChangeText={(text) => handleFieldChange('phone', text.replace(/\D/g, ''))}
            onBlur={() => handleFieldBlur('phone')}
            maxLength={10}
            placeholder="Enter 10-digit phone number"
            keyboardType="phone-pad"
            style={getFieldStyle('phone')}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Setup</Text>
          
          <InputField
            label="Username *"
            value={formData.username}
            onChangeText={(text) => handleFieldChange('username', text.toLowerCase())}
            onBlur={() => handleFieldBlur('username')}
            placeholder="Enter username (letters, numbers, underscore)"
            style={getFieldStyle('username')}
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

          <PasswordInputField
            label="Password *"
            value={formData.password}
            onChangeText={(text) => handleFieldChange('password', text)}
            onBlur={() => handleFieldBlur('password')}
            placeholder="Must contain: A-Z, a-z, 0-9, min 8 chars"
            style={getFieldStyle('password')}
            error={errors.password}
          />

          <PasswordInputField
            label="Confirm Password *"
            value={formData.confirmPassword}
            onChangeText={(text) => handleFieldChange('confirmPassword', text)}
            onBlur={() => handleFieldBlur('confirmPassword')}
            placeholder="Re-enter password"
            style={getFieldStyle('confirmPassword')}
            error={errors.confirmPassword}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Constituency Assignment</Text>
          <Text style={styles.inputLabel}>Select Constituencies *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dropdownContainer}>
            {constituencies.map((constituency) => {
              const isSelected = formData.assigned_constituencies.includes(constituency);
              return (
                <TouchableOpacity
                  key={constituency}
                  style={[
                    styles.dropdownOption,
                    isSelected && styles.selectedOption
                  ]}
                  onPress={() => {
                    const newValue = isSelected 
                      ? formData.assigned_constituencies.filter(c => c !== constituency)
                      : [...formData.assigned_constituencies, constituency];
                    handleFieldChange('assigned_constituencies', newValue);
                  }}
                >
                  <Text style={[
                    styles.dropdownText,
                    isSelected && styles.selectedText
                  ]}>
                    {constituency}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {errors.assigned_constituencies && <Text style={styles.errorText}>{errors.assigned_constituencies}</Text>}
          <Text style={styles.helperText}>Selected: {formData.assigned_constituencies.length} constituencies</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, (loading || !isFormValid()) && styles.submittingButton]}
          onPress={handleSubmit}
          disabled={loading || !isFormValid()}
        >
          <Text style={[styles.iconText, { color: '#FFFFFF' }]}>{icons.Shield}</Text>
          <Text style={styles.submitButtonText}>
            {loading ? 'Creating Admin...' : 'Create Admin'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  iconText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 32,
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
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
    marginRight: 8,
  },
  dropdownContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dropdownText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '500',
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
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submittingButton: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
    backgroundColor: '#FEF2F2',
  },
  inputSuccess: {
    borderColor: '#10B981',
    borderWidth: 2,
    backgroundColor: '#F0FDF4',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
    marginLeft: 4,
  },
  passwordToggle: {
    alignSelf: 'flex-end',
    marginTop: -10,
    marginBottom: 10,
  },
  toggleText: {
    color: '#6B7280',
    fontSize: 14,
  },
  helperText: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CreateAdminScreen;