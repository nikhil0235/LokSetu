import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import FormPicker from '../fields/FormPicker';
import FormInput from '../fields/FormInput';

const CulturalStep = ({ data, onDataChange, errors }) => {
  const updateField = (field, value) => {
    onDataChange({ ...data, [field]: value });
  };

  const religionOptions = [
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Muslim', value: 'Muslim' },
    { label: 'Sikh', value: 'Sikh' },
    { label: 'Christian', value: 'Christian' },
    { label: 'Buddhist', value: 'Buddhist' },
    { label: 'Jain', value: 'Jain' },
    { label: 'Others', value: 'Others' }
  ];

  const categoryOptions = [
    { label: 'General', value: 'General' },
    { label: 'OBC', value: 'OBC' },
    { label: 'SC', value: 'SC' },
    { label: 'ST', value: 'ST' }
  ];

  const obcSubtypeOptions = [
    { label: 'BC1 (Most Backward)', value: 'BC1' },
    { label: 'BC2 (Backward)', value: 'BC2' },
    { label: 'EBC (Extremely Backward)', value: 'EBC' }
  ];

  const casteByCategory = {
    'General': [
      { label: 'Brahmin', value: 'Brahmin' },
      { label: 'Rajput', value: 'Rajput' },
      { label: 'Bhumihar', value: 'Bhumihar' },
      { label: 'Kayastha', value: 'Kayastha' },
      { label: 'Baniya', value: 'Baniya' },
      { label: 'Others', value: 'Others' }
    ],
    'OBC': [
      { label: 'Yadav', value: 'Yadav' },
      { label: 'Kurmi', value: 'Kurmi' },
      { label: 'Koeri', value: 'Koeri' },
      { label: 'Teli', value: 'Teli' },
      { label: 'Nai', value: 'Nai' },
      { label: 'Kumhar', value: 'Kumhar' },
      { label: 'Mallah', value: 'Mallah' },
      { label: 'Nonia', value: 'Nonia' },
      { label: 'Others', value: 'Others' }
    ],
    'SC': [
      { label: 'Chamar', value: 'Chamar' },
      { label: 'Dusadh', value: 'Dusadh' },
      { label: 'Musahar', value: 'Musahar' },
      { label: 'Dom', value: 'Dom' },
      { label: 'Dhobi', value: 'Dhobi' },
      { label: 'Pasi', value: 'Pasi' },
      { label: 'Others', value: 'Others' }
    ],
    'ST': [
      { label: 'Santhal', value: 'Santhal' },
      { label: 'Oraon', value: 'Oraon' },
      { label: 'Munda', value: 'Munda' },
      { label: 'Kharia', value: 'Kharia' },
      { label: 'Others', value: 'Others' }
    ]
  };

  const getCasteOptions = () => {
    if (!data.category) return [];
    return casteByCategory[data.category] || [];
  };

  const languageOptions = [
    { label: 'Hindi', value: 'Hindi' },
    { label: 'Bhojpuri', value: 'Bhojpuri' },
    { label: 'Maithili', value: 'Maithili' },
    { label: 'Magahi', value: 'Magahi' },
    { label: 'Angika', value: 'Angika' },
    { label: 'Bajjika', value: 'Bajjika' },
    { label: 'Urdu', value: 'Urdu' },
    { label: 'English', value: 'English' },
    { label: 'Others', value: 'Others' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <FormPicker
        label="Religion"
        value={data.religion}
        onValueChange={(value) => updateField('religion', value)}
        options={religionOptions}
        placeholder="Select religion"
        icon="account-balance"
        error={errors.religion}
      />

      <FormPicker
        label="Category"
        value={data.category}
        onValueChange={(value) => {
          updateField('category', value);
          // Clear caste when category changes
          if (data.caste) {
            updateField('caste', '');
          }
        }}
        options={categoryOptions}
        placeholder="Select category"
        required={true}
        icon="category"
        error={errors.category}
      />

      {data.category === 'OBC' && (
        <FormPicker
          label="OBC Subtype"
          value={data.obc_subtype}
          onValueChange={(value) => updateField('obc_subtype', value)}
          options={obcSubtypeOptions}
          placeholder="Select OBC subtype"
          icon="subdirectory-arrow-right"
          error={errors.obc_subtype}
        />
      )}

      {data.category && (
        <FormPicker
          label="Caste"
          value={data.caste}
          onValueChange={(value) => updateField('caste', value)}
          options={getCasteOptions()}
          placeholder={`Select caste for ${data.category}`}
          searchable={true}
          icon="group"
          error={errors.caste}
        />
      )}

      {data.caste === 'Others' && (
        <FormInput
          label="Other Caste (Specify)"
          value={data.caste_other}
          onChangeText={(value) => updateField('caste_other', value)}
          placeholder="Specify caste"
          icon="edit"
          error={errors.caste_other}
        />
      )}

      <FormPicker
        label="Preferred Communication Language"
        value={data.communication_language}
        onValueChange={(value) => updateField('communication_language', value)}
        options={languageOptions}
        placeholder="Select preferred language"
        icon="language"
        error={errors.communication_language}
      />

      {data.communication_language === 'Others' && (
        <FormInput
          label="Other Language (Specify)"
          value={data.language_other}
          onChangeText={(value) => updateField('language_other', value)}
          placeholder="Specify language"
          icon="edit"
          error={errors.language_other}
        />
      )}

      <FormInput
        label="Community/Tribe Details"
        value={data.community_details}
        onChangeText={(value) => updateField('community_details', value)}
        placeholder="Any specific community or tribal details"
        multiline={true}
        icon="people"
        error={errors.community_details}
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

export default CulturalStep;