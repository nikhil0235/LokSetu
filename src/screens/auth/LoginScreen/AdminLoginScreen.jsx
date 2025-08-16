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

const AdminLoginScreen = ({ onNavigate, loginData, updateLoginData, onLoginSuccess, selectedRole }) => {
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');

  const dummyAdminLogin = async (username, password) => {
    console.log(`Admin login attempt: ${username}`);
    await new Promise((resolve) => setTimeout(resolve, 600)); // simulate delay

    // Support multiple admin credentials
    const validAdmins = {
      'admin': 'admin123',
      'admin1': 'admin123',
      'super_admin': 'super123'
    };

    if (validAdmins[username] && validAdmins[username] === password) {
      return {
        token: 'admin-token',
        user: {
          id: username === 'super_admin' ? 0 : 1,
          role: username === 'super_admin' ? 'super_admin' : 'admin',
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
      
      // Create user data for admin login
      const userData = {
        username: loginData.username,
        role: selectedRole,
        name: selectedRole === 'super_admin' ? 'Super Admin' : 'Admin',
        id: result.user.id
      };
      
      onLoginSuccess(userData);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => onNavigate('main')} />
        <Text style={styles.title}>Admin Access</Text>
        <Text style={styles.subtitle}>Secure administrative login</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
      </ScrollView>
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
  },
  formContainer: {
    marginTop: 10,
    marginBottom: 40,
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

export default AdminLoginScreen;
