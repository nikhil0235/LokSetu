import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppIcon } from '../../components/common';
import BackButton from '../../components/common/BackButton';
import EnhancedInputField from '../../components/common/EnhancedInputField';
import GradientButton from '../../components/common/GradientButton';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { ValidationRules } from '../../utils/validation.enhanced';
import { useAuthFlow } from '../../hooks/useAuthFlow';

const { width, height } = Dimensions.get('window');

const COLORS = {
  SECONDARY: '#5856D6',
  SECONDARYDark: '#4B42AA',
  SUCCESS: '#34C759',
  ERROR: '#FF3B30',
  WARNING: '#FF9500',
  INFO: '#007AFF',
};

// Enhanced role configuration with detailed permissions and styling
const ROLE_CONFIG = {
  super_admin: {
    title: 'Super Administrator',
    subtitle: 'Complete System Access',
    description: 'Full platform control with all administrative privileges',
    icon: 'shield-checkmark',
    colors: ['#FF6B6B', '#4ECDC4'],
    shadowColor: '#FF6B6B',
    permissions: [
      'System-wide configuration',
      'User management & roles',
      'Financial oversight',
      'Analytics & reporting',
      'Security management'
    ],
    features: [
      'Dashboard Analytics',
      'User Administration',
      'System Settings',
      'Audit Logs',
      'Backup Management'
    ]
  },
  admin: {
    title: 'Administrator',
    subtitle: 'Regional Management',
    description: 'Regional oversight with administrative capabilities',
    icon: 'person-circle',
    colors: ['#667eea', '#764ba2'],
    shadowColor: '#667eea',
    permissions: [
      'Regional user management',
      'Booth operations oversight',
      'Performance monitoring',
      'Report generation',
      'Customer support'
    ],
    features: [
      'Regional Dashboard',
      'Booth Management',
      'Performance Reports',
      'User Support',
      'Inventory Overview'
    ]
  },
  booth_boy: {
    title: 'Booth Operator',
    subtitle: 'Field Operations',
    description: 'On-ground operations and customer service',
    icon: 'storefront',
    colors: ['#11998e', '#38ef7d'],
    shadowColor: '#11998e',
    permissions: [
      'Customer registration',
      'Service delivery',
      'Payment processing',
      'Inventory management',
      'Customer support'
    ],
    features: [
      'Customer Portal',
      'Service Management',
      'Payment Gateway',
      'Inventory Tools',
      'Daily Reports'
    ]
  }
};

const getRoleConfig = (role) => ROLE_CONFIG[role] || ROLE_CONFIG.booth_boy;

const EnhancedUnifiedLoginScreen = ({ onNavigate, selectedRole, onLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState('password');
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const roleInfoAnim = useRef(new Animated.Value(0)).current;
  
  // Preloaded credentials
  const preloadedCredentials = {
    super_admin: { username: 'nikh01', password: 'nikh123' },
    admin: { username: 'admin', password: 'admin123' }
  };
  
  const roleConfig = getRoleConfig(selectedRole);
  
  const {
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
  } = useAuthFlow(selectedRole, onLoginSuccess);

  useEffect(() => {
    // Preload credentials based on role
    if (preloadedCredentials[selectedRole]) {
      updateField('username', preloadedCredentials[selectedRole].username);
      updateField('password', preloadedCredentials[selectedRole].password);
    }
    
    Animated.parallel([
      Animated.timing(fadeAnim, { 
        toValue: 1, 
        duration: 600, 
        useNativeDriver: true 
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true
      })
    ]).start();
  }, [selectedRole]);

  const toggleRoleInfo = () => {
    setShowRoleInfo(!showRoleInfo);
    Animated.timing(roleInfoAnim, {
      toValue: showRoleInfo ? 0 : 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const handleSuccessfulLogin = () => {
    Alert.alert(
      'Login Successful',
      `Welcome back, ${roleConfig.title}! You now have access to ${roleConfig.subtitle.toLowerCase()}.`,
      [{ text: 'Continue', onPress: onLoginSuccess }]
    );
  };

  const renderPasswordForm = () => (
    <View style={styles.formSection}>
      <EnhancedInputField
        label="Username/Mobile"
        value={formData.username}
        onChangeText={(value) => updateField('username', value)}
        validation={ValidationRules.username.validate}
        errorMessage={formState.errors.username}
        successMessage={formState.validation.username ? ValidationRules.username.successMessage : null}
        leftIcon="person-outline"
        style={styles.inputField}
      />

      <EnhancedInputField
        label="Password"
        value={formData.password}
        onChangeText={(value) => updateField('password', value)}
        secureTextEntry
        validation={ValidationRules.password.validate}
        errorMessage={formState.errors.password}
        successMessage={formState.validation.password ? ValidationRules.password.successMessage : null}
        leftIcon="lock-closed-outline"
        style={styles.inputField}
      />

      {formData.password && (
        <Animated.View style={[styles.passwordStrength, { opacity: fadeAnim }]}>
          <View style={styles.strengthBar}>
            <Animated.View style={[styles.strengthFill, { 
              width: `${(formState.passwordStrength.strength / 4) * 100}%`,
              backgroundColor: formState.passwordStrength.color 
            }]} />
          </View>
          <View style={styles.strengthTextContainer}>
            <Text style={[styles.strengthText, { color: formState.passwordStrength.color }]}>
              {formState.passwordStrength.label}
            </Text>
            <AppIcon 
              name={formState.passwordStrength.strength >= 3 ? "check-circle" : "error"} 
              size={16} 
              color={formState.passwordStrength.color} 
            />
          </View>
        </Animated.View>
      )}

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.rememberContainer} onPress={toggleRememberMe}>
          <Animated.View style={[
            styles.checkbox, 
            formState.rememberMe && styles.checkboxChecked,
            { transform: [{ scale: formState.rememberMe ? 1.1 : 1 }] }
          ]}>
            {formState.rememberMe && <AppIcon name="check" size={14} color="#FFFFFF" />}
          </Animated.View>
          <Text style={styles.rememberText}>Remember me</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword} onPress={() => onNavigate('forgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <GradientButton
        title={isLoading ? 'Authenticating...' : `Login as ${roleConfig.title}`}
        onPress={handlePasswordLogin}
        colors={roleConfig.colors}
        disabled={isLoading}
        style={styles.loginButton}
        icon="log-in-outline"
      />

      {/* Biometric Login Option */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity 
          style={styles.biometricContainer}
          onPress={handleBiometricLogin}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
            style={styles.biometricButton}
          >
            <AppIcon name="fingerprint" size={24} color={roleConfig.colors[0]} />
            <Text style={[styles.biometricText, { color: roleConfig.colors[0] }]}>
              Use Biometric Login
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderOtpForm = () => (
    <View style={styles.formSection}>
      {!formState.showOtpField ? (
        <>
          <Text style={styles.otpInstructions}>
            We'll send a secure OTP to verify your identity
          </Text>
          <EnhancedInputField
            label="Mobile Number"
            value={formData.phoneNumber}
            onChangeText={(value) => updateField('phoneNumber', value)}
            keyboardType="phone-pad"
            maxLength={10}
            validation={ValidationRules.phoneNumber.validate}
            errorMessage={formState.errors.phoneNumber}
            successMessage={formState.validation.phoneNumber ? ValidationRules.phoneNumber.successMessage : null}
            leftIcon="call-outline"
            prefix="+91 "
          />
          <GradientButton
            title="Send OTP"
            onPress={handleSendOtp}
            colors={[COLORS.SUCCESS, '#2c910eff']}
            disabled={!formState.validation.phoneNumber}
            icon="send-outline"
          />
        </>
      ) : (
        <>
          <View style={styles.phoneDisplay}>
            <AppIcon name="check-circle" size={32} color={COLORS.SUCCESS} />
            <Text style={styles.phoneLabel}>OTP sent to: +91 {formData.phoneNumber}</Text>
            <TouchableOpacity onPress={resetOtpFlow} style={styles.changeNumberButton}>
              <Text style={styles.changeNumber}>Change Number</Text>
            </TouchableOpacity>
          </View>

          <EnhancedInputField
            label="Enter 6-digit OTP"
            value={formData.otp}
            onChangeText={(value) => updateField('otp', value)}
            keyboardType="number-pad"
            maxLength={6}
            validation={ValidationRules.otp.validate}
            errorMessage={formState.errors.otp}
            successMessage={formState.validation.otp ? ValidationRules.otp.successMessage : null}
            style={styles.otpInput}
            leftIcon="keypad-outline"
          />

          <View style={styles.resendContainer}>
            {formState.countdown > 0 ? (
              <View style={styles.countdownContainer}>
                <AppIcon name="schedule" size={16} color="#8E8E93" />
                <Text style={styles.countdownText}>Resend OTP in {formState.countdown}s</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={handleResendOtp} style={styles.resendButton}>
                <AppIcon name="refresh" size={16} color={COLORS.INFO} />
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          <GradientButton
            title="Verify & Login"
            onPress={handleVerifyOtp}
            colors={roleConfig.colors}
            disabled={!formState.validation.otp}
            icon="shield-checkmark-outline"
          />

          <View style={styles.helpBox}>
            <AppIcon name="lightbulb" size={20} color="#10B981" />
            <Text style={styles.helpText}>For demo: Use OTP 123456</Text>
          </View>
        </>
      )}
    </View>
  );

  const renderRoleInfo = () => (
    <Animated.View style={[
      styles.roleInfoContainer,
      {
        opacity: roleInfoAnim,
        transform: [{
          translateY: roleInfoAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-20, 0]
          })
        }]
      }
    ]}>
      <ScrollView style={styles.roleInfoScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.roleInfoHeader}>
          <LinearGradient
            colors={roleConfig.colors}
            style={styles.roleInfoIcon}
          >
            <AppIcon name="admin-panel-settings" size={32} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.roleInfoTitle}>{roleConfig.title}</Text>
          <Text style={styles.roleInfoDescription}>{roleConfig.description}</Text>
        </View>

        <View style={styles.permissionsSection}>
          <Text style={styles.sectionTitle}>Key Permissions</Text>
          {roleConfig.permissions.map((permission, index) => (
            <View key={index} style={styles.permissionItem}>
              <AppIcon name="check-circle" size={16} color={roleConfig.colors[0]} />
              <Text style={styles.permissionText}>{permission}</Text>
            </View>
          ))}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Available Features</Text>
          {roleConfig.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <AppIcon name="arrow-forward" size={16} color={roleConfig.colors[1]} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} style={styles.container}>
      <LoadingOverlay visible={isLoading} message="Authenticating..." type={loginMethod} />
      
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => onNavigate('main')} />
          <TouchableOpacity onPress={toggleRoleInfo} style={styles.infoButton}>
            <AppIcon name="info" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Animated.View style={[
          styles.roleHeader,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-30, 0]
              })
            }]
          }
        ]}>
          <LinearGradient
            colors={roleConfig.colors}
            style={styles.roleIconContainer}
          >
            <AppIcon name="admin-panel-settings" size={28} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.roleTextContainer}>
            <Text style={styles.roleTitle}>{roleConfig.title}</Text>
            <Text style={styles.roleSubtitle}>{roleConfig.subtitle}</Text>
          </View>
          <View style={styles.statusBadge}>
            <AppIcon name="security" size={14} color={roleConfig.colors[0]} />
            <Text style={[styles.statusText, { color: roleConfig.colors[0] }]}>Secure</Text>
          </View>
        </Animated.View>
      </View>

      {showRoleInfo && renderRoleInfo()}

      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }]
        }
      ]}>
        <View style={[styles.loginCard, { shadowColor: roleConfig.shadowColor }]}>
          <View style={styles.glassOverlay} />
          
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, loginMethod === 'password' && styles.activeTab]}
              onPress={() => setLoginMethod('password')}
            >
              <AppIcon 
                name="lock" 
                size={18} 
                color={loginMethod === 'password' ? roleConfig.colors[0] : '#9CA3AF'} 
              />
              <Text style={[
                styles.tabText, 
                loginMethod === 'password' && [styles.activeTabText, { color: roleConfig.colors[0] }]
              ]}>
                Password
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, loginMethod === 'otp' && styles.activeTab]}
              onPress={() => setLoginMethod('otp')}
            >
              <AppIcon 
                name="phone" 
                size={18} 
                color={loginMethod === 'otp' ? roleConfig.colors[0] : '#9CA3AF'} 
              />
              <Text style={[
                styles.tabText, 
                loginMethod === 'otp' && [styles.activeTabText, { color: roleConfig.colors[0] }]
              ]}>
                OTP
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            {loginMethod === 'password' ? renderPasswordForm() : renderOtpForm()}
          </View>
        </View>
      </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 50 : 30, 
    paddingHorizontal: 25, 
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  infoButton: {
    padding: 5,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  roleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  roleInfoContainer: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    maxHeight: height * 0.6,
    zIndex: 1000,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  roleInfoScroll: {
    padding: 20,
  },
  roleInfoHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  roleInfoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleInfoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  roleInfoDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  permissionsSection: {
    marginBottom: 20,
  },
  featuresSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  permissionText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  content: { 
    position: 'fixed',
    bottom: -20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 10,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 30,
    minHeight: height * 0.7,
    maxHeight: height * 0.95,
    elevation: 25,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    position: 'relative',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(102, 126, 234, 0.1)', 
    borderRadius: 20, 
    padding: 4, 
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  tab: { 
    flex: 1, 
    flexDirection: 'row',
    paddingVertical: 14, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 16,
    gap: 8,
  },
  activeTab: { 
    backgroundColor: '#FFFFFF', 
    shadowColor: '#667eea', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    elevation: 6 
  },
  tabText: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#9CA3AF' 
  },
  activeTabText: { 
    fontWeight: '700' 
  },
  formContainer: { 
    flex: 1, 
  },
  formSection: {
    paddingBottom: 20,
  },
  inputField: {
    marginBottom: 2,
  },
  otpInstructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },
  passwordStrength: { 
    marginBottom: 20 
  },
  strengthBar: { 
    height: 6, 
    backgroundColor: '#E0E0E0', 
    borderRadius: 3, 
    marginBottom: 8,
    overflow: 'hidden',
  },
  strengthFill: { 
    height: '100%', 
    borderRadius: 3,
    minWidth: 2,
  },
  strengthTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthText: { 
    fontSize: 12, 
    fontWeight: '600' 
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  rememberContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  checkbox: { 
    width: 22, 
    height: 22, 
    borderWidth: 2, 
    borderColor: '#E0E0E0', 
    borderRadius: 6, 
    marginRight: 10, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: { 
    backgroundColor: '#5856D6', 
    borderColor: '#5856D6' 
  },
  rememberText: { 
    fontSize: 14, 
    color: '#666',
    fontWeight: '500',
  },
  forgotPassword: { 
    padding: 5,
  },
  forgotPasswordText: { 
    color: '#FF9933', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  loginButton: {
    marginBottom: 20,
  },
  biometricContainer: {
    marginTop: 10,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    gap: 10,
  },
  biometricText: {
    fontSize: 16,
    fontWeight: '600',
  },
  phoneDisplay: { 
    backgroundColor: 'rgba(52, 199, 89, 0.1)', 
    padding: 10, 
    borderRadius: 16, 
    marginBottom: 20, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.2)',
    gap: 6,
  },
  phoneLabel: { 
    fontSize: 16, 
    color: '#333',
    fontWeight: '600',
  },
  changeNumberButton: {
    padding: 8,
  },
  changeNumber: { 
    fontSize: 14, 
    color: COLORS.ERROR, 
    fontWeight: '600' 
  },
  otpInput: { 
    textAlign: 'center', 
    fontSize: 22, 
    fontWeight: '700', 
    letterSpacing: 6,
  },
  resendContainer: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countdownText: { 
    fontSize: 14, 
    color: '#8E8E93',
    fontWeight: '500',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
  },
  resendText: { 
    fontSize: 16, 
    color: COLORS.INFO, 
    fontWeight: '600' 
  },
  helpBox: { 
    backgroundColor: 'rgba(16, 185, 129, 0.1)', 
    padding: 16, 
    borderRadius: 16, 
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helpText: { 
    fontSize: 14, 
    color: '#10B981', 
    fontWeight: '600',
    flex: 1,
  },
});

export default EnhancedUnifiedLoginScreen;