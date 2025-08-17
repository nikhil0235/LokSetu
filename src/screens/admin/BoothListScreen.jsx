import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { AppIcon, BackButton } from '../../components/common';

const BoothListScreen = ({ onBack, onLogout }) => {
  const { booths } = useSelector(state => state.dashboard);

  const renderBooth = ({ item }) => (
    <View style={styles.boothCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.boothNumber}>Part #{item.partNumber}</Text>
        <View style={styles.statusContainer}>
          <AppIcon name="circle" size={8} color="#10B981" />
          <Text style={[styles.statusText, { color: '#10B981' }]}>Active</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{item.partName}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Assembly:</Text>
          <Text style={styles.infoValue}>{item.acNumber}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>District:</Text>
          <Text style={styles.infoValue}>{item.districtCd}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>State:</Text>
          <Text style={styles.infoValue}>{item.stateCd}</Text>
        </View>
      </View>
    </View>
  );

  const keyExtractor = (item, index) => item.partId?.toString() || index.toString();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.headerTitle}>All Booths</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <AppIcon name="power-settings-new" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Booths</Text>
        <Text style={styles.summaryCount}>{booths.length}</Text>
        <Text style={styles.summarySubtitle}>Polling stations</Text>
      </View>

      <FlatList
        data={booths}
        renderItem={renderBooth}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppIcon name="location-off" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Booths Found</Text>
            <Text style={styles.emptySubtitle}>No polling booths are currently available.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  logoutButton: {
    padding: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  summaryCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  boothCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  boothNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default BoothListScreen;