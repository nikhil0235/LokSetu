// screens/AdminLoginScreen.js
import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import LoginCard from '../../../components/common/LoginCard';
import BackButton from '../../../components/common/BackButton';
import ScreenHeader from '../../../components/common/ScreenHeader';
import InputField from '../../../components/common/InputField';
import GradientButton from '../../../components/common/GradientButton';

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

const AdminLoginScreen = ({ onNavigate, loginData, updateLoginData }) => {
  const [loading, setLoading] = useState(false);

  const dummyAdminLogin = async (username, password) => {
    console.log(`Admin login attempt: ${username}`);
    await new Promise((resolve) => setTimeout(resolve, 600)); // simulate delay

    if (username === 'admin' && password === 'admin123') {
      return {
        token: 'admin-token',
        user: {
          id: 0,
          role: 'admin',
          username,
        },
      };
    } else {
      throw new Error('Invalid admin credentials');
    }
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    try {
      const result = await dummyAdminLogin(loginData.username, loginData.password);
      console.warn('Admin login successful:', result);
      Alert.alert('Success', 'Welcome, Admin!');
      onNavigate('voterList');
    } catch (error) {
      console.error('Admin login failed:', error.message);
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
          icon="🛡️"
          title="Admin Login"
          subtitle="Restricted access for administrators only"
        />

        <View style={styles.formContainer}>
          <InputField
            label="Admin Username"
            placeholder="Enter admin username"
            value={loginData.username}
            onChangeText={(value) => updateLoginData('username', value)}
          />

          <InputField
            label="Password"
            placeholder="Enter admin password"
            value={loginData.password}
            onChangeText={(value) => updateLoginData('password', value)}
            secureTextEntry
          />

          <GradientButton
            title={loading ? 'Logging in...' : 'Login as Admin'}
            onPress={handleAdminLogin}
            colors={[COLORS.SECONDARY, COLORS.SECONDARYDark]}
            disabled={!isFormValid || loading}
            loading={loading}
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
});

export default AdminLoginScreen;
