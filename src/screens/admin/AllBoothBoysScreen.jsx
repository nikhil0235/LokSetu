import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadDashboardData } from '../../store/slices/dashboardSlice';

const AllBoothBoysScreen = ({ onBack, onLogout }) => {
  const dispatch = useDispatch();
  const { boothBoys, loading } = useSelector(state => state.dashboard);
  const [refreshing, setRefreshing] = useState(false);

  const loadBoothBoys = async () => {
    try {
      await dispatch(loadDashboardData()).unwrap();
    } catch (error) {
      console.error('Error loading booth boys:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBoothBoys();
    setRefreshing(false);
  };

  useEffect(() => {
    loadBoothBoys();
  }, []);

  const BoothBoyCard = ({ boothBoy }) => (
    <View style={styles.boothBoyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{boothBoy.FullName || boothBoy.Username}</Text>
          <Text style={styles.userRole}>{boothBoy.Role}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
          <Text style={[styles.statusText, { color: '#10B981' }]}>Active</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{boothBoy.Username}</Text>
        </View>
        
        {boothBoy.Phone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{boothBoy.Phone}</Text>
          </View>
        )}
        
        {boothBoy.Email && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{boothBoy.Email}</Text>
          </View>
        )}
        
        {boothBoy.AssignedBoothIDs && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Booths:</Text>
            <Text style={styles.infoValue}>{boothBoy.AssignedBoothIDs}</Text>
          </View>
        )}

        {boothBoy.Created_by && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created By:</Text>
            <Text style={styles.infoValue}>{boothBoy.Created_by}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Booth Boys</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Booth Boys</Text>
        <Text style={styles.summaryCount}>{boothBoys.length}</Text>
        <Text style={styles.summarySubtitle}>Across all admins</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {boothBoys.length > 0 ? (
          boothBoys.map((boothBoy, index) => (
            <BoothBoyCard key={boothBoy.UserID || index} boothBoy={boothBoy} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No Booth Boys Found</Text>
            <Text style={styles.emptySubtitle}>No booth boys are currently in the system.</Text>
          </View>
        )}
      </ScrollView>
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
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  backIcon: {
    fontSize: 20,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    fontSize: 20,
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
    color: '#3B82F6',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  boothBoyCard: {
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
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
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default AllBoothBoysScreen;