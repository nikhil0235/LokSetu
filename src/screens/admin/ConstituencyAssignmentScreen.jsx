import React, { useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadDashboardData } from '../../store/slices/dashboardSlice';
import { AppIcon } from '../../components/common';
import { userService } from '../../services/api/user.service';

const ConstituencyAssignmentScreen = ({ onBack, onLogout }) => {
  const dispatch = useDispatch();
  const dashboardState = useSelector(state => state.dashboard);
  const { constituencies, admins } = dashboardState;
  const token = useSelector(state => state.auth.token);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [assignedConstituencies, setAssignedConstituencies] = useState({});
  const [isAssigning, setIsAssigning] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(loadDashboardData(true)).unwrap(); // Force refresh from network
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
    setRefreshing(false);
  };

  // Debug logging
  console.log('Constituencies data:', constituencies);
  console.log('Constituencies length:', constituencies?.length);
  console.log('Admins data:', admins);
  console.log('Admins length:', admins?.length);

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

  const handleAssignAdmin = async () => {
    if (!selectedConstituency || selectedAdmins.length === 0) {
      Alert.alert('Error', 'Please select constituency and at least one admin');
      return;
    }

    setIsAssigning(true);
    
    try {
      console.log('Redux token:', token);
      console.log('Auth header will be:', token);
      
      const constituencyId = selectedConstituency.id.toString();
      
      // Call API for each selected admin
      const assignmentPromises = selectedAdmins.map(async (admin) => {
        // Get current assigned constituencies for this admin
        const currentAssignments = admin.assigned_constituencies || '';
        const assignmentArray = currentAssignments ? currentAssignments.split(',') : [];
        
        // Add new constituency if not already assigned
        if (!assignmentArray.includes(constituencyId)) {
          assignmentArray.push(constituencyId);
        }
        
        const updatedAssignments = assignmentArray.join(',');
        
        console.log(`Calling PATCH /users/${admin.UserID} with:`, {
          assigned_constituencies: updatedAssignments
        });
        console.log('UserID type:', typeof admin.UserID, 'Value:', admin.UserID);
        
        return userService.updateUser(admin.UserID, {
          assigned_constituencies: updatedAssignments
        }, token);
      });

      const results = await Promise.all(assignmentPromises);
      console.log('All API calls successful:', results.length);

      // Update local state
      const adminData = selectedAdmins.map(admin => ({
        id: admin.UserID,
        name: admin.FullName || admin.Username,
        email: admin.Email || admin.Username
      }));

      setAssignedConstituencies(prev => ({
        ...prev,
        [selectedConstituency.id]: adminData
      }));

      setShowAssignModal(false);
      setSelectedConstituency(null);
      setSelectedAdmins([]);

      Alert.alert(
        'Success',
        `${selectedAdmins.length} admin(s) assigned to ${selectedConstituency.name}`
      );
    } catch (error) {
      console.error('Assignment error:', error);
      Alert.alert('Error', 'Failed to assign admins. Please try again.');
    } finally {
      setIsAssigning(false);
    }
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
            <AppIcon name="group" size={16} color="#3B82F6" />
            <View style={styles.adminDetails}>
              {Array.isArray(constituency.assignedAdmin) ? (
                <>
                  <Text style={styles.adminName}>{constituency.assignedAdmin.length} Admins Assigned</Text>
                  <Text style={styles.adminEmail}>
                    {constituency.assignedAdmin.map(admin => admin.name).join(', ')}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.adminName}>{constituency.assignedAdmin.name}</Text>
                  <Text style={styles.adminEmail}>{constituency.assignedAdmin.email}</Text>
                </>
              )}
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
          <Text style={styles.assignButtonText}>Assign Admins</Text>
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
        <Text style={styles.debugText}>Refreshing: {refreshing ? 'Yes' : 'No'}</Text>
      </View>

      {/* Constituencies List */}
      {filteredConstituencies.length > 0 ? (
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
        onRequestClose={() => {
          setShowAssignModal(false);
          setSelectedAdmins([]);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Admin</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAssignModal(false);
                  setSelectedAdmins([]);
                }}
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

            <Text style={styles.modalLabel}>Select Admins (Multiple Selection):</Text>
            <ScrollView style={styles.adminsList}>
              {availableAdmins.map((admin) => {
                const isSelected = selectedAdmins.some(selected => selected.UserID === admin.UserID);
                return (
                  <TouchableOpacity
                    key={admin.UserID}
                    style={[
                      styles.adminOption,
                      isSelected && styles.selectedAdminOption
                    ]}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedAdmins(prev => prev.filter(selected => selected.UserID !== admin.UserID));
                      } else {
                        setSelectedAdmins(prev => [...prev, admin]);
                      }
                    }}
                  >
                    <View style={styles.adminOptionInfo}>
                      <Text style={styles.adminOptionName}>{admin.FullName || admin.Username}</Text>
                      <Text style={styles.adminOptionEmail}>{admin.Email || admin.Username}</Text>
                    </View>
                    {isSelected && (
                      <AppIcon name="check" size={16} color="#3B82F6" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            
            {selectedAdmins.length > 0 && (
              <View style={styles.selectedCount}>
                <Text style={styles.selectedCountText}>{selectedAdmins.length} admin(s) selected</Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAssignModal(false);
                  setSelectedAdmins([]);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  (selectedAdmins.length === 0 || !selectedConstituency || isAssigning) && styles.disabledButton
                ]}
                onPress={handleAssignAdmin}
                disabled={selectedAdmins.length === 0 || !selectedConstituency || isAssigning}
              >
                {isAssigning ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Assign ({selectedAdmins.length})</Text>
                )}
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
  selectedCount: {
    backgroundColor: '#EBF4FF',
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
    alignItems: 'center',
  },
  selectedCountText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
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