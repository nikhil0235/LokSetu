import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Animated } from 'react-native';
import BackButton from '../../../components/common/BackButton';
import EnhancedInputField from '../../../components/common/EnhancedInputField';
import GradientButton from '../../../components/common/GradientButton';
import LoadingOverlay from '../../../components/common/LoadingOverlay';
import { ValidationRules } from '../../../utils/validation.enhanced';
import { storage } from '../../../utils/storage';

const COLORS = {
  PRIMARY: '#FF6B35',
  SECONDARY: '#5856D6',
  SUCCESS: '#34C759',
  ERROR: '#FF3B30',
};

const EnhancedOTPLoginScreen = ({ onNavigate, loginData, updateLoginData, onLoginSuccess, selectedRole }) => {
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [fieldValidation, setFieldValidation] = useState({});
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const countdownRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown]);

  const validateField = (field, value) => {
    const rule = ValidationRules[field];
    if (rule) {
      const isValid = rule.validate(value);
      setFieldValidation(prev => ({ ...prev, [field]: isValid }));
      setFormErrors(prev => ({
        ...prev,
        [field]: isValid ? null : rule.errorMessage
      }));
    }
  };

  const handleInputChange = (field, value) => {
    updateLoginData(field, value);
    validateField(field, value);
  };

  const startCountdown = () => {
    setCountdown(30);
    setCanResend(false);
  };

  // Dummy: Send OTP
  const dummySendOTP = async (phoneNumber) => {
    console.log(`Sending dummy OTP to +91${encodeURIComponent(phoneNumber)}`);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return true;
  };

  // Dummy: Verify OTP
  const dummyVerifyOTP = async (phoneNumber, otp) => {
    console.log(`Verifying dummy OTP for +91${encodeURIComponent(phoneNumber)}`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (otp === '123456') {
      return {
        token: 'dummy-token',
        user: {
          id: 2,
          name: 'OTP User',
          phoneNumber: `+91${phoneNumber}`,
        },
      };
    } else {
      throw new Error('Invalid OTP. Use 123456 for demo.');
    }
  };

  const handleSendOtp = async () => {
    if (!fieldValidation.phoneNumber) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      await dummySendOTP(loginData.phoneNumber);
      setShowOtpField(true);
      startCountdown();
      
      // Animate transition to OTP field
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      Alert.alert(
        'OTP Sent Successfully', 
        'A 6-digit OTP has been sent to your mobile number.\n\nFor demo: Use 123456',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!fieldValidation.otp) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await dummyVerifyOTP(loginData.phoneNumber, loginData.otp);
      
      // Record successful login
      await storage.recordLoginAttempt(true);
      await storage.setLastLogin();
      
      // Create user data for OTP login
      const userData = {
        username: loginData.phoneNumber,
        role: selectedRole,
        name: selectedRole === 'super_admin' ? 'Super Admin' : 
              selectedRole === 'admin' ? 'Admin' : 'OTP User',
        phone: `+91${loginData.phoneNumber}`,
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
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setLoading(true);
    try {
      await dummySendOTP(loginData.phoneNumber);
      startCountdown();
      Alert.alert('OTP Resent', 'A new OTP has been sent to your mobile number.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setShowOtpField(false);
    setCountdown(0);
    setCanResend(true);
    updateLoginData('phoneNumber', '');
    updateLoginData('otp', '');
    setFieldValidation({});
    setFormErrors({});
    
    // Animate back to phone input
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay 
        visible={loading} 
        message={showOtpField ? "Verifying OTP..." : "Sending OTP..."} 
        type="otp" 
      />
      
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <BackButton onPress={() => onNavigate('password')} />
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          {showOtpField 
            ? `Enter the 6-digit code sent to +91${loginData.phoneNumber}`
            : 'Enter your mobile number to receive OTP'
          }
        </Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.formContainer}>
          {!showOtpField ? (
            <>
              <EnhancedInputField
                label="Mobile Number"
                placeholder="Enter 10-digit mobile number"
                value={loginData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                keyboardType="phone-pad"
                maxLength={10}
                validation={ValidationRules.phoneNumber.validate}
                errorMessage={formErrors.phoneNumber}
                successMessage={fieldValidation.phoneNumber ? ValidationRules.phoneNumber.successMessage : null}
              />

              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>📱</Text>
                <Text style={styles.infoText}>
                  You'll receive a 6-digit verification code on this number
                </Text>
              </View>

              <GradientButton
                title={loading ? 'Sending OTP...' : 'Send OTP'}
                onPress={handleSendOtp}
                colors={[COLORS.SUCCESS, '#2c910eff']}
                disabled={!fieldValidation.phoneNumber || loading}
                loading={loading}
              />
            </>
          ) : (
            <>
              <View style={styles.phoneDisplay}>
                <Text style={styles.phoneLabel}>OTP sent to:</Text>
                <Text style={styles.phoneNumber}>+91 {loginData.phoneNumber}</Text>
                <TouchableOpacity onPress={handleChangeNumber}>
                  <Text style={styles.changeNumber}>Change Number</Text>
                </TouchableOpacity>
              </View>

              <EnhancedInputField
                label="Enter OTP"
                placeholder="6-digit verification code"
                value={loginData.otp}
                onChangeText={(value) => handleInputChange('otp', value)}
                keyboardType="number-pad"
                maxLength={6}
                validation={ValidationRules.otp.validate}
                errorMessage={formErrors.otp}
                successMessage={fieldValidation.otp ? ValidationRules.otp.successMessage : null}
                style={styles.otpInput}
              />

              <View style={styles.resendContainer}>
                {countdown > 0 ? (
                  <Text style={styles.countdownText}>
                    Resend OTP in {countdown}s
                  </Text>
                ) : (
                  <TouchableOpacity 
                    style={styles.resendButton} 
                    onPress={handleResendOtp}
                    disabled={!canResend || loading}
                  >
                    <Text style={[styles.resendText, (!canResend || loading) && styles.resendDisabled]}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <GradientButton
                title={loading ? 'Verifying...' : 'Verify & Login'}
                onPress={handleVerifyOtp}
                colors={[COLORS.SUCCESS, '#2c910eff']}
                disabled={!fieldValidation.otp || loading}
                loading={loading}
              />

              <View style={styles.helpBox}>
                <Text style={styles.helpIcon}>💡</Text>
                <Text style={styles.helpText}>
                  For demo purposes, use OTP: 123456
                </Text>
              </View>
            </>
          )}

          <TouchableOpacity 
            style={styles.switchOption}
            onPress={() => onNavigate('password')}
          >
            <Text style={styles.switchText}>Switch to Password Login</Text>
          </TouchableOpacity>
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
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formContainer: {
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  phoneDisplay: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  phoneLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  changeNumber: {
    fontSize: 14,
    color: COLORS.ERROR,
    fontWeight: '600',
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  resendButton: {
    paddingVertical: 10,
  },
  resendText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  resendDisabled: {
    color: '#8E8E93',
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  helpIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: '#F57C00',
    lineHeight: 20,
  },
  switchOption: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  switchText: {
    fontSize: 16,
    color: COLORS.SECONDARY,
    fontWeight: '600',
  },
});

export default EnhancedOTPLoginScreen;