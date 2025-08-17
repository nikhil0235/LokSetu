import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadDashboardData } from '../../store/slices/dashboardSlice';
import { AppIcon } from '../../components/common';

const ConstituencyAssignmentScreen = ({ onBack, onLogout }) => {
  const dispatch = useDispatch();
  const dashboardState = useSelector(state => state.dashboard);
  const { constituencies, admins, loading } = dashboardState;
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [assignedConstituencies, setAssignedConstituencies] = useState({});

  // Debug the entire dashboard state
  console.log('Full dashboard state:', dashboardState);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(loadDashboardData()).unwrap();
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setRefreshing(false);
  };

  // Debug logging
  console.log('Constituencies data:', constituencies);
  console.log('Constituencies length:', constituencies?.length);
  console.log('Admins data:', admins);
  console.log('Admins length:', admins?.length);
  console.log('Loading state:', loading);

  // Transform constituencies data to match expected format
  const transformedConstituencies = (constituencies || []).map((constituency, index) => ({
    id: constituency.acId || (index + 1),
    name: constituency.asmblyName || 'Unknown Constituency',
    area: constituency.districtCd || 'Unknown Area',
    totalBooths: constituency.total_booths || 0,
    assignedAdmin: assignedConstituencies[constituency.acId] || null,
    boothBoys: 0,
    dataProgress: 0,
    status: assignedConstituencies[constituency.acId] ? 'active' : 'unassigned'
  }));

  const filteredConstituencies = transformedConstituencies.filter(constituency =>
    (constituency.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (constituency.area || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableAdmins = admins || [];

  const handleAssignAdmin = () => {
    if (!selectedConstituency || !selectedAdmin) {
      Alert.alert('Error', 'Please select both constituency and admin');
      return;
    }

    const adminData = {
      id: selectedAdmin.UserID,
      name: selectedAdmin.FullName || selectedAdmin.Username,
      email: selectedAdmin.Email || selectedAdmin.Username
    };

    setAssignedConstituencies(prev => ({
      ...prev,
      [selectedConstituency.id]: adminData
    }));

    setShowAssignModal(false);
    setSelectedConstituency(null);
    setSelectedAdmin(null);

    Alert.alert(
      'Success',
      `${adminData.name} has been assigned to ${selectedConstituency.name}`
    );
  };

  const handleUnassignAdmin = (constituency) => {
    Alert.alert(
      'Unassign Admin',
      `Are you sure you want to unassign ${constituency.assignedAdmin.name} from ${constituency.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unassign',
          style: 'destructive',
          onPress: () => {
            setAssignedConstituencies(prev => {
              const updated = { ...prev };
              delete updated[constituency.id];
              return updated;
            });
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'unassigned': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const ConstituencyCard = ({ constituency }) => (
    <View style={styles.constituencyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.constituencyInfo}>
          <Text style={styles.constituencyName}>{constituency.name}</Text>
          <Text style={styles.constituencyArea}>{constituency.area}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(constituency.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(constituency.status) }]}>
            {constituency.status.charAt(0).toUpperCase() + constituency.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <AppIcon name="location-on" size={16} color="#6B7280" />
          <Text style={styles.statText}>{constituency.totalBooths} Booths</Text>
        </View>
        <View style={styles.statItem}>
          <AppIcon name="group" size={16} color="#6B7280" />
          <Text style={styles.statText}>{constituency.boothBoys} Booth Boys</Text>
        </View>
        <View style={styles.statItem}>
          <AppIcon name="bar-chart" size={16} color="#6B7280" />
          <Text style={styles.statText}>{constituency.dataProgress}% Complete</Text>
        </View>
      </View>

      {constituency.assignedAdmin ? (
        <View style={styles.adminSection}>
          <View style={styles.adminInfo}>
            <AppIcon name="person" size={16} color="#3B82F6" />
            <View style={styles.adminDetails}>
              <Text style={styles.adminName}>{constituency.assignedAdmin.name}</Text>
              <Text style={styles.adminEmail}>{constituency.assignedAdmin.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.unassignButton}
            onPress={() => handleUnassignAdmin(constituency)}
          >
            <AppIcon name="close" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.assignButton}
          onPress={() => {
            setSelectedConstituency(constituency);
            setShowAssignModal(true);
          }}
        >
          <AppIcon name="add" size={16} color="#FFFFFF" />
          <Text style={styles.assignButtonText}>Assign Admin</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <AppIcon name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Constituency Assignment</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <AppIcon name="logout" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <AppIcon name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search constituencies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{transformedConstituencies.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#10B981' }]}>
            {transformedConstituencies.filter(c => c.status === 'active').length}
          </Text>
          <Text style={styles.summaryLabel}>Assigned</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
            {transformedConstituencies.filter(c => c.status === 'unassigned').length}
          </Text>
          <Text style={styles.summaryLabel}>Unassigned</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>
            {availableAdmins.length}
          </Text>
          <Text style={styles.summaryLabel}>Available Admins</Text>
        </View>
      </View>

      {/* Debug Info */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>Constituencies: {constituencies?.length || 0}</Text>
        <Text style={styles.debugText}>Admins: {admins?.length || 0}</Text>
        <Text style={styles.debugText}>Loading: {loading ? 'Yes' : 'No'}</Text>
      </View>

      {/* Constituencies List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading constituencies...</Text>
        </View>
      ) : filteredConstituencies.length > 0 ? (
        <FlatList
          data={filteredConstituencies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ConstituencyCard constituency={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <AppIcon name="location-off" size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Constituencies Found</Text>
          <Text style={styles.emptySubtitle}>Constituencies: {constituencies?.length || 0}, Admins: {admins?.length || 0}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Assignment Modal */}
      <Modal
        visible={showAssignModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Admin</Text>
              <TouchableOpacity
                onPress={() => setShowAssignModal(false)}
                style={styles.modalCloseButton}
              >
                <AppIcon name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedConstituency && (
              <View style={styles.selectedConstituency}>
                <Text style={styles.modalLabel}>Selected Constituency:</Text>
                <Text style={styles.modalValue}>{selectedConstituency.name}</Text>
                <Text style={styles.modalSubValue}>{selectedConstituency.area}</Text>
              </View>
            )}

            <Text style={styles.modalLabel}>Select Admin:</Text>
            <ScrollView style={styles.adminsList}>
              {availableAdmins.map((admin) => (
                <TouchableOpacity
                  key={admin.UserID}
                  style={[
                    styles.adminOption,
                    selectedAdmin?.UserID === admin.UserID && styles.selectedAdminOption
                  ]}
                  onPress={() => setSelectedAdmin(admin)}
                >
                  <View style={styles.adminOptionInfo}>
                    <Text style={styles.adminOptionName}>{admin.FullName || admin.Username}</Text>
                    <Text style={styles.adminOptionEmail}>{admin.Email || admin.Username}</Text>
                  </View>
                  {selectedAdmin?.UserID === admin.UserID && (
                    <AppIcon name="check" size={16} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAssignModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  (!selectedAdmin || !selectedConstituency) && styles.disabledButton
                ]}
                onPress={handleAssignAdmin}
                disabled={!selectedAdmin || !selectedConstituency}
              >
                <Text style={styles.confirmButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  listContainer: {
    padding: 20,
  },
  constituencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  constituencyInfo: {
    flex: 1,
  },
  constituencyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  constituencyArea: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  adminSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  adminDetails: {
    marginLeft: 8,
  },
  adminName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  adminEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  unassignButton: {
    padding: 4,
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
  },
  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalCloseButton: {
    padding: 4,
  },
  selectedConstituency: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  modalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalSubValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  adminsList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  adminOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedAdminOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  adminOptionInfo: {
    flex: 1,
  },
  adminOptionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  adminOptionEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  debugContainer: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#92400E',
  },
});

export default ConstituencyAssignmentScreen;