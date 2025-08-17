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
import { AppIcon, BackButton } from '../../components/common';

const AllAdminsScreen = ({ onBack, onLogout }) => {
  const dispatch = useDispatch();
  const { admins, loading } = useSelector(state => state.dashboard);
  const [refreshing, setRefreshing] = useState(false);

  const loadAdmins = async () => {
    try {
      await dispatch(loadDashboardData()).unwrap();
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAdmins();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const AdminCard = ({ admin }) => (
    <View style={styles.adminCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{admin.FullName || admin.Username}</Text>
          <Text style={styles.userRole}>{admin.Role}</Text>
        </View>
        <View style={styles.statusContainer}>
          <AppIcon name="circle" size={8} color="#10B981" />
          <Text style={[styles.statusText, { color: '#10B981' }]}>Active</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{admin.Username}</Text>
        </View>
        
        {admin.Phone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{admin.Phone}</Text>
          </View>
        )}
        
        {admin.Email && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{admin.Email}</Text>
          </View>
        )}
        
        {admin.assigned_scope && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Area:</Text>
            <Text style={styles.infoValue}>{admin.assigned_scope}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.headerTitle}>All Admins</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <AppIcon name="power-settings-new" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Admins</Text>
        <Text style={styles.summaryCount}>{admins.length}</Text>
        <Text style={styles.summarySubtitle}>System administrators</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {admins.length > 0 ? (
          admins.map((admin, index) => (
            <AdminCard key={admin.UserID || index} admin={admin} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <AppIcon name="admin-panel-settings" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Admins Found</Text>
            <Text style={styles.emptySubtitle}>No admin users are currently in the system.</Text>
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
    color: '#8B5CF6',
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
  adminCard: {
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
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default AllAdminsScreen;