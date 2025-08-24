import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { AppIcon, BackButton, InputField, PasswordInputField } from './index';
import { Picker } from '@react-native-picker/picker';

const ReusableForm = ({
  title,
  sections = [],
  onSubmit,
  onBack,
  onLogout,
  submitButtonText = "Submit",
  submitIcon = "check",
  isLoading = false,
  initialData = {},
  validationRules = {},
  showPermissions = false,
  permissions = [],
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    for (const rule of rules) {
      switch (rule.type) {
        case 'required':
          if (!value || !value.toString().trim()) return rule.message;
          break;
        case 'minLength':
          if (value.toString().length < rule.value) return rule.message;
          break;
        case 'maxLength':
          if (value.toString().length > rule.value) return rule.message;
          break;
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return rule.message;
          break;
        case 'phone':
          if (!/^[6-9]\d{9}$/.test(value.toString().replace(/\D/g, ''))) return rule.message;
          break;
        case 'username':
          if (!/^[a-zA-Z0-9_]+$/.test(value)) return rule.message;
          break;
        case 'password':
          if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return rule.message;
          break;
        case 'match':
          if (value !== formData[rule.field]) return rule.message;
          break;
        case 'custom':
          if (!rule.validator(value, formData)) return rule.message;
          break;
      }
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const error = validateField(field, value);
      if (!error) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors before submitting.');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred while submitting the form.');
    }
  };

  const isFormValid = () => {
    const requiredFields = Object.keys(validationRules).filter(key => 
      validationRules[key].some(rule => rule.type === 'required')
    );
    
    const hasAllFields = requiredFields.every(field => 
      formData[field] && formData[field].toString().trim()
    );
    
    const hasNoErrors = Object.values(errors).every(error => !error);
    
    return hasAllFields && hasNoErrors;
  };

  const getFieldStyle = (fieldName) => {
    if (errors[fieldName]) {
      return styles.inputError;
    } else if (touched[fieldName] && formData[fieldName] && !errors[fieldName]) {
      return styles.inputSuccess;
    }
    return {};
  };

  const renderField = (field, sectionIndex, fieldIndex) => {
    const key = `${sectionIndex}-${fieldIndex}`;
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <View style={[styles.inputWrapper, getFieldStyle(field.name)]}>
              <AppIcon 
                name={field.type === 'email' ? 'email' : field.type === 'phone' ? 'phone' : 'person'} 
                size={20} 
                color={errors[field.name] ? '#EF4444' : '#6B7280'} 
              />
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={(text) => {
                  let processedText = text;
                  if (field.type === 'email') processedText = text.toLowerCase();
                  if (field.type === 'phone') processedText = text.replace(/\D/g, '');
                  handleFieldChange(field.name, processedText);
                }}
                onBlur={() => handleFieldBlur(field.name)}
                placeholder={field.placeholder}
                placeholderTextColor="#9CA3AF"
                keyboardType={field.keyboardType}
                maxLength={field.maxLength}
              />
            </View>
            {errors[field.name] && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      case 'password':
        return (
          <View key={key}>
            <PasswordInputField
              label={field.label}
              value={value}
              onChangeText={(text) => handleFieldChange(field.name, text)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              style={getFieldStyle(field.name)}
              error={errors[field.name]}
            />
          </View>
        );

      case 'select':
        return (
          <View key={key}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <View style={[styles.pickerContainer, getFieldStyle(field.name)]}>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => handleFieldChange(field.name, itemValue)}
                style={styles.picker}
              >
                <Picker.Item label={field.placeholder || "Select an option"} value="" />
                {field.options.map((option, idx) => (
                  <Picker.Item 
                    key={idx} 
                    label={option.label} 
                    value={option.value} 
                  />
                ))}
              </Picker>
            </View>
            {errors[field.name] && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      case 'radio':
        return (
          <View key={key}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <View style={styles.radioContainer}>
              {field.options.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.radioOption,
                    value === option.value && styles.selectedOption
                  ]}
                  onPress={() => handleFieldChange(field.name, option.value)}
                >
                  <Text style={[
                    styles.radioText,
                    value === option.value && styles.selectedText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors[field.name] && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      case 'textarea':
        return (
          <View key={key}>
            <InputField
              label={field.label}
              value={value}
              onChangeText={(text) => handleFieldChange(field.name, text)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              multiline={true}
              numberOfLines={field.rows || 4}
              style={[getFieldStyle(field.name), styles.textArea]}
            />
            {errors[field.name] && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <AppIcon name="power-settings-new" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.fields.map((field, fieldIndex) => 
              renderField(field, sectionIndex, fieldIndex)
            )}
          </View>
        ))}

        {showPermissions && permissions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Default Permissions</Text>
            <View style={styles.permissionsInfo}>
              {permissions.map((permission, index) => (
                <Text key={index} style={styles.permissionItem}>✓ {permission}</Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, (isLoading || !isFormValid()) && styles.submittingButton]}
          onPress={handleSubmit}
          disabled={isLoading || !isFormValid()}
        >
          <AppIcon name={submitIcon} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.submitButtonText}>
            {isLoading ? `${submitButtonText}...` : submitButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
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
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
    marginRight: 8,
  },
  picker: {
    flex: 1,
    marginLeft: 8,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputSuccess: {
    borderColor: '#10B981',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  radioOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  radioText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
});

export default ReusableForm;