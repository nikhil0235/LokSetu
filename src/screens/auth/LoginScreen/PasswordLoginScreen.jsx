// screens/PasswordLoginScreen.js
import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../store/authSlice';
import LoginCard from '../../../components/common/LoginCard';
import BackButton from '../../../components/common/BackButton';
import ScreenHeader from '../../../components/common/ScreenHeader';
import InputField from '../../../components/common/InputField';
import GradientButton from '../../../components/common/GradientButton';
import SwitchOption from '../../../components/common/SwitchOption';

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

const PasswordLoginScreen = ({ onNavigate, loginData, updateLoginData, onLoginSuccess, selectedRole }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  const [loginMethod, setLoginMethod] = useState('password');

  const handlePasswordLogin = async () => {
    try {
      const credentials = {
        username: loginData.username,
        password: loginData.password,
        selectedRole: selectedRole
      };
      
      console.warn ("logninData", credentials);

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
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    }
  };

  const isFormValid =
    loginData.username && loginData.username.length >= 3 &&
    loginData.password && loginData.password.length >= 6;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => onNavigate('main')} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.content}>
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
              <InputField
                label="Username/Mobile"
                placeholder="Enter username or mobile number"
                value={loginData.username}
                onChangeText={(value) => updateLoginData('username', value)}
              />

              <InputField
                label="Password"
                placeholder="Enter your password"
                value={loginData.password}
                onChangeText={(value) => updateLoginData('password', value)}
                secureTextEntry
              />

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
              <InputField
                label="Phone Number"
                placeholder="Enter phone number"
                value={loginData.phoneNumber}
                onChangeText={(value) => updateLoginData('phoneNumber', value)}
                keyboardType="phone-pad"
              />
              <GradientButton
                title="Send OTP"
                onPress={() => onNavigate('otp')}
                colors={[COLORS.SUCCESS, '#2c910eff']}
                disabled={!loginData.phoneNumber || loginData.phoneNumber.length < 10}
              />
            </>
          )}
        </View>
      </View>
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
    marginBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'flex-start',
  },
  formContainer: {
    marginTop: 10,
    paddingBottom: 20,
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

export default PasswordLoginScreen;
