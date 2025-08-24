import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';

const FILTER_OPTIONS = {
  booth: ['B001', 'B002', 'B003', 'B004', 'B005'],
  age: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
  caste: ['General', 'OBC', 'SC', 'ST'],
  verification: ['Verified', 'Unverified'],
  gender: ['M', 'F', 'O'],
  address: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5']
};

const FILTER_TITLES = {
  booth: 'Select Booth',
  age: 'Select Age Group',
  caste: 'Select Caste Category',
  verification: 'Select Verification Status',
  gender: 'Select Gender',
  address: 'Select Address/Area'
};

const FILTER_PLURALS = {
  booth: 'Booths',
  age: 'Ages',
  caste: 'Caste',
  verification: 'Status',
  gender: 'Gender',
  address: 'Areas'
};

const FilterModal = ({ visible, filterType, onClose, onApply }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [customValue, setCustomValue] = useState('');

  const options = useMemo(() => FILTER_OPTIONS[filterType] || [], [filterType]);
  const title = useMemo(() => FILTER_TITLES[filterType] || 'Select Filter', [filterType]);
  const pluralLabel = useMemo(() => FILTER_PLURALS[filterType] || filterType, [filterType]);

  useEffect(() => {
    setSelectedValue('');
    setCustomValue('');
  }, [filterType, visible]);

  const handleApply = () => {
    const value = selectedValue || customValue;
    if (value) {
      onApply({ type: filterType, value });
    } else {
      onApply({ type: filterType });
    }
  };



  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✖️</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionItem,
                selectedValue === '' && styles.selectedOption
              ]}
              onPress={() => setSelectedValue('')}
            >
              <Text style={[
                styles.optionText,
                selectedValue === '' && styles.selectedOptionText
              ]}>
                All {pluralLabel}
              </Text>
            </TouchableOpacity>

            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  selectedValue === option && styles.selectedOption
                ]}
                onPress={() => setSelectedValue(option)}
              >
                <Text style={[
                  styles.optionText,
                  selectedValue === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}

            {filterType === 'address' && (
              <View style={styles.customInputContainer}>
                <Text style={styles.customInputLabel}>Or enter custom address:</Text>
                <TextInput
                  style={styles.customInput}
                  placeholder="Enter address/area..."
                  value={customValue}
                  onChangeText={setCustomValue}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  optionsContainer: {
    maxHeight: 300,
    paddingHorizontal: 20,
  },
  optionItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  customInputContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  customInputLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default FilterModal;