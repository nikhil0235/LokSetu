import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../../components/common/BackButton';
import { authApi } from '../../../services/api/auth.api';

const ResetPasswordScreen = ({ onNavigate, resetToken }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!resetToken) {
      Alert.alert('Error', 'Invalid reset token');
      return;
    }

    setLoading(true);
    try {
      console.log('Resetting password with token:', resetToken);
      const response = await authApi.resetPassword(resetToken, newPassword);
      console.log('Reset password response:', response.data);
      Alert.alert(
        'Success',
        'Password reset successful! You can now login with your new password.',
        [{ text: 'OK', onPress: () => onNavigate('password') }]
      );
    } catch (error) {
      console.error('Reset password error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to reset password. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = newPassword.length >= 6 && newPassword === confirmPassword;

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.safeArea}
      >
        <Animated.View 
          style={[
            styles.headerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.backButtonContainer}>
            <BackButton onPress={() => onNavigate('password')} />
          </View>
          
          <View style={styles.logoBox}>
            <Text style={styles.lockIcon}>🔑</Text>
          </View>
          
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your new password below
          </Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.formCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter new password"
                placeholderTextColor="#9CA3AF"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Confirm new password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {newPassword.length > 0 && (
            <View style={styles.passwordRequirements}>
              <Text style={[
                styles.requirementText,
                newPassword.length >= 6 ? styles.requirementMet : styles.requirementNotMet
              ]}>
                ✓ At least 6 characters
              </Text>
              {confirmPassword.length > 0 && (
                <Text style={[
                  styles.requirementText,
                  newPassword === confirmPassword ? styles.requirementMet : styles.requirementNotMet
                ]}>
                  ✓ Passwords match
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity 
            style={[styles.resetButton, (!isFormValid || loading) && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={!isFormValid || loading}
          >
            <LinearGradient 
              colors={(!isFormValid || loading) ? ['#9CA3AF', '#6B7280'] : ['#667eea', '#764ba2']} 
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.helpSection}>
            <Text style={styles.helpText}>Remember your password?</Text>
            <TouchableOpacity onPress={() => onNavigate('password')}>
              <Text style={styles.loginLink}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: 60,
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  backButtonContainer: {
    position: 'absolute',
    left: 30,
    top: 0,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  lockIcon: {
    fontSize: 35,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  formCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  inputSection: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: '#374151',
  },
  eyeButton: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 18,
  },
  passwordRequirements: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  requirementText: {
    fontSize: 14,
    marginBottom: 4,
  },
  requirementMet: {
    color: '#10B981',
  },
  requirementNotMet: {
    color: '#EF4444',
  },
  resetButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 25,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  helpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  helpText: {
    fontSize: 15,
    color: '#6B7280',
    marginRight: 5,
  },
  loginLink: {
    fontSize: 15,
    color: '#667eea',
    fontWeight: '600',
  },
});

export default ResetPasswordScreen;