
// components/features/IndianFlagDecoration.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const IndianFlagDecoration = () => {
  return (
    <View style={styles.flagDecoration}>
      <View style={[styles.flagStripe, { backgroundColor: '#FF6B35' }]} />
      <View style={[styles.flagStripe, { backgroundColor: '#FFFFFF' }]} />
      <View style={[styles.flagStripe, { backgroundColor: '#138808' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  flagDecoration: {
    flexDirection: 'row',
    height: 4,
    marginBottom: 30,
    borderRadius: 2,
    overflow: 'hidden',
  },
  flagStripe: {
    flex: 1,
  },
});

export default IndianFlagDecoration;