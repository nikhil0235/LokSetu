import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import FormPicker from '../fields/FormPicker';
import FormInput from '../fields/FormInput';
import FormToggle from '../fields/FormToggle';

const ResidenceStep = ({ data, onDataChange, errors }) => {
  const updateField = (field, value) => {
    onDataChange({ ...data, [field]: value });
  };

  const residingOptions = [
    { label: 'Same Vidhan Sabha', value: 'same_vs' },
    { label: 'Other VS in Bihar', value: 'other_vs_bihar' },
    { label: 'Other State in India', value: 'other_state' },
    { label: 'Abroad', value: 'abroad' }
  ];

  const houseTypeOptions = [
    { label: 'Own House', value: 'own' },
    { label: 'Rented', value: 'rented' },
    { label: 'Family Property', value: 'family' },
    { label: 'Government Quarters', value: 'govt_quarters' },
    { label: 'Others', value: 'others' }
  ];

  const addressProofOptions = [
    { label: 'Aadhaar Card', value: 'aadhaar' },
    { label: 'Voter ID', value: 'voter_id' },
    { label: 'Passport', value: 'passport' },
    { label: 'Driving License', value: 'driving_license' },
    { label: 'Ration Card', value: 'ration_card' },
    { label: 'Utility Bills', value: 'utility_bills' },
    { label: 'Others', value: 'others' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <FormInput
        label="House Number"
        value={data.house_number}
        onChangeText={(value) => updateField('house_number', value)}
        placeholder="House number from voter list"
        required={true}
        icon="home"
        error={errors.house_number}
        readOnly={!!data.house_number}
      />

      <FormInput
        label="Street/Area"
        value={data.street}
        onChangeText={(value) => updateField('street', value)}
        placeholder="Enter street/area name"
        icon="location-on"
        error={errors.street}
      />

      <FormInput
        label="Village/Ward"
        value={data.village_ward}
        onChangeText={(value) => updateField('village_ward', value)}
        placeholder="Enter village/ward"
        required={true}
        icon="location-city"
        error={errors.village_ward}
      />

      <FormInput
        label="Post Office"
        value={data.post_office}
        onChangeText={(value) => updateField('post_office', value)}
        placeholder="Enter post office"
        icon="local-post-office"
        error={errors.post_office}
      />

      <FormInput
        label="PIN Code"
        value={data.pin_code}
        onChangeText={(value) => updateField('pin_code', value)}
        placeholder="Enter PIN code"
        keyboardType="numeric"
        maxLength={6}
        icon="pin-drop"
        error={errors.pin_code}
      />

      <FormPicker
        label="Currently Residing In"
        value={data.residing_in}
        onValueChange={(value) => updateField('residing_in', value)}
        options={residingOptions}
        placeholder="Select current residence location"
        required={true}
        icon="location-on"
        error={errors.residing_in}
      />

      {(data.residing_in === 'other_state' || data.residing_in === 'abroad') && (
        <FormInput
          label="Current City/Country"
          value={data.current_location}
          onChangeText={(value) => updateField('current_location', value)}
          placeholder="Enter current city/country"
          required={true}
          icon="public"
          error={errors.current_location}
        />
      )}

      <FormToggle
        label="Permanent Residence in Bihar"
        value={data.permanent_resident_bihar}
        onValueChange={(value) => updateField('permanent_resident_bihar', value)}
        icon="home-filled"
        error={errors.permanent_resident_bihar}
      />

      <FormToggle
        label="Have you migrated from this area?"
        value={data.migrated}
        onValueChange={(value) => updateField('migrated', value)}
        icon="moving"
        error={errors.migrated}
      />

      {data.migrated && (
        <>
          <FormInput
            label="Migration Reason"
            value={data.migration_reason}
            onChangeText={(value) => updateField('migration_reason', value)}
            placeholder="Enter reason for migration"
            multiline={true}
            icon="help"
            error={errors.migration_reason}
          />

          <FormInput
            label="Years Since Migration"
            value={data.years_since_migration}
            onChangeText={(value) => updateField('years_since_migration', value)}
            placeholder="Enter years"
            keyboardType="numeric"
            icon="schedule"
            error={errors.years_since_migration}
          />
        </>
      )}

      <FormPicker
        label="House Type"
        value={data.house_type}
        onValueChange={(value) => updateField('house_type', value)}
        options={houseTypeOptions}
        placeholder="Select house type"
        icon="house"
        error={errors.house_type}
      />

      <FormPicker
        label="Address Proof Document"
        value={data.address_proof}
        onValueChange={(value) => updateField('address_proof', value)}
        options={addressProofOptions}
        placeholder="Select address proof"
        icon="description"
        error={errors.address_proof}
      />

      <FormInput
        label="Landmark"
        value={data.landmark}
        onChangeText={(value) => updateField('landmark', value)}
        placeholder="Enter nearby landmark"
        icon="place"
        error={errors.landmark}
      />

      <FormInput
        label="Additional Address Notes"
        value={data.address_notes}
        onChangeText={(value) => updateField('address_notes', value)}
        placeholder="Any additional address information"
        multiline={true}
        icon="note"
        error={errors.address_notes}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default ResidenceStep;