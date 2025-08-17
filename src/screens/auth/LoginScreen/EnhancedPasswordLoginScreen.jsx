import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../store/authSlice';
import BackButton from '../../../components/common/BackButton';
import EnhancedInputField from '../../../components/common/EnhancedInputField';
import GradientButton from '../../../components/common/GradientButton';
import LoadingOverlay from '../../../components/common/LoadingOverlay';
import { ValidationRules, getPasswordStrength, debounce } from '../../../utils/validation.enhanced';
import { useBiometric } from '../../../hooks/useBiometric';
import { storage } from '../../../utils/storage';

const COLORS = {
  PRIMARY: '#FF6B35',
  SECONDARY: '#5856D6',
  SECONDARYDark: '#4B42AA',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  ERROR: '#FF3B30',
  BACKGROUND: '#F5F5F5',
  WHITE: '#FFFFFF',
  TEXT_PRIMARY: '#1C1C1E',
  TEXT_SECONDARY: '#8E8E93',
};

const EnhancedPasswordLoginScreen = ({ onNavigate, loginData, updateLoginData, onLoginSuccess, selectedRole }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  const { isAvailable: biometricAvailable, authenticate: biometricAuth } = useBiometric();
  
  const [loginMethod, setLoginMethod] = useState('password');
  const [formErrors, setFormErrors] = useState({});
  const [fieldValidation, setFieldValidation] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: 'No password', color: '#E0E0E0' });
  const [showBiometric, setShowBiometric] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    checkSavedCredentials();
  }, []);

  useEffect(() => {
    if (loginData.password) {
      setPasswordStrength(getPasswordStrength(loginData.password));
    }
  }, [loginData.password]);

  const checkSavedCredentials = async () => {
    try {
      const savedCredentials = await storage.getSavedCredentials();
      if (savedCredentials && biometricAvailable) {
        setShowBiometric(true);
        updateLoginData('username', savedCredentials.username);
      }
    } catch (error) {
      console.log('No saved credentials');
    }
  };

  const validateField = debounce((field, value) => {
    const rule = ValidationRules[field];
    if (rule) {
      const isValid = rule.validate(value);
      setFieldValidation(prev => ({ ...prev, [field]: isValid }));
      setFormErrors(prev => ({
        ...prev,
        [field]: isValid ? null : rule.errorMessage
      }));
    }
  }, 300);

  const handleInputChange = (field, value) => {
    updateLoginData(field, value);
    validateField(field, value);
  };

  const handleBiometricLogin = async () => {
    try {
      await biometricAuth('Authenticate to login to LokSetu');
      const savedCredentials = await storage.getSavedCredentials();
      if (savedCredentials) {
        const credentials = {
          username: savedCredentials.username,
          password: savedCredentials.password,
          selectedRole: selectedRole
        };
        
        const result = await dispatch(loginUser(credentials)).unwrap();
        const userData = {
          ...result,
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
    // Validate form
    const usernameValid = ValidationRules.username.validate(loginData.username);
    const passwordValid = ValidationRules.password.validate(loginData.password);
    
    if (!usernameValid || !passwordValid) {
      Alert.alert('Validation Error', 'Please check your input fields');
      return;
    }

    try {
      const credentials = {
        username: loginData.username,
        password: loginData.password,
        selectedRole: selectedRole
      };

      const result = await dispatch(loginUser(credentials)).unwrap();
      
      // Save credentials if remember me is checked
      if (rememberMe) {
        await storage.saveCredentials(credentials.username, credentials.password);
      }
      
      const userData = {
        ...result,
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

  const isFormValid = fieldValidation.username && fieldValidation.password;

  return (
    <View style={styles.container}>
      <LoadingOverlay 
        visible={isLoading} 
        message="Authenticating..." 
        type={loginMethod === 'biometric' ? 'biometric' : 'password'} 
      />
      
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <BackButton onPress={() => onNavigate('main')} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        
        {showBiometric && (
          <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
            <Text style={styles.biometricIcon}>🔐</Text>
            <Text style={styles.biometricText}>Use Biometric Login</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Login Method Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, loginMethod === 'password' && styles.activeTab]}
            onPress={() => setLoginMethod('password')}
          >
            <Text style={[styles.tabText, loginMethod === 'password' && styles.activeTabText]}>Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, loginMethod === 'otp' && styles.activeTab]}
            onPress={() => setLoginMethod('otp')}
          >
            <Text style={[styles.tabText, loginMethod === 'otp' && styles.activeTabText]}>OTP</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {loginMethod === 'password' ? (
            <>
              <EnhancedInputField
                label="Username/Mobile"
                placeholder="Enter username or mobile number"
                value={loginData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                validation={ValidationRules.username.validate}
                errorMessage={formErrors.username}
                successMessage={fieldValidation.username ? ValidationRules.username.successMessage : null}
              />

              <EnhancedInputField
                label="Password"
                placeholder="Enter your password"
                value={loginData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                validation={ValidationRules.password.validate}
                errorMessage={formErrors.password}
                successMessage={fieldValidation.password ? ValidationRules.password.successMessage : null}
              />

              {/* Password Strength Indicator */}
              {loginData.password && (
                <View style={styles.passwordStrength}>
                  <View style={styles.strengthBar}>
                    <View 
                      style={[
                        styles.strengthFill, 
                        { 
                          width: `${(passwordStrength.strength / 4) * 100}%`,
                          backgroundColor: passwordStrength.color 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}

              {/* Remember Me */}
              <TouchableOpacity 
                style={styles.rememberContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotPassword} onPress={() => onNavigate('forgotPassword')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <GradientButton
                title={isLoading ? 'Logging in...' : 'Login Securely'}
                onPress={handlePasswordLogin}
                colors={[COLORS.SECONDARY, COLORS.SECONDARYDark]}
                disabled={!isFormValid || isLoading}
                loading={isLoading}
              />
            </>
          ) : (
            <>
              <EnhancedInputField
                label="Phone Number"
                placeholder="Enter phone number"
                value={loginData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                keyboardType="phone-pad"
                validation={ValidationRules.phoneNumber.validate}
                errorMessage={formErrors.phoneNumber}
                successMessage={fieldValidation.phoneNumber ? ValidationRules.phoneNumber.successMessage : null}
              />
              <GradientButton
                title="Send OTP"
                onPress={() => onNavigate('otp')}
                colors={[COLORS.SUCCESS, '#2c910eff']}
                disabled={!fieldValidation.phoneNumber}
              />
            </>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  biometricIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  biometricText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5856D6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formContainer: {
    marginTop: 10,
    paddingBottom: 20,
  },
  passwordStrength: {
    marginBottom: 15,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 5,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#5856D6',
    borderColor: '#5856D6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberText: {
    fontSize: 14,
    color: '#666',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: COLORS.SECONDARY,
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#1C1C1E',
    fontWeight: '700',
  },
});

export default EnhancedPasswordLoginScreen;