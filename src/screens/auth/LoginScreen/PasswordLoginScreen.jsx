// screens/PasswordLoginScreen.js
import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
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

const PasswordLoginScreen = ({ onNavigate, loginData, updateLoginData }) => {
  const [loading, setLoading] = useState(false);

  const dummyLoginWithPassword = async (username, password) => {
    console.log(`Simulating login for: ${username}`);
    await new Promise((resolve) => setTimeout(resolve, 600)); // simulate delay

    if (username === 'testuser' && password === 'password123') {
      return {
        token: 'dummy-token',
        user: {
          id: 1,
          name: 'Test User',
          username,
        },
      };
    } else {
      throw new Error('Invalid username or password');
    }
  };

  const handlePasswordLogin = async () => {
    setLoading(true);
    try {
      const result = await dummyLoginWithPassword(loginData.username, loginData.password);
      console.warn('Login successful:', result);
      Alert.alert('Success', 'Login successful');
      // You can navigate here: onNavigate('home') or something similar
    } catch (error) {
      console.error('Login failed:', error.message);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    loginData.username && loginData.username.length >= 3 &&
    loginData.password && loginData.password.length >= 6;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <LoginCard>
        <BackButton onPress={() => onNavigate('main')} />
        <ScreenHeader
          icon="🔐"
          title="Password Login"
          subtitle="Enter your credentials to access your account"
        />

        <View style={styles.formContainer}>
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
            title={loading ? 'Logging in...' : 'Login Securely'}
            onPress={handlePasswordLogin}
            colors={[COLORS.SECONDARY, COLORS.SECONDARYDark]}
            disabled={!isFormValid || loading}
            loading={loading}
          />

          <SwitchOption
            text="Switch to OTP Login"
            onPress={() => onNavigate('otp')}
          />
        </View>
      </LoginCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    marginBottom: 20,
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
});

export default PasswordLoginScreen;
