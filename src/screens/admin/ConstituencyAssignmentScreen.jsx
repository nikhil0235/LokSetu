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
} from 'react-native';
const icons = {
  Search: '🔍',
  MapPin: '📍',
  User: '👤',
  Plus: '➕',
  X: '✖️',
  Check: '✓',
  Users: '👥',
  BarChart3: '📊',
};

const ConstituencyAssignmentScreen = ({ onBack, onLogout }) => {
  const [constituencies, setConstituencies] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Mock data
  const mockConstituencies = [
    {
      id: 1,
      name: 'Constituency-1',
      area: 'North Zone',
      totalBooths: 45,
      assignedAdmin: {
        id: 1,
        name: 'Rajesh Kumar',
        email: 'rajesh@email.com'
      },
      boothBoys: 12,
      dataProgress: 85,
      status: 'active'
    },
    {
      id: 2,
      name: 'Constituency-2',
      area: 'South Zone',
      totalBooths: 38,
      assignedAdmin: {
        id: 2,
        name: 'Priya Singh',
        email: 'priya@email.com'
      },
      boothBoys: 8,
      dataProgress: 72,
      status: 'active'
    },
    {
      id: 3,
      name: 'Constituency-3',
      area: 'East Zone',
      totalBooths: 52,
      assignedAdmin: null,
      boothBoys: 0,
      dataProgress: 0,
      status: 'unassigned'
    },
    {
      id: 4,
      name: 'Constituency-4',
      area: 'West Zone',
      totalBooths: 41,
      assignedAdmin: {
        id: 3,
        name: 'Amit Sharma',
        email: 'amit@email.com'
      },
      boothBoys: 15,
      dataProgress: 91,
      status: 'active'
    },
    {
      id: 5,
      name: 'Constituency-5',
      area: 'Central Zone',
      totalBooths: 33,
      assignedAdmin: null,
      boothBoys: 0,
      dataProgress: 0,
      status: 'unassigned'
    },
  ];

  const mockAdmins = [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@email.com', assignedConstituency: 'Constituency-1' },
    { id: 2, name: 'Priya Singh', email: 'priya@email.com', assignedConstituency: 'Constituency-2' },
    { id: 3, name: 'Amit Sharma', email: 'amit@email.com', assignedConstituency: 'Constituency-4' },
    { id: 4, name: 'Neha Patel', email: 'neha@email.com', assignedConstituency: null },
    { id: 5, name: 'Suresh Gupta', email: 'suresh@email.com', assignedConstituency: null },
    { id: 6, name: 'Kavita Joshi', email: 'kavita@email.com', assignedConstituency: null },
  ];

  useEffect(() => {
    setConstituencies(mockConstituencies);
    setAdmins(mockAdmins);
  }, []);

  const filteredConstituencies = constituencies.filter(constituency =>
    constituency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    constituency.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableAdmins = admins.filter(admin => !admin.assignedConstituency);

  const handleAssignAdmin = () => {
    if (!selectedConstituency || !selectedAdmin) {
      Alert.alert('Error', 'Please select both constituency and admin');
      return;
    }

    const updatedConstituencies = constituencies.map(constituency => {
      if (constituency.id === selectedConstituency.id) {
        return {
          ...constituency,
          assignedAdmin: selectedAdmin,
          status: 'active'
        };
      }
      return constituency;
    });

    const updatedAdmins = admins.map(admin => {
      if (admin.id === selectedAdmin.id) {
        return {
          ...admin,
          assignedConstituency: selectedConstituency.name
        };
      }
      return admin;
    });

    setConstituencies(updatedConstituencies);
    setAdmins(updatedAdmins);
    setShowAssignModal(false);
    setSelectedConstituency(null);
    setSelectedAdmin(null);

    Alert.alert(
      'Success',
      `${selectedAdmin.name} has been assigned to ${selectedConstituency.name}`
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
            const updatedConstituencies = constituencies.map(c => {
              if (c.id === constituency.id) {
                return {
                  ...c,
                  assignedAdmin: null,
                  status: 'unassigned'
                };
              }
              return c;
            });

            const updatedAdmins = admins.map(admin => {
              if (admin.id === constituency.assignedAdmin.id) {
                return {
                  ...admin,
                  assignedConstituency: null
                };
              }
              return admin;
            });

            setConstituencies(updatedConstituencies);
            setAdmins(updatedAdmins);
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
          <Text style={[styles.iconText, { fontSize: 14 }]}>{icons.MapPin}</Text>
          <Text style={styles.statText}>{constituency.totalBooths} Booths</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.iconText, { fontSize: 14 }]}>{icons.Users}</Text>
          <Text style={styles.statText}>{constituency.boothBoys} Booth Boys</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.iconText, { fontSize: 14 }]}>{icons.BarChart3}</Text>
          <Text style={styles.statText}>{constituency.dataProgress}% Complete</Text>
        </View>
      </View>

      {constituency.assignedAdmin ? (
        <View style={styles.adminSection}>
          <View style={styles.adminInfo}>
            <Text style={[styles.iconText, { fontSize: 14, color: '#3B82F6' }]}>{icons.User}</Text>
            <View style={styles.adminDetails}>
              <Text style={styles.adminName}>{constituency.assignedAdmin.name}</Text>
              <Text style={styles.adminEmail}>{constituency.assignedAdmin.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.unassignButton}
            onPress={() => handleUnassignAdmin(constituency)}
          >
            <Text style={[styles.iconText, { fontSize: 14, color: '#EF4444' }]}>{icons.X}</Text>
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
          <Text style={[styles.iconText, { fontSize: 14, color: '#FFFFFF' }]}>{icons.Plus}</Text>
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
          <Text style={styles.iconText}>{icons.X}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Constituency Assignment</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.iconText}>{icons.Search}</Text>
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
          <Text style={styles.summaryValue}>{constituencies.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#10B981' }]}>
            {constituencies.filter(c => c.status === 'active').length}
          </Text>
          <Text style={styles.summaryLabel}>Assigned</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
            {constituencies.filter(c => c.status === 'unassigned').length}
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

      {/* Constituencies List */}
      <FlatList
        data={filteredConstituencies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ConstituencyCard constituency={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

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
                <Text style={styles.iconText}>{icons.X}</Text>
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
                  key={admin.id}
                  style={[
                    styles.adminOption,
                    selectedAdmin?.id === admin.id && styles.selectedAdminOption
                  ]}
                  onPress={() => setSelectedAdmin(admin)}
                >
                  <View style={styles.adminOptionInfo}>
                    <Text style={styles.adminOptionName}>{admin.name}</Text>
                    <Text style={styles.adminOptionEmail}>{admin.email}</Text>
                  </View>
                  {selectedAdmin?.id === admin.id && (
                    <Text style={[styles.iconText, { color: '#3B82F6' }]}>{icons.Check}</Text>
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
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  iconText: {
    fontSize: 18,
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
    marginLeft: 4,
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
});

export default ConstituencyAssignmentScreen;