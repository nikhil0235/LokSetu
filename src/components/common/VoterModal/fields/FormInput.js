import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { AppIcon } from '../../';

const FormInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  required = false, 
  error, 
  readOnly = false,
  keyboardType = 'default',
  multiline = false,
  icon,
  maxLength
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {icon && <AppIcon name={icon} size={16} color="#6B7280" style={styles.labelIcon} />}
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error && styles.inputError,
          readOnly && styles.inputReadOnly
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        editable={!readOnly}
        keyboardType={keyboardType}
        multiline={multiline}
        maxLength={maxLength}
      />
      {error && (
        <View style={styles.errorContainer}>
          <AppIcon name="error" size={12} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#EF4444',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputReadOnly: {
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 4,
  },
});

export default FormInput;