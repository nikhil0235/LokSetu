// screens/OTPLoginScreen.js
import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import LoginCard from '../../../components/common/LoginCard';
import BackButton from '../../../components/common/BackButton';
import ScreenHeader from '../../../components/common/ScreenHeader';
import PhoneInput from '../../../components/common/PhoneInput';
import OTPInput from '../../../components/common/OTPInput';
import GradientButton from '../../../components/common/GradientButton';
import SwitchOption from '../../../components/common/SwitchOption';

// const COLORS = {
//   PRIMARY: '#FF6B35',
//   SECONDARY: '#5856D6',
//   SECONDARYDark: '#4B42AA',
//   SUCCESS: '#34C759',
//   WARNING: '#FF9500',
//   ERROR: '#FF3B30',
//   BACKGROUND: '#F5F5F5',
//   WHITE: '#FFFFFF',
//   TEXT_PRIMARY: '#1C1C1E',
//   TEXT_SECONDARY: '#8E8E93',
// };
const OTPLoginScreen = ({ onNavigate, loginData, updateLoginData }) => {
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  // Dummy: Send OTP
  const dummySendOTP = async (phoneNumber) => {
    console.log(`Sending dummy OTP to +91${encodeURIComponent(phoneNumber)}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  };

  // Dummy: Verify OTP
  const dummyVerifyOTP = async (phoneNumber, otp) => {
    console.log(`Verifying dummy OTP for +91${encodeURIComponent(phoneNumber)}`);
    await new Promise((resolve) => setTimeout(resolve, 500));

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
      throw new Error('Invalid OTP');
    }
  };

  // Dummy: Resend OTP
  const dummyResendOTP = async (phoneNumber) => {
    console.log(`Resending dummy OTP to +91${encodeURIComponent(phoneNumber)}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await dummySendOTP(loginData.phoneNumber);
      setShowOtpField(true);
      Alert.alert('OTP Sent', 'A dummy OTP (123456) has been sent to your phone.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const result = await dummyVerifyOTP(loginData.phoneNumber, loginData.otp);
      console.log('OTP verified successfully');
      Alert.alert('Success', 'OTP verified successfully.');
      // Navigate or update state here
    } catch (error) {
      Alert.alert('Verification Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await dummyResendOTP(loginData.phoneNumber);
      Alert.alert('OTP Resent', 'A dummy OTP (123456) has been resent.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setShowOtpField(false);
    updateLoginData('phoneNumber', '');
    updateLoginData('otp', '');
  };

  const isPhoneValid = loginData.phoneNumber && loginData.phoneNumber.length === 10;
  const isOTPValid = loginData.otp && loginData.otp.length === 6;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <LoginCard>
        <BackButton onPress={() => onNavigate('password')} />

        <ScreenHeader
          icon="📱"
          title="OTP Login"
          subtitle={showOtpField ? 'Enter the OTP sent to your mobile' : 'Enter your mobile number for OTP'}
        />

        <View style={styles.formContainer}>
          {!showOtpField ? (
            <>
              <PhoneInput
                value={loginData.phoneNumber}
                onChangeText={(value) => updateLoginData('phoneNumber', value)}
                placeholder="Enter mobile number"
              />

              <GradientButton
                title={loading ? 'Sending OTP...' : 'Send OTP'}
                onPress={handleSendOtp}
                colors={['#19a537ff', '#34C759'| '#70be51ff']}
                disabled={!isPhoneValid}
                loading={loading}
              />
            </>
          ) : (
            <>
              <OTPInput
                value={loginData.otp}
                onChangeText={(value) => updateLoginData('otp', value)}
                phoneNumber={loginData.phoneNumber}
              />

              <GradientButton
                title={loading ? 'Verifying...' : 'Verify & Login'}
                onPress={handleVerifyOtp}
               colors={['#34C759', '#34C759'| '#2c910eff']}
                disabled={!isOTPValid}
                loading={loading}
              />

              <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp} disabled={loading}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.changeNumberButton} onPress={handleChangeNumber}>
                <Text style={styles.changeNumberText}>Change Number</Text>
              </TouchableOpacity>
            </>
          )}

          <SwitchOption
            text="Switch to Password Login"
            onPress={() => onNavigate('password')}
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
  resendButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  resendText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
  changeNumberButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 15,
  },
  changeNumberText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default OTPLoginScreen;
