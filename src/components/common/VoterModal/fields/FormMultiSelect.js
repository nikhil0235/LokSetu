import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { AppIcon } from '../../';

const FormMultiSelect = ({ 
  label, 
  value = [], 
  onValueChange, 
  options = [], 
  placeholder = "Select options",
  required = false, 
  error,
  icon,
  maxSelections
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOptions = options.filter(option => value.includes(option.value));
  const displayText = selectedOptions.length > 0 
    ? selectedOptions.map(o => o.label).join(', ')
    : placeholder;

  const handleToggle = (optionValue) => {
    let newValue;
    if (value.includes(optionValue)) {
      newValue = value.filter(v => v !== optionValue);
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return; // Don't add if max reached
      }
      newValue = [...value, optionValue];
    }
    onValueChange(newValue);
  };

  const handleDone = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {icon && <AppIcon name={icon} size={16} color="#6B7280" style={styles.labelIcon} />}
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {maxSelections && (
          <Text style={styles.maxText}>({value.length}/{maxSelections})</Text>
        )}
      </View>
      
      <TouchableOpacity
        style={[styles.picker, error && styles.pickerError]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[
          styles.pickerText,
          selectedOptions.length === 0 && styles.placeholderText
        ]} numberOfLines={2}>
          {displayText}
        </Text>
        <AppIcon name="expand-more" size={20} color="#6B7280" />
      </TouchableOpacity>

      {selectedOptions.length > 0 && (
        <View style={styles.selectedContainer}>
          {selectedOptions.map((option) => (
            <View key={option.value} style={styles.selectedChip}>
              <Text style={styles.chipText}>{option.label}</Text>
              <TouchableOpacity
                onPress={() => handleToggle(option.value)}
                style={styles.chipRemove}
              >
                <AppIcon name="close" size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <AppIcon name="error" size={12} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={handleDone}
                style={styles.doneButton}
              >
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsList}>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                const isDisabled = maxSelections && !isSelected && value.length >= maxSelections;
                
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      isSelected && styles.selectedOption,
                      isDisabled && styles.disabledOption
                    ]}
                    onPress={() => handleToggle(option.value)}
                    disabled={isDisabled}
                  >
                    <Text style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText,
                      isDisabled && styles.disabledOptionText
                    ]}>
                      {option.label}
                    </Text>
                    <View style={[
                      styles.checkbox,
                      isSelected && styles.checkedCheckbox
                    ]}>
                      {isSelected && (
                        <AppIcon name="check" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    flex: 1,
  },
  required: {
    color: '#EF4444',
    fontWeight: '700',
  },
  maxText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
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
    minHeight: 48,
  },
  pickerError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  pickerText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  selectedChip: {
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  chipText: {
    fontSize: 12,
    color: '#0369A1',
    marginRight: 4,
  },
  chipRemove: {
    padding: 2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  doneButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  doneText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionsList: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#F0F9FF',
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  selectedOptionText: {
    color: '#0369A1',
    fontWeight: '600',
  },
  disabledOptionText: {
    color: '#9CA3AF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
});

export default FormMultiSelect;