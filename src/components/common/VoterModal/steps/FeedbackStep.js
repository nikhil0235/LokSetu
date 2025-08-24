import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import FormMultiSelect from '../fields/FormMultiSelect';
import FormInput from '../fields/FormInput';
import FormToggle from '../fields/FormToggle';

const FeedbackStep = ({ data, onDataChange, errors }) => {
  const updateField = (field, value) => {
    onDataChange({ ...data, [field]: value });
  };

  const issuesOptions = [
    { label: 'Education & Schools', value: 'education' },
    { label: 'Employment & Jobs', value: 'employment' },
    { label: 'Healthcare & Hospitals', value: 'healthcare' },
    { label: 'Roads & Infrastructure', value: 'roads' },
    { label: 'Electricity & Power', value: 'electricity' },
    { label: 'Water Supply', value: 'water_supply' },
    { label: 'Traffic Management', value: 'traffic' },
    { label: 'Corruption', value: 'corruption' },
    { label: 'Agriculture & Irrigation', value: 'agriculture' },
    { label: 'Flood Management', value: 'flood_management' },
    { label: 'Public Transport', value: 'public_transport' },
    { label: 'Internet Connectivity', value: 'internet' },
    { label: 'Banking Services', value: 'banking' },
    { label: 'Law & Order', value: 'law_order' },
    { label: 'Women Safety', value: 'women_safety' },
    { label: 'Youth Development', value: 'youth_development' },
    { label: 'Senior Citizen Welfare', value: 'senior_citizen' },
    { label: 'Community Halls', value: 'community_halls' },
    { label: 'Waste Management', value: 'waste_management' },
    { label: 'Street Lighting', value: 'street_lighting' },
    { label: 'Others', value: 'others' }
  ];

  const priorityOptions = [
    { label: 'High Priority', value: 'high' },
    { label: 'Medium Priority', value: 'medium' },
    { label: 'Low Priority', value: 'low' }
  ];

  const satisfactionOptions = [
    { label: 'Very Satisfied', value: 'very_satisfied' },
    { label: 'Satisfied', value: 'satisfied' },
    { label: 'Neutral', value: 'neutral' },
    { label: 'Dissatisfied', value: 'dissatisfied' },
    { label: 'Very Dissatisfied', value: 'very_dissatisfied' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <FormMultiSelect
        label="Issues Faced in Area"
        value={data.issues_faced || []}
        onValueChange={(value) => updateField('issues_faced', value)}
        options={issuesOptions}
        placeholder="Select all issues that affect you"
        maxSelections={8}
        icon="report-problem"
        error={errors.issues_faced}
      />

      {data.issues_faced && data.issues_faced.includes('others') && (
        <FormInput
          label="Other Issues (Specify)"
          value={data.other_issues}
          onChangeText={(value) => updateField('other_issues', value)}
          placeholder="Describe other issues"
          multiline={true}
          icon="edit"
          error={errors.other_issues}
        />
      )}

      <FormInput
        label="Most Important Issue for You"
        value={data.most_important_issue}
        onChangeText={(value) => updateField('most_important_issue', value)}
        placeholder="Which issue affects you the most?"
        multiline={true}
        icon="priority-high"
        error={errors.most_important_issue}
      />

      <FormInput
        label="Government Scheme Benefits Received"
        value={data.govt_schemes}
        onChangeText={(value) => updateField('govt_schemes', value)}
        placeholder="List government schemes you have benefited from"
        multiline={true}
        icon="account-balance"
        error={errors.govt_schemes}
      />

      <FormToggle
        label="Satisfied with Current MLA Performance"
        value={data.mla_satisfaction}
        onValueChange={(value) => updateField('mla_satisfaction', value)}
        options={[
          { label: 'Yes', value: true },
          { label: 'No', value: false },
          { label: 'Neutral', value: null }
        ]}
        icon="person"
        error={errors.mla_satisfaction}
      />

      <FormInput
        label="Suggestions for Area Development"
        value={data.development_suggestions}
        onChangeText={(value) => updateField('development_suggestions', value)}
        placeholder="Your suggestions for improving the area"
        multiline={true}
        icon="lightbulb"
        error={errors.development_suggestions}
      />

      <FormToggle
        label="Willing to Participate in Community Activities"
        value={data.community_participation}
        onValueChange={(value) => updateField('community_participation', value)}
        icon="groups"
        error={errors.community_participation}
      />

      <FormInput
        label="Contact Person for Family"
        value={data.family_contact_person}
        onChangeText={(value) => updateField('family_contact_person', value)}
        placeholder="Name of main contact person in family"
        icon="contact-phone"
        error={errors.family_contact_person}
      />

      <FormInput
        label="Family Contact Number"
        value={data.family_contact_number}
        onChangeText={(value) => updateField('family_contact_number', value)}
        placeholder="Alternative contact number"
        keyboardType="phone-pad"
        maxLength={10}
        icon="phone"
        error={errors.family_contact_number}
      />

      <FormInput
        label="Additional Comments"
        value={data.additional_comments}
        onChangeText={(value) => updateField('additional_comments', value)}
        placeholder="Any additional comments or feedback"
        multiline={true}
        icon="comment"
        error={errors.additional_comments}
      />

      <FormToggle
        label="Data Collection Consent"
        value={data.data_consent}
        onValueChange={(value) => updateField('data_consent', value)}
        required={true}
        icon="privacy-tip"
        error={errors.data_consent}
        options={[
          { label: 'I consent to data collection', value: true },
          { label: 'I do not consent', value: false }
        ]}
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

export default FeedbackStep;