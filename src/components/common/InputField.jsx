import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputField = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  onBlur,
  secureTextEntry = false,
  keyboardType = 'default',
  maxLength,
  textAlign = 'left',
  style = {}
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, style]}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        textAlign={textAlign}
        autoCapitalize="none"
      />
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
  textInput: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
});

export default InputField;