import React from 'react';
import { Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ReusableForm } from '../components/common';
import { getFormConfig, hasPermission } from '../config/userRoleConfig';
import { createUser } from '../store/userSlice';
import { loadAdminDashboardData } from '../store/slices/adminDashboardSlice';

const UnifiedCreateUserScreen = ({ 
  userType = 'CREATE_BOOTH_VOLUNTEER', // or 'CREATE_ADMIN'
  onBack, 
  onLogout 
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { isLoading } = useSelector(state => state.users);

  // Get form configuration based on user type
  const formConfig = getFormConfig(userType);

  if (!formConfig) {
    Alert.alert('Error', 'Invalid user type configuration');
    return null;
  }

  // Check permissions
  if (!hasPermission(user?.role, 'users', 'create')) {
    Alert.alert('Access Denied', 'You do not have permission to create users');
    onBack();
    return null;
  }

  const handleSubmit = async (formData) => {
    try {
      // Set default role based on form type
      let userData = { ...formData };
      
      if (userType === 'CREATE_BOOTH_VOLUNTEER') {
        userData.role = 'booth_volunteer';
      }
      
      // Remove confirmPassword before submission
      const { confirmPassword, ...submitData } = userData;
      
      await dispatch(createUser(submitData)).unwrap();
      
      // Refresh dashboard data to update stats
      if (user?.role !== 'super_admin') {
        dispatch(loadAdminDashboardData(true));
      }
      
      const userTypeName = userType === 'CREATE_ADMIN' ? 'Admin User' : 'Booth Volunteer';
      
      Alert.alert(
        'Success!',
        `${userTypeName} "${formData.full_name}" has been created successfully.`,
        [
          { 
            text: 'Create Another', 
            onPress: () => {
              // Form will reset automatically
            }
          },
          { text: 'Go Back', onPress: onBack }
        ]
      );
    } catch (error) {
      const errorMessage = error || 'Failed to create user. Please try again.';
      throw new Error(errorMessage);
    }
  };

  // Set initial data with test values for development
  const initialData = userType === 'CREATE_BOOTH_VOLUNTEER' ? {
    full_name: 'Test Booth Volunteer',
    email: 'testvolunteer@example.com',
    phone: '9876543210',
    username: 'testvolunteer123',
    password: 'TestPass123',
    confirmPassword: 'TestPass123',
  } : {
    full_name: 'Test Admin',
    email: 'testadmin@example.com',
    phone: '9876543210',
    username: 'testadmin123',
    password: 'TestPass123',
    confirmPassword: 'TestPass123',
    role: 'political_party'
  };

  return (
    <ReusableForm
      title={formConfig.title}
      sections={formConfig.sections}
      onSubmit={handleSubmit}
      onBack={onBack}
      onLogout={onLogout}
      submitButtonText={formConfig.submitButtonText}
      submitIcon={formConfig.submitIcon}
      isLoading={isLoading}
      initialData={initialData}
      validationRules={formConfig.validationRules}
      showPermissions={formConfig.permissions && formConfig.permissions.length > 0}
      permissions={formConfig.permissions || []}
    />
  );
};

export default UnifiedCreateUserScreen;