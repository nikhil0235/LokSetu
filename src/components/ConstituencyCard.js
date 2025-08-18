import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppIcon } from './common';

const ConstituencyCard = ({ constituency, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(constituency)}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{constituency.asmblyName}</Text>
          <Text style={styles.nameL1}>{constituency.asmblyNameL1}</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.number}>{constituency.asmblyNo}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <AppIcon name="location-on" size={16} color="#666" />
          <Text style={styles.detailText}>State: {constituency.stateCd}</Text>
        </View>
        <View style={styles.detailRow}>
          <AppIcon name="business" size={16} color="#666" />
          <Text style={styles.detailText}>District: {constituency.districtCd}</Text>
        </View>
        <View style={styles.detailRow}>
          <AppIcon name="fingerprint" size={16} color="#666" />
          <Text style={styles.detailText}>AC ID: {constituency.acId}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.tapHint}>Tap to view voters</Text>
        <AppIcon name="arrow-forward-ios" size={14} color="#3B82F6" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  nameL1: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  numberContainer: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  number: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tapHint: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default ConstituencyCard;