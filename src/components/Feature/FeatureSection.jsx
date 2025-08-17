
// components/features/FeaturesSection.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const FeaturesSection = () => {
  const features = [
    { icon: '📊', text: 'Live Election Monitoring' },
    { icon: '🔒', text: 'Bank-Grade Security' },
    { icon: '⚡', text: 'Instant Data Sync' },
    { icon: '🌍', text: 'Multi-Language Support' },
  ];

  return (
    <View style={styles.featuresSection}>
      <Text style={styles.featuresTitle}>Trusted by Election Officials Nationwide</Text>
      <View style={styles.featuresList}>
        {features.map((feature, index) => (
          <FeatureItem key={index} icon={feature.icon} text={feature.text} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featuresSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 25,
  },
  featuresTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresList: {
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
});

export default FeaturesSection;