import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BoothBoyProfile = ({ boothBoyInfo }) => {
  return (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{boothBoyInfo?.name?.charAt(0) || 'U'}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{boothBoyInfo?.name || 'Unknown'}</Text>
          <Text style={styles.profileId}>ID: {boothBoyInfo?.id || 'N/A'}</Text>
          <Text style={styles.profilePhone}>📱 {boothBoyInfo?.phone || 'N/A'}</Text>
        </View>
      </View>
      
      <View style={styles.assignmentInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Constituency:</Text>
          <Text style={styles.infoValue}>{boothBoyInfo?.constituency || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Area:</Text>
          <Text style={styles.infoValue}>{boothBoyInfo?.area || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Assigned Booths:</Text>
          <Text style={styles.infoValue}>{Array.isArray(boothBoyInfo?.assignedBooths) ? boothBoyInfo.assignedBooths.join(', ') : 'None'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Voters:</Text>
          <Text style={styles.infoValue}>{typeof boothBoyInfo?.totalVoters === 'number' ? boothBoyInfo.totalVoters.toLocaleString() : '0'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.3,
  },
  profileId: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 2,
  },
  assignmentInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1.2,
    textAlign: 'right',
  },
});

export default BoothBoyProfile;