import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import FormInput from '../fields/FormInput';
import FormPicker from '../fields/FormPicker';
import FormToggle from '../fields/FormToggle';
import FormDatePicker from '../fields/FormDatePicker';

const PersonalStep = ({ data, onDataChange, errors }) => {
  const updateField = (field, value) => {
    onDataChange({ ...data, [field]: value });
  };

  const genderOptions = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <FormInput
        label="Serial Number (Booth List)"
        value={data.serial_number}
        onChangeText={(value) => updateField('serial_number', value)}
        placeholder="Auto-generated from booth list"
        keyboardType="numeric"
        icon="format-list-numbered"
        error={errors.serial_number}
        readOnly={!!data.serial_number}
      />

      <FormInput
        label="EPIC/Voter ID"
        value={data.epic_id}
        onChangeText={(value) => updateField('epic_id', value)}
        placeholder="Government issued EPIC ID"
        required={true}
        icon="badge"
        maxLength={20}
        error={errors.epic_id}
        readOnly={!!data.epic_id}
      />

      <FormInput
        label="Full Name"
        value={data.name}
        onChangeText={(value) => updateField('name', value)}
        placeholder="Name as per voter list"
        required={true}
        icon="person"
        error={errors.name}
        readOnly={!!data.name}
      />

      <FormInput
        label="Name (English/Phonetic)"
        value={data.name_phonetic}
        onChangeText={(value) => updateField('name_phonetic', value)}
        placeholder="Enter name in English"
        icon="translate"
        error={errors.name_phonetic}
      />

      <FormInput
        label="Father/Guardian/Husband Name"
        value={data.guardian_name}
        onChangeText={(value) => updateField('guardian_name', value)}
        placeholder="Name as per voter list"
        icon="family-restroom"
        error={errors.guardian_name}
        readOnly={!!data.guardian_name}
      />

      <FormPicker
        label="Gender"
        value={data.gender}
        onValueChange={(value) => updateField('gender', value)}
        options={genderOptions}
        placeholder="Gender from voter list"
        required={true}
        icon="person"
        error={errors.gender}
        readOnly={!!data.gender}
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <FormInput
            label="Age"
            value={data.age}
            onChangeText={(value) => updateField('age', value)}
            placeholder="Age from voter list"
            keyboardType="numeric"
            icon="cake"
            maxLength={3}
            error={errors.age}
            readOnly={!!data.age}
          />
        </View>
        <View style={styles.halfWidth}>
          <FormDatePicker
            label="Date of Birth"
            value={data.dob}
            onDateChange={(value) => {
              updateField('dob', value);
              // Auto-calculate age
              const today = new Date();
              const birthDate = new Date(value);
              const age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                updateField('age', (age - 1).toString());
              } else {
                updateField('age', age.toString());
              }
            }}
            placeholder="Select date of birth"
            icon="calendar-today"
            error={errors.dob}
            readOnly={!!data.dob}
          />
        </View>
      </View>

      <FormInput
        label="Mobile Number"
        value={data.mobile}
        onChangeText={(value) => updateField('mobile', value)}
        placeholder="Enter mobile number"
        keyboardType="phone-pad"
        icon="phone"
        maxLength={10}
        error={errors.mobile}
      />

      <FormInput
        label="Email Address"
        value={data.email}
        onChangeText={(value) => updateField('email', value)}
        placeholder="Enter email address"
        keyboardType="email-address"
        icon="email"
        error={errors.email}
      />

      <FormToggle
        label="First Time Voter"
        value={data.first_time_voter}
        onValueChange={(value) => updateField('first_time_voter', value)}
        icon="how-to-vote"
        error={errors.first_time_voter}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default PersonalStep;