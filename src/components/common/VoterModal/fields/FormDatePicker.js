import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppIcon } from '../../';

const FormDatePicker = ({ 
  label, 
  value, 
  onDateChange, 
  placeholder = "Select date",
  required = false, 
  error,
  icon = "calendar-today",
  readOnly = false,
  mode = "date"
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const handleDateSelect = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const currentDate = value ? new Date(value) : new Date();
  const displayText = value ? formatDate(value) : placeholder;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {icon && <AppIcon name={icon} size={16} color="#6B7280" style={styles.labelIcon} />}
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.picker, 
          error && styles.pickerError,
          readOnly && styles.pickerReadOnly
        ]}
        onPress={() => !readOnly && setShowPicker(true)}
        disabled={readOnly}
      >
        <Text style={[
          styles.pickerText,
          !value && styles.placeholderText
        ]}>
          {displayText}
        </Text>
        <AppIcon 
          name={readOnly ? "lock" : "calendar-today"} 
          size={20} 
          color={readOnly ? "#9CA3AF" : "#6B7280"} 
        />
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <AppIcon name="error" size={12} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {showPicker && (
        <DateTimePicker
          value={currentDate}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateSelect}
          maximumDate={new Date()}
          minimumDate={new Date(1950, 0, 1)}
        />
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
  picker: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  pickerError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  pickerReadOnly: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    opacity: 0.7,
  },
  pickerText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholderText: {
    color: '#9CA3AF',
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

export default FormDatePicker;