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
// Text icons instead of lucide
const icons = {
  User: '👤',
  Mail: '📧',
  Phone: '📱',
  MapPin: '📍',
  Lock: '🔒',
  Eye: '👁️',
  EyeOff: '🙈',
  X: '✖️',
  Shield: '🛡️',
  Globe: '🌐',
};

const CreateAdminScreen = ({ onBack, onLogout }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    username: '',
    password: '',
    confirmPassword: '',
    constituency: '',
    adminLevel: 'admin', // admin or super_admin
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const constituencies = [
    'Constituency-1', 'Constituency-2', 'Constituency-3', 'Constituency-4',
    'Constituency-5', 'Constituency-6', 'Constituency-7', 'Constituency-8',
    'Constituency-9', 'Constituency-10', 'Constituency-11', 'Constituency-12'
  ];

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

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.constituency) {
      newErrors.constituency = 'Constituency assignment is required';
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
        `Admin "${formData.fullName}" has been created successfully and assigned to ${formData.constituency}.`,
        [
          {
            text: 'Create Another',
            onPress: () => {
              setFormData({
                fullName: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
                username: '',
                password: '',
                confirmPassword: '',
                constituency: '',
                adminLevel: 'admin',
              });
              setErrors({});
            }
          },
          {
            text: 'Go to Admin List',
            onPress: () => onBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create admin. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    icon, 
    error,
    secureTextEntry = false,
    showPasswordToggle = false,
    onTogglePassword,
    showPassword,
    keyboardType = 'default',
    multiline = false
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <Text style={[styles.iconText, { color: error ? '#EF4444' : '#6B7280' }]}>{icon}</Text>
        <TextInput
          style={[styles.textInput, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
        {showPasswordToggle && (
          <TouchableOpacity onPress={onTogglePassword}>
            <Text style={styles.iconText}>{showPassword ? icons.EyeOff : icons.Eye}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const DropdownField = ({ label, value, onSelect, options, error, icon }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dropdownContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.dropdownOption,
              value === option && styles.selectedOption
            ]}
            onPress={() => onSelect(option)}
          >
            <Text style={[
              styles.dropdownText,
              value === option && styles.selectedText
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.iconText}>{icons.X}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Admin</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <InputField
            label="Full Name *"
            value={formData.fullName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
            placeholder="Enter full name"
            icon={icons.User}
            error={errors.fullName}
          />

          <InputField
            label="Email Address *"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            placeholder="Enter email address"
            icon={icons.Mail}
            error={errors.email}
            keyboardType="email-address"
          />

          <InputField
            label="Phone Number *"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            placeholder="Enter phone number"
            icon={icons.Phone}
            error={errors.phone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Address Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Information</Text>
          
          <InputField
            label="Address *"
            value={formData.address}
            onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
            placeholder="Enter complete address"
            icon={icons.MapPin}
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
                icon={icons.MapPin}
                error={errors.city}
              />
            </View>
            <View style={styles.halfWidth}>
              <InputField
                label="State"
                value={formData.state}
                onChangeText={(text) => setFormData(prev => ({ ...prev, state: text }))}
                placeholder="Enter state"
                icon={icons.MapPin}
                error={errors.state}
              />
            </View>
          </View>

          <InputField
            label="PIN Code"
            value={formData.pincode}
            onChangeText={(text) => setFormData(prev => ({ ...prev, pincode: text }))}
            placeholder="Enter PIN code"
            icon={icons.MapPin}
            error={errors.pincode}
            keyboardType="numeric"
          />
        </View>

        {/* Account Setup Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Setup</Text>
          
          <InputField
            label="Username *"
            value={formData.username}
            onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
            placeholder="Enter username"
            icon={icons.User}
            error={errors.username}
          />

          <InputField
            label="Password *"
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            placeholder="Enter password (min 8 characters)"
            icon={icons.Lock}
            error={errors.password}
            secureTextEntry={!showPassword}
            showPasswordToggle={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <InputField
            label="Confirm Password *"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
            placeholder="Confirm password"
            icon={icons.Lock}
            error={errors.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            showPasswordToggle={true}
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </View>

        {/* Assignment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Constituency Assignment</Text>
          
          <DropdownField
            label="Assign Constituency *"
            value={formData.constituency}
            onSelect={(constituency) => setFormData(prev => ({ ...prev, constituency }))}
            options={constituencies}
            error={errors.constituency}
            icon={icons.Globe}
          />
        </View>

        {/* Permissions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Permissions</Text>
          <View style={styles.permissionsInfo}>
            <Text style={styles.permissionItem}>✓ Create and manage booth boys</Text>
            <Text style={styles.permissionItem}>✓ Assign booths to booth boys</Text>
            <Text style={styles.permissionItem}>✓ View and export voter data</Text>
            <Text style={styles.permissionItem}>✓ Access data scraping tools</Text>
            <Text style={styles.permissionItem}>✓ Generate constituency reports</Text>
            <Text style={styles.permissionItem}>✓ Monitor booth boy activities</Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submittingButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={[styles.iconText, { color: '#FFFFFF' }]}>{icons.Shield}</Text>
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Creating Admin...' : 'Create Admin'}
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
  logoutButton: {
    padding: 8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  iconText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
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
  dropdownContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dropdownText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  permissionsInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
  },
  permissionItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
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

export default CreateAdminScreen;