
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
    { icon: '📊', text: 'Real-time Constituency Analytics' },
    { icon: '🗳️', text: 'Digital Voting Insights' },
    { icon: '🤝', text: 'Direct Citizen Connect' },
    { icon: '🔒', text: 'Secure & Transparent' },
  ];

  return (
    <View style={styles.featuresSection}>
      <Text style={styles.featuresTitle}>Why Politicians Choose LokSetu?</Text>
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
    color: '#555',
    flex: 1,
  },
});

export default FeaturesSection;