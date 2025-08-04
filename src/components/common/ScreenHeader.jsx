import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScreenHeader = ({ icon, title, subtitle }) => {
  return (
    <View style={styles.screenHeader}>
      <Text style={styles.screenIcon}>{icon}</Text>
      <Text style={styles.screenTitle}>{title}</Text>
      <Text style={styles.screenSubtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screenHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  screenIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ScreenHeader;
