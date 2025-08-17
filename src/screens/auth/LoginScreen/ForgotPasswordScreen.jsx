import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../../components/common/BackButton';
import { authApi } from '../../../services/api/auth.api';

const { width } = Dimensions.get('window');

const ForgotPasswordScreen = ({ onNavigate, loginData, updateLoginData }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your username or email');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.forgotPassword(email.trim());
      setEmailSent(true);
      
      // Animate success state
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to send reset link. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    setEmail('');
  };

  if (emailSent) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.safeArea}
        >
          <Animated.View 
            style={[
              styles.successCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.successIconBox}>
              <Text style={styles.successIcon}>✉️</Text>
            </View>
            
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successMessage}>
              We've sent a password reset link to{' '}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
            
            <View style={styles.instructionsBox}>
              <View style={styles.instructionItem}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>Check your email inbox</Text>
              </View>
              <View style={styles.instructionItem}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>Click the reset link</Text>
              </View>
              <View style={styles.instructionItem}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>Create a new password</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={handleResendEmail}
              >
                <Text style={styles.resendText}>Send to different email</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => onNavigate('password')}
              >
                <LinearGradient 
                  colors={['#667eea', '#764ba2']} 
                  style={styles.backGradient}
                >
                  <Text style={styles.backButtonText}>Back to Login</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

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
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
          
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            No worries! Enter your email and we'll send you a reset link
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
            <Text style={styles.inputLabel}>Username or Email</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your username or email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.sendButton, (!email.trim() || loading) && styles.buttonDisabled]}
            onPress={handleSendResetLink}
            disabled={!email.trim() || loading}
          >
            <LinearGradient 
              colors={(!email.trim() || loading) ? ['#9CA3AF', '#6B7280'] : ['#667eea', '#764ba2']} 
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
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
    marginBottom: 30,
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
  sendButton: {
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
  // Success Screen Styles
  successCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  successIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    fontSize: 45,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  emailText: {
    fontWeight: '600',
    color: '#667eea',
  },
  instructionsBox: {
    width: '100%',
    marginBottom: 40,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#667eea',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
    marginRight: 15,
  },
  stepText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  actionButtons: {
    width: '100%',
    marginTop: 'auto',
    paddingBottom: 30,
  },
  resendButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  resendText: {
    fontSize: 15,
    color: '#667eea',
    fontWeight: '600',
  },
  backButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  backGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ForgotPasswordScreen;
