
// components/common/OTPInput.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const OTPInput = ({ value, onChangeText, phoneNumber }) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Enter OTP</Text>
      <TextInput
        style={styles.otpInput}
        placeholder="Enter 6-digit OTP"
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        maxLength={6}
        textAlign="center"
      />
      <Text style={styles.otpSentText}>
        OTP sent to +91 {phoneNumber}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 8,
    backgroundColor: '#FAFAFA',
  },
  otpSentText: {
    textAlign: 'center',
    color: '#138808',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
});

export default OTPInput;