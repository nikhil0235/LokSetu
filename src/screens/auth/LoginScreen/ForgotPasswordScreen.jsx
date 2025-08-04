// screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
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

const ForgotPasswordScreen = ({ onNavigate, loginData, updateLoginData }) => {
  const [loading, setLoading] = useState(false);

  const dummySendResetLink = async (usernameOrEmail) => {
    console.log(`Sending reset link to: ${usernameOrEmail}`);
    await new Promise((resolve) => setTimeout(resolve, 600)); // simulate delay

    if (usernameOrEmail === 'testuser' || usernameOrEmail === 'test@example.com') {
      return 'Reset link sent';
    } else {
      throw new Error('User not found');
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const result = await dummySendResetLink(loginData.username);
      console.warn(result);
      Alert.alert('Success', 'A password reset link has been sent to your email.');
      // You could navigate back or to a confirmation screen
    } catch (error) {
      console.error('Reset failed:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = loginData.username && loginData.username.length >= 3;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <LoginCard>
        <BackButton onPress={() => onNavigate('password')} />
        <ScreenHeader
          icon="📧"
          title="Forgot Password"
          subtitle="Enter your email or username to receive a reset link"
        />

        <View style={styles.formContainer}>
          <InputField
            label="Email or Username"
            placeholder="Enter your email or username"
            value={loginData.username}
            onChangeText={(value) => updateLoginData('username', value)}
          />

          <GradientButton
            title={loading ? 'Sending...' : 'Send Reset Link'}
            onPress={handleForgotPassword}
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

export default ForgotPasswordScreen;
