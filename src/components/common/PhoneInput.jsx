// components/common/PhoneInput.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const PhoneInput = ({ value, onChangeText, placeholder = "Enter 10-digit mobile number" }) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Mobile Number</Text>
      <View style={styles.phoneInputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
        </View>
        <TextInput
          style={styles.phoneInput}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>
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
  phoneInputContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FAFAFA',
  },
  countryCode: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default PhoneInput;
