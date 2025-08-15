import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

const VoterEditModal = ({ visible, voter, onClose, onSave }) => {
  const [editedVoter, setEditedVoter] = useState({});

  useEffect(() => {
    if (voter) {
      setEditedVoter({ ...voter });
    }
  }, [voter]);

  const handleSave = () => {
    if (!editedVoter.mobile || editedVoter.mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }
    onSave(editedVoter);
  };

  const updateField = (field, value) => {
    setEditedVoter(prev => ({ ...prev, [field]: value }));
  };

  const partyOptions = ['BJP', 'Congress', 'RJD', 'JDU', 'AAP', 'Others', 'Undecided'];
  const certaintyOptions = ['High', 'Medium', 'Low'];
  const verificationOptions = ['Verified', 'Unverified'];

  if (!voter) return null;

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
            <Text style={styles.modalTitle}>Edit Voter Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✖️</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Basic Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.readOnlyField}>
                <Text style={styles.fieldLabel}>Name</Text>
                <Text style={styles.readOnlyText}>{voter.name}</Text>
                <Text style={styles.readOnlySubtext}>{voter.name_phonetic}</Text>
              </View>

              <View style={styles.readOnlyField}>
                <Text style={styles.fieldLabel}>EPIC ID</Text>
                <Text style={styles.readOnlyText}>{voter.epic_id}</Text>
              </View>

              <View style={styles.inputField}>
                <Text style={styles.fieldLabel}>Mobile Number *</Text>
                <TextInput
                  style={styles.textInput}
                  value={editedVoter.mobile || ''}
                  onChangeText={(value) => updateField('mobile', value)}
                  placeholder="Enter 10-digit mobile number"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Political Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Political Information</Text>
              
              <View style={styles.inputField}>
                <Text style={styles.fieldLabel}>Last Voted Party</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                  {partyOptions.map((party) => (
                    <TouchableOpacity
                      key={party}
                      style={[
                        styles.optionChip,
                        editedVoter.last_voted_party === party && styles.selectedChip
                      ]}
                      onPress={() => updateField('last_voted_party', party)}
                    >
                      <Text style={[
                        styles.optionText,
                        editedVoter.last_voted_party === party && styles.selectedOptionText
                      ]}>
                        {party}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputField}>
                <Text style={styles.fieldLabel}>Expected Vote To</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                  {partyOptions.map((party) => (
                    <TouchableOpacity
                      key={party}
                      style={[
                        styles.optionChip,
                        editedVoter.voting_preference === party && styles.selectedChip
                      ]}
                      onPress={() => updateField('voting_preference', party)}
                    >
                      <Text style={[
                        styles.optionText,
                        editedVoter.voting_preference === party && styles.selectedOptionText
                      ]}>
                        {party}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputField}>
                <Text style={styles.fieldLabel}>Vote Certainty</Text>
                <View style={styles.optionsRow}>
                  {certaintyOptions.map((certainty) => (
                    <TouchableOpacity
                      key={certainty}
                      style={[
                        styles.optionChip,
                        editedVoter.certainty_of_vote === certainty && styles.selectedChip
                      ]}
                      onPress={() => updateField('certainty_of_vote', certainty)}
                    >
                      <Text style={[
                        styles.optionText,
                        editedVoter.certainty_of_vote === certainty && styles.selectedOptionText
                      ]}>
                        {certainty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Verification Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Verification</Text>
              
              <View style={styles.inputField}>
                <Text style={styles.fieldLabel}>Verification Status</Text>
                <View style={styles.optionsRow}>
                  {verificationOptions.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.optionChip,
                        editedVoter.verification_status === status && styles.selectedChip
                      ]}
                      onPress={() => updateField('verification_status', status)}
                    >
                      <Text style={[
                        styles.optionText,
                        editedVoter.verification_status === status && styles.selectedOptionText
                      ]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Additional Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              
              <View style={styles.inputField}>
                <Text style={styles.fieldLabel}>Notes/Feedback</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={editedVoter.feedback || ''}
                  onChangeText={(value) => updateField('feedback', value)}
                  placeholder="Add any notes or feedback..."
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxHeight: '85%',
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
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  inputField: {
    marginBottom: 15,
  },
  readOnlyField: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  readOnlyText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  readOnlySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  optionsScroll: {
    flexDirection: 'row',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#3B82F6',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '500',
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
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default VoterEditModal;