import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppIcon } from './';

const DemographicsCard = ({ 
  genderData = { male: 0, female: 0, others: 0 },
  ageData = { '18-35': 485+742, '36-55': 658+512, '56+': 450 },
  casteData = { General: 0, OBC: 0, SC: 0 },
  onDemographicPress
}) => {
  const topCastes = Object.entries(casteData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const genderItems = [
    { label: 'Male', value: genderData.male, color: '#3B82F6', key: 'M' },
    { label: 'Female', value: genderData.female, color: '#EC4899', key: 'F' },
    { label: 'Others', value: genderData.others, color: '#10B981', key: 'O' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <AppIcon name="people" size={16} color="#111827" />
        <Text style={styles.title}>Demographics Overview</Text>
      </View>
      
      <View style={styles.columnsContainer}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Gender</Text>
          {genderItems.map((item, index) => (
            <TouchableOpacity 
              key={item.key}
              style={[styles.ageItem, { backgroundColor: ['#EFF6FF', '#FDF2F8', '#ECFDF5'][index] }]}
              onPress={() => onDemographicPress?.('gender', item.key)}
            >
              <View style={[styles.ageIcon, { backgroundColor: item.color }]}>
                <Text style={styles.ageIconText}>{item.label[0]}</Text>
              </View>
              <View style={styles.ageInfo}>
                <Text style={styles.ageRange}>{item.label}</Text>
                <Text style={styles.ageCount}>{item.value}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Age Groups</Text>
          {Object.entries(ageData).map(([range, count], index) => (
            <TouchableOpacity 
              key={range}
              style={[styles.ageItem, { backgroundColor: ['#EFF6FF', '#F0F9FF', '#ECFDF5'][index] }]}
              onPress={() => onDemographicPress?.('age', range)}
            >
              <View style={[styles.ageIcon, { backgroundColor: ['#3B82F6', '#06B6D4', '#10B981'][index] }]}>
                <Text style={styles.ageIconText}>{range.split('-')[0] || '56'}</Text>
              </View>
              <View style={styles.ageInfo}>
                <Text style={styles.ageRange}>{range}</Text>
                <Text style={styles.ageCount}>{count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Caste</Text>
          {topCastes.map(([caste, count], index) => (
            <TouchableOpacity 
              key={caste}
              style={[styles.ageItem, { backgroundColor: ['#F3E8FF', '#F0F9FF', '#FFFBEB'][index] }]}
              onPress={() => onDemographicPress?.('caste', caste)}
            >
              <View style={[styles.ageIcon, { backgroundColor: ['#8B5CF6', '#06B6D4', '#F59E0B'][index] }]}>
                <Text style={styles.ageIconText}>{index + 1}</Text>
              </View>
              <View style={styles.ageInfo}>
                <Text style={styles.ageRange}>{caste}</Text>
                <Text style={styles.ageCount}>{count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 6,
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },

  ageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginBottom: 3,
    minHeight: 40,
  },
  ageIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  ageIconText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ageInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  ageRange: {
    fontSize: 9,
    fontWeight: '600',
    color: '#111827',
  },
  ageCount: {
    fontSize: 8,
    color: '#6B7280',
  },

});

export default DemographicsCard;