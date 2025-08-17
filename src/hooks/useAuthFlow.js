import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { ValidationRules, getPasswordStrength } from '../utils/validation.enhanced';
import { useBiometric } from './useBiometric';
import { storage } from '../utils/storage';

export const useAuthFlow = (selectedRole, onLoginSuccess) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);
  const { isAvailable: biometricAvailable, authenticate: biometricAuth } = useBiometric();
  
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'admin123',
    phoneNumber: '',
    otp: ''
  });
  
  const [formState, setFormState] = useState({
    errors: {},
    validation: {},
    passwordStrength: { strength: 0, label: 'No password', color: '#E0E0E0' },
    showBiometric: false,
    rememberMe: false,
    showOtpField: false,
    countdown: 0
  });

  useEffect(() => {
    if (formData.password) {
      setFormState(prev => ({ ...prev, passwordStrength: getPasswordStrength(formData.password) }));
    }
  }, [formData.password]);

  useEffect(() => {
    checkSavedCredentials();
  }, []);

  useEffect(() => {
    if (formState.countdown > 0) {
      const timer = setTimeout(() => 
        setFormState(prev => ({ ...prev, countdown: prev.countdown - 1 })), 1000
      );
      return () => clearTimeout(timer);
    }
  }, [formState.countdown]);

  const checkSavedCredentials = async () => {
    try {
      const savedCredentials = await storage.getSavedCredentials();
      if (savedCredentials && biometricAvailable) {
        setFormState(prev => ({ ...prev, showBiometric: true }));
        updateField('username', savedCredentials.username);
      }
    } catch (error) {
      console.log('No saved credentials');
    }
  };

  const validateField = (field, value) => {
    const rule = ValidationRules[field];
    if (rule) {
      const isValid = rule.validate(value);
      setFormState(prev => ({
        ...prev,
        validation: { ...prev.validation, [field]: isValid },
        errors: { ...prev.errors, [field]: isValid ? null : rule.errorMessage }
      }));
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };



  const handleBiometricLogin = async () => {
    try {
      await biometricAuth('Authenticate to login to LokSetu');
      const savedCredentials = await storage.getSavedCredentials();
      if (savedCredentials) {
        const result = await dispatch(loginUser({
          username: savedCredentials.username,
          password: savedCredentials.password,
          selectedRole
        })).unwrap();
        
        const userData = {
          ...result,
          name: result.fullname || 
                (selectedRole === 'super_admin' ? 'Super Admin' : 
                 selectedRole === 'admin' ? 'Admin' : result.name),
          ...(selectedRole === 'booth_boy' && {
            assignedBooths: result.assigned_booths || [],
            constituency: result.constituency,
            area: result.area,
            totalVoters: result.totalVoters || 0
          })
        };
        
        onLoginSuccess(userData);
      }
    } catch (error) {
      Alert.alert('Biometric Authentication Failed', error.message);
    }
  };

  const handlePasswordLogin = async () => {
    if (!formState.validation.username || !formState.validation.password) {
      Alert.alert('Validation Error', 'Please check your input fields');
      return;
    }

    try {
      const credentials = { 
        username: formData.username, 
        password: formData.password, 
        selectedRole 
      };
      
      const result = await dispatch(loginUser(credentials)).unwrap();
      
      if (formState.rememberMe) {
        await storage.saveCredentials(credentials.username, credentials.password);
      }
      
      // Handle different user types
      const userData = {
        ...result,
        name: result.fullname || 
              (selectedRole === 'super_admin' ? 'Super Admin' : 
               selectedRole === 'admin' ? 'Admin' : result.name),
        ...(selectedRole === 'booth_boy' && {
          assignedBooths: result.assigned_booths || [],
          constituency: result.constituency,
          area: result.area,
          totalVoters: result.totalVoters || 0
        })
      };
      
      onLoginSuccess(userData);
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    }
  };

  const handleSendOtp = async () => {
    if (!formState.validation.phoneNumber) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormState(prev => ({ ...prev, showOtpField: true, countdown: 30 }));
      Alert.alert('OTP Sent', 'Use 123456 for demo');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formState.validation.otp) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (formData.otp !== '123456') {
        throw new Error('Invalid OTP. Use 123456 for demo.');
      }
      
      await storage.recordLoginAttempt(true);
      await storage.setLastLogin();
      
      const userData = {
        username: formData.phoneNumber,
        role: selectedRole,
        name: selectedRole === 'super_admin' ? 'Super Admin' : 
              selectedRole === 'admin' ? 'Admin' : 'OTP User',
        phone: `+91${formData.phoneNumber}`,
        loginMethod: 'otp',
        ...(selectedRole === 'booth_boy' && {
          id: 'BB002',
          assignedBooths: ['B004', 'B005'],
          constituency: 'Constituency-2',
          area: 'South Zone',
          totalVoters: 1523
        })
      };
      
      onLoginSuccess(userData);
    } catch (error) {
      await storage.recordLoginAttempt(false);
      Alert.alert('Verification Failed', error.message);
    }
  };

  const handleResendOtp = async () => {
    if (formState.countdown > 0) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormState(prev => ({ ...prev, countdown: 30 }));
      Alert.alert('OTP Resent', 'A new OTP has been sent.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const resetOtpFlow = () => {
    setFormState(prev => ({ 
      ...prev, 
      showOtpField: false, 
      countdown: 0,
      validation: {},
      errors: {}
    }));
    setFormData(prev => ({ ...prev, phoneNumber: '', otp: '' }));
  };

  const toggleRememberMe = () => {
    setFormState(prev => ({ ...prev, rememberMe: !prev.rememberMe }));
  };

  return {
    formData,
    formState,
    isLoading,
    updateField,
    handleBiometricLogin,
    handlePasswordLogin,
    handleSendOtp,
    handleVerifyOtp,
    handleResendOtp,
    resetOtpFlow,
    toggleRememberMe
  };
};