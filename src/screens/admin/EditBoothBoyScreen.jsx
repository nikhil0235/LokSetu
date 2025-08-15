import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  X,
} from 'lucide-react-native';

const EditBoothBoyScreen = ({ navigation, route }) => {
  const { boothBoy } = route.params;
  
  const [formData, setFormData] = useState({
    fullName: boothBoy.name || '',
    email: boothBoy.email || '',
    phone: boothBoy.phone || '',
    address: boothBoy.address || '',
    city: boothBoy.city || '',
    state: boothBoy.state || '',
    pincode: boothBoy.pincode || '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success!',
        `${formData.fullName}'s information has been updated successfully.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update booth boy information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    icon: Icon, 
    error,
    keyboardType = 'default',
    multiline = false
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <Icon size={20} color={error ? '#EF4444' : '#6B7280'} />
        <TextInput
          style={[styles.textInput, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Booth Boy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Current Info Display */}
        <View style={styles.currentInfoSection}>
          <Text style={styles.currentInfoTitle}>Current Information</Text>
          <View style={styles.currentInfoCard}>
            <Text style={styles.currentInfoName}>{boothBoy.name}</Text>
            <Text style={styles.currentInfoDetail}>{boothBoy.email}</Text>
            <Text style={styles.currentInfoDetail}>{boothBoy.phone}</Text>
            <Text style={styles.currentInfoDetail}>{boothBoy.area}</Text>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Personal Information</Text>
          
          <InputField
            label="Full Name *"
            value={formData.fullName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
            placeholder="Enter full name"
            icon={User}
            error={errors.fullName}
          />

          <InputField
            label="Email Address *"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            placeholder="Enter email address"
            icon={Mail}
            error={errors.email}
            keyboardType="email-address"
          />

          <InputField
            label="Phone Number *"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            placeholder="Enter phone number"
            icon={Phone}
            error={errors.phone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Address Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Address Information</Text>
          
          <InputField
            label="Address *"
            value={formData.address}
            onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
            placeholder="Enter complete address"
            icon={MapPin}
            error={errors.address}
            multiline={true}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <InputField
                label="City"
                value={formData.city}
                onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
                placeholder="Enter city"
                icon={MapPin}
                error={errors.city}
              />
            </View>
            <View style={styles.halfWidth}>
              <InputField
                label="State"
                value={formData.state}
                onChangeText={(text) => setFormData(prev => ({ ...prev, state: text }))}
                placeholder="Enter state"
                icon={MapPin}
                error={errors.state}
              />
            </View>
          </View>

          <InputField
            label="PIN Code"
            value={formData.pincode}
            onChangeText={(text) => setFormData(prev => ({ ...prev, pincode: text }))}
            placeholder="Enter PIN code"
            icon={MapPin}
            error={errors.pincode}
            keyboardType="numeric"
          />
        </View>

        {/* Performance Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>
          <View style={styles.performanceCard}>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Assigned Booths:</Text>
              <Text style={styles.performanceValue}>{boothBoy.assignedBooths}</Text>
            </View>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Completed Voters:</Text>
              <Text style={styles.performanceValue}>{boothBoy.completedVoters?.toLocaleString()}</Text>
            </View>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Progress:</Text>
              <Text style={[styles.performanceValue, { color: '#10B981' }]}>
                {boothBoy.progress?.toFixed(1)}%
              </Text>
            </View>
            <View style={styles.performanceRow}>
              <Text style={styles.performanceLabel}>Status:</Text>
              <Text style={[
                styles.performanceValue, 
                { color: boothBoy.status === 'active' ? '#10B981' : '#EF4444' }
              ]}>
                {boothBoy.status?.charAt(0).toUpperCase() + boothBoy.status?.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteSection}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>
            • Only personal and address information can be updated here
          </Text>
          <Text style={styles.noteText}>
            • To change booth assignments, use the Booth Assignment screen
          </Text>
          <Text style={styles.noteText}>
            • Account credentials cannot be changed from this screen
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submittingButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Updating...' : 'Update Information'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  currentInfoSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  currentInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  currentInfoCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  currentInfoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  currentInfoDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
    marginRight: 8,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  performanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  noteSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 4,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  submittingButton: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default EditBoothBoyScreen;