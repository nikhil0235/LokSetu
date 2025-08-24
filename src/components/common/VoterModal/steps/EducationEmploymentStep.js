import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import FormPicker from '../fields/FormPicker';
import FormInput from '../fields/FormInput';

const EducationEmploymentStep = ({ data, onDataChange, errors }) => {
  const updateField = (field, value) => {
    onDataChange({ ...data, [field]: value });
  };

  const educationOptions = [
    { label: 'Below 10th', value: 'below_10th' },
    { label: '10th Pass', value: '10th' },
    { label: '12th Pass', value: '12th' },
    { label: 'Graduate', value: 'graduate' },
    { label: 'Post Graduate', value: 'post_graduate' },
    { label: 'Professional Degree', value: 'professional' },
    { label: 'PhD/Research', value: 'phd' },
    { label: 'Illiterate', value: 'illiterate' }
  ];

  const employmentOptions = [
    { label: 'Government Job', value: 'govt_job' },
    { label: 'Private Job', value: 'private_job' },
    { label: 'Gig Worker', value: 'gig_worker' },
    { label: 'Business/Self Employed', value: 'business' },
    { label: 'Agriculture', value: 'agriculture' },
    { label: 'Digital Creator', value: 'digital_creator' },
    { label: 'Student', value: 'student' },
    { label: 'Unemployed', value: 'unemployed' },
    { label: 'Retired', value: 'retired' },
    { label: 'Homemaker', value: 'homemaker' }
  ];

  const govtJobTypes = [
    { label: 'Central Government', value: 'central' },
    { label: 'State Government', value: 'state' },
    { label: 'PSU', value: 'psu' },
    { label: 'Railway', value: 'railway' },
    { label: 'Defense', value: 'defense' },
    { label: 'Police', value: 'police' },
    { label: 'Teacher', value: 'teacher' },
    { label: 'Healthcare', value: 'healthcare' }
  ];

  const govtJobGroups = [
    { label: 'Group A', value: 'group_a' },
    { label: 'Group B', value: 'group_b' },
    { label: 'Group C', value: 'group_c' },
    { label: 'Group D', value: 'group_d' }
  ];

  const salaryRanges = [
    { label: 'Below ₹25,000', value: 'below_25k' },
    { label: '₹25,000 - ₹50,000', value: '25k_50k' },
    { label: '₹50,000 - ₹1,00,000', value: '50k_1l' },
    { label: '₹1,00,000 - ₹2,00,000', value: '1l_2l' },
    { label: 'Above ₹2,00,000', value: 'above_2l' }
  ];

  const businessTypes = [
    { label: 'Retail Shop', value: 'retail' },
    { label: 'Manufacturing', value: 'manufacturing' },
    { label: 'Services', value: 'services' },
    { label: 'Trading', value: 'trading' },
    { label: 'Restaurant/Hotel', value: 'restaurant' },
    { label: 'Transport', value: 'transport' },
    { label: 'Construction', value: 'construction' },
    { label: 'Others', value: 'others' }
  ];

  const gigWorkerTypes = [
    { label: 'Ola/Uber Driver', value: 'cab_driver' },
    { label: 'Delivery Boy', value: 'delivery' },
    { label: 'Auto Driver', value: 'auto_driver' },
    { label: 'Freelancer', value: 'freelancer' },
    { label: 'Others', value: 'others' }
  ];

  const unemploymentReasons = [
    { label: 'Preparing for Government Job', value: 'preparing_govt' },
    { label: 'Looking for Job', value: 'job_search' },
    { label: 'Health Issues', value: 'health' },
    { label: 'Family Responsibilities', value: 'family' },
    { label: 'No Opportunities', value: 'no_opportunities' },
    { label: 'Others', value: 'others' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <FormPicker
        label="Education Level"
        value={data.education_level}
        onValueChange={(value) => updateField('education_level', value)}
        options={educationOptions}
        placeholder="Select education level"
        required={true}
        icon="school"
        error={errors.education_level}
      />

      <FormPicker
        label="Employment Status"
        value={data.employment_status}
        onValueChange={(value) => updateField('employment_status', value)}
        options={employmentOptions}
        placeholder="Select employment status"
        required={true}
        icon="work"
        error={errors.employment_status}
      />

      {/* Government Job Details */}
      {data.employment_status === 'govt_job' && (
        <>
          <FormPicker
            label="Government Job Type"
            value={data.govt_job_type}
            onValueChange={(value) => updateField('govt_job_type', value)}
            options={govtJobTypes}
            placeholder="Select job type"
            icon="account-balance"
            error={errors.govt_job_type}
          />

          <FormPicker
            label="Job Group"
            value={data.govt_job_group}
            onValueChange={(value) => updateField('govt_job_group', value)}
            options={govtJobGroups}
            placeholder="Select job group"
            icon="grade"
            error={errors.govt_job_group}
          />

          <FormInput
            label="Job Role/Designation"
            value={data.job_role}
            onChangeText={(value) => updateField('job_role', value)}
            placeholder="Enter job role"
            icon="badge"
            error={errors.job_role}
          />

          <FormPicker
            label="Salary Range"
            value={data.salary_range}
            onValueChange={(value) => updateField('salary_range', value)}
            options={salaryRanges}
            placeholder="Select salary range"
            icon="currency-rupee"
            error={errors.salary_range}
          />
        </>
      )}

      {/* Private Job Details */}
      {data.employment_status === 'private_job' && (
        <>
          <FormInput
            label="Job Role/Designation"
            value={data.job_role}
            onChangeText={(value) => updateField('job_role', value)}
            placeholder="Enter job role"
            icon="badge"
            error={errors.job_role}
          />

          <FormInput
            label="Company Name"
            value={data.company_name}
            onChangeText={(value) => updateField('company_name', value)}
            placeholder="Enter company name"
            icon="business"
            error={errors.company_name}
          />

          <FormPicker
            label="Salary Range"
            value={data.salary_range}
            onValueChange={(value) => updateField('salary_range', value)}
            options={salaryRanges}
            placeholder="Select salary range"
            icon="currency-rupee"
            error={errors.salary_range}
          />
        </>
      )}

      {/* Business Details */}
      {data.employment_status === 'business' && (
        <>
          <FormPicker
            label="Business Type"
            value={data.business_type}
            onValueChange={(value) => updateField('business_type', value)}
            options={businessTypes}
            placeholder="Select business type"
            icon="store"
            error={errors.business_type}
          />

          {data.business_type === 'others' && (
            <FormInput
              label="Other Business Type"
              value={data.business_type_other}
              onChangeText={(value) => updateField('business_type_other', value)}
              placeholder="Specify business type"
              icon="edit"
              error={errors.business_type_other}
            />
          )}

          <FormInput
            label="Business Name"
            value={data.business_name}
            onChangeText={(value) => updateField('business_name', value)}
            placeholder="Enter business name"
            icon="storefront"
            error={errors.business_name}
          />
        </>
      )}

      {/* Gig Worker Details */}
      {data.employment_status === 'gig_worker' && (
        <FormPicker
          label="Gig Work Type"
          value={data.gig_worker_type}
          onValueChange={(value) => updateField('gig_worker_type', value)}
          options={gigWorkerTypes}
          placeholder="Select gig work type"
          icon="directions-car"
          error={errors.gig_worker_type}
        />
      )}

      {/* Agriculture Details */}
      {data.employment_status === 'agriculture' && (
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <FormInput
              label="Land Holding (Acres)"
              value={data.land_holding}
              onChangeText={(value) => updateField('land_holding', value)}
              placeholder="Enter land size"
              keyboardType="decimal-pad"
              icon="landscape"
              error={errors.land_holding}
            />
          </View>
          <View style={styles.halfWidth}>
            <FormInput
              label="Crop Type"
              value={data.crop_type}
              onChangeText={(value) => updateField('crop_type', value)}
              placeholder="Main crops"
              icon="grass"
              error={errors.crop_type}
            />
          </View>
        </View>
      )}

      {/* Unemployment Reason */}
      {data.employment_status === 'unemployed' && (
        <FormPicker
          label="Reason for Unemployment"
          value={data.unemployment_reason}
          onValueChange={(value) => updateField('unemployment_reason', value)}
          options={unemploymentReasons}
          placeholder="Select reason"
          icon="help"
          error={errors.unemployment_reason}
        />
      )}

      <FormInput
        label="Work Experience (Years)"
        value={data.work_experience}
        onChangeText={(value) => updateField('work_experience', value)}
        placeholder="Total work experience"
        keyboardType="numeric"
        icon="timeline"
        error={errors.work_experience}
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

export default EducationEmploymentStep;