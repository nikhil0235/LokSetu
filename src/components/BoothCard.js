import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BoothCard = ({ booth, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(booth)}>
      <View style={styles.header}>
        <Text style={styles.boothNumber}>Booth #{booth.partNumber}</Text>
        <Text style={styles.boothId}>ID: {booth.partId}</Text>
      </View>
      
      <Text style={styles.boothName} numberOfLines={2}>
        {booth.partName}
      </Text>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>AC Number:</Text>
          <Text style={styles.value}>{booth.acNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>State:</Text>
          <Text style={styles.value}>{booth.stateCd}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>District:</Text>
          <Text style={styles.value}>{booth.districtCd}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  boothNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  boothId: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  boothName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
    fontWeight: '500',
  },
  details: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
});

export default BoothCard;