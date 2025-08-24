import React, { useState, useEffect } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { createUser } from '../../store/userSlice';
import { loadAdminDashboardData } from '../../store/slices/adminDashboardSlice';
import InputField from '../../components/common/InputField';
import PasswordInputField from '../../components/common/PasswordInputField';

import { AppIcon, BackButton } from '../../components/common';

const CreateBoothBoyScreen = ({ onBack }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const { isLoading } = useSelector(state => state.users);
  
  const [formData, setFormData] = useState({
    full_name: 'Test Booth Boy',
    email: 'testboothboy@example.com',
    phone: '9876543210',
    username: 'testboothboy123',
    password: 'TestPass123',
    confirmPassword: 'TestPass123',
    role: 'booth_boy',
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

      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'role') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors before submitting.');
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      
      await dispatch(createUser(userData)).unwrap();
      
      // Refresh admin dashboard data to update created users list
      dispatch(loadAdminDashboardData(true));
      
      Alert.alert(
        'Success!',
        `Booth Boy "${formData.full_name}" has been created successfully.`,
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
                role: 'booth_boy',
              });
              setErrors({});
              setTouched({});
            }
          },
          { text: 'Go Back', onPress: () => onBack() }
        ]
      );
    } catch (error) {
      const errorMessage = error || 'Failed to create booth boy. Please try again.';
      if (errorMessage?.includes('username')) {
        setErrors(prev => ({ ...prev, username: 'Username already exists' }));
      } else if (errorMessage?.includes('email')) {
        setErrors(prev => ({ ...prev, email: 'Email already exists' }));
      }
      Alert.alert('Error', errorMessage);
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.headerTitle}>Create Booth Boy</Text>
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
          <Text style={styles.sectionTitle}>Default Permissions</Text>
          <View style={styles.permissionsInfo}>
            <Text style={styles.permissionItem}>✓ View assigned booth voter lists</Text>
            <Text style={styles.permissionItem}>✓ Edit voter information</Text>
            <Text style={styles.permissionItem}>✓ Export voter data</Text>
            <Text style={styles.permissionItem}>✓ Sync data offline</Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, (isLoading || !isFormValid()) && styles.submittingButton]}
          onPress={handleSubmit}
          disabled={isLoading || !isFormValid()}
        >
          <AppIcon name="person-add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Creating Booth Boy...' : 'Create Booth Boy'}
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

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
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
  permissionsInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
  },
  permissionItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
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
  helperText: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },

});

export default CreateBoothBoyScreen;