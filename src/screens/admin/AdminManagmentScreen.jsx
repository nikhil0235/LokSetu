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
} from 'react-native';
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Shield,
  Globe,
  X,
} from 'lucide-react-native';
import { useSelector } from 'react-redux';

const AdminManagementScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'super_admin';
  
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const mockAdmins = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91-9876543210',
      address: 'Sector 15, Phase 1, Bengaluru',
      constituency: 'Constituency-1',
      boothBoysCreated: 12,
      totalBooths: 45,
      dataProgress: 87.5,
      status: 'active',
      lastActive: '2h ago',
      joinedDate: '2024-01-15',
      role: 'admin',
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya.singh@email.com',
      phone: '+91-9876543211',
      address: 'Sector 22, Phase 2, Bengaluru',
      constituency: 'Constituency-2',
      boothBoysCreated: 8,
      totalBooths: 38,
      dataProgress: 72.1,
      status: 'active',
      lastActive: '1h ago',
      joinedDate: '2024-01-18',
      role: 'admin',
    },
    {
      id: 3,
      name: 'Amit Sharma',
      email: 'amit.sharma@email.com',
      phone: '+91-9876543212',
      address: 'Sector 8, Phase 3, Bengaluru',
      constituency: 'Constituency-4',
      boothBoysCreated: 15,
      totalBooths: 41,
      dataProgress: 91.3,
      status: 'active',
      lastActive: '30m ago',
      joinedDate: '2024-01-20',
      role: 'admin',
    },
    {
      id: 4,
      name: 'Neha Patel',
      email: 'neha.patel@email.com',
      phone: '+91-9876543213',
      address: 'Sector 12, Phase 2, Bengaluru',
      constituency: null,
      boothBoysCreated: 0,
      totalBooths: 0,
      dataProgress: 0,
      status: 'inactive',
      lastActive: '2d ago',
      joinedDate: '2024-01-22',
      role: 'admin',
    },
  ];

  useEffect(() => {
    setAdmins(mockAdmins);
    setFilteredAdmins(mockAdmins);
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    applyFilters(text, statusFilter);
  };

  const applyFilters = (searchText, status) => {
    let filtered = admins;

    if (searchText.trim()) {
      filtered = filtered.filter(admin =>
        admin.name.toLowerCase().includes(searchText.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchText.toLowerCase()) ||
        admin.phone.includes(searchText) ||
        (admin.constituency && admin.constituency.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(admin => admin.status === status);
    }

    setFilteredAdmins(filtered);
  };

  const toggleAdminStatus = (adminId) => {
    const updatedAdmins = admins.map(admin => {
      if (admin.id === adminId) {
        return {
          ...admin,
          status: admin.status === 'active' ? 'inactive' : 'active'
        };
      }
      return admin;
    });
    
    setAdmins(updatedAdmins);
    applyFilters(searchQuery, statusFilter);
    setShowActionModal(false);
    
    const admin = updatedAdmins.find(a => a.id === adminId);
    Alert.alert(
      'Status Updated', 
      `${admin.name} has been ${admin.status === 'active' ? 'activated' : 'deactivated'}.`
    );
  };

  const deleteAdmin = (adminId) => {
    Alert.alert(
      'Delete Admin',
      'Are you sure you want to delete this admin? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedAdmins = admins.filter(admin => admin.id !== adminId);
            setAdmins(updatedAdmins);
            applyFilters(searchQuery, statusFilter);
            setShowActionModal(false);
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#10B981' : '#EF4444';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const AdminCard = ({ admin }) => (
    <View style={styles.adminCard}>
      <View style={styles.cardHeader}>
        <View style={styles.adminInfo}>
          <View style={styles.adminNameRow}>
            <Shield size={16} color="#8B5CF6" />
            <Text style={styles.adminName}>{admin.name}</Text>
          </View>
          <Text style={styles.adminConstituency}>
            {admin.constituency || 'No constituency assigned'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            setSelectedAdmin(admin);
            setShowActionModal(true);
          }}
        >
          <MoreVertical size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.contactRow}>
          <Mail size={14} color="#6B7280" />
          <Text style={styles.contactText}>{admin.email}</Text>
        </View>
        <View style={styles.contactRow}>
          <Phone size={14} color="#6B7280" />
          <Text style={styles.contactText}>{admin.phone}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{admin.boothBoysCreated}</Text>
          <Text style={styles.statLabel}>Booth Boys</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{admin.totalBooths}</Text>
          <Text style={styles.statLabel}>Booths</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: getProgressColor(admin.dataProgress) }]}>
            {admin.dataProgress.toFixed(1)}%
          </Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      {admin.dataProgress > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${admin.dataProgress}%`,
                  backgroundColor: getProgressColor(admin.dataProgress)
                }
              ]} 
            />
          </View>
        </View>
      )}

      <View style={styles.cardFooter}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(admin.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(admin.status) }]}>
            {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
          </Text>
        </View>
        <Text style={styles.lastActive}>Last active: {admin.lastActive}</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => navigation.navigate('AdminDetails', { admin })}
        >
          <Eye size={14} color="#3B82F6" />
          <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Details</Text>
        </TouchableOpacity>
        
        {isSuperAdmin && (
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('EditAdmin', { admin })}
          >
            <Edit size={14} color="#10B981" />
            <Text style={[styles.actionButtonText, { color: '#10B981' }]}>Edit</Text>
          </TouchableOpacity>
        )}
        
        {isSuperAdmin && (
          <TouchableOpacity
            style={[styles.actionButton, styles.assignButton]}
            onPress={() => navigation.navigate('ConstituencyAssignment', { selectedAdmin: admin.id })}
          >
            <Globe size={14} color="#F59E0B" />
            <Text style={[styles.actionButtonText, { color: '#F59E0B' }]}>Assign</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isSuperAdmin ? 'Admin Management' : 'Admin Dashboard'}
        </Text>
        {isSuperAdmin && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateAdmin')}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Admin</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search admins..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{admins.length}</Text>
          <Text style={styles.summaryLabel}>Total Admins</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#10B981' }]}>
            {admins.filter(a => a.status === 'active').length}
          </Text>
          <Text style={styles.summaryLabel}>Active</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>
            {admins.reduce((sum, admin) => sum + admin.boothBoysCreated, 0)}
          </Text>
          <Text style={styles.summaryLabel}>Booth Boys</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
            {admins.reduce((sum, admin) => sum + admin.totalBooths, 0)}
          </Text>
          <Text style={styles.summaryLabel}>Total Booths</Text>
        </View>
      </View>

      <FlatList
        data={filteredAdmins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <AdminCard admin={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={showActionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.actionModal}>
            <Text style={styles.modalTitle}>Admin Actions</Text>
            
            <TouchableOpacity
              style={styles.modalAction}
              onPress={() => {
                setShowActionModal(false);
                navigation.navigate('AdminDetails', { admin: selectedAdmin });
              }}
            >
              <Eye size={20} color="#3B82F6" />
              <Text style={styles.modalActionText}>View Details</Text>
            </TouchableOpacity>

            {isSuperAdmin && (
              <>
                <TouchableOpacity
                  style={styles.modalAction}
                  onPress={() => toggleAdminStatus(selectedAdmin?.id)}
                >
                  <Shield size={20} color={getStatusColor(selectedAdmin?.status === 'active' ? 'inactive' : 'active')} />
                  <Text style={styles.modalActionText}>
                    {selectedAdmin?.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalAction}
                  onPress={() => deleteAdmin(selectedAdmin?.id)}
                >
                  <Trash2 size={20} color="#EF4444" />
                  <Text style={[styles.modalActionText, { color: '#EF4444' }]}>Delete Admin</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowActionModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter Admins</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.filterOptions}>
              {['all', 'active', 'inactive'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    statusFilter === status && styles.selectedFilterOption
                  ]}
                  onPress={() => {
                    setStatusFilter(status);
                    applyFilters(searchQuery, status);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    statusFilter === status && styles.selectedFilterText
                  ]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.applyFilterButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyFilterText}>Apply Filters</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
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
    fontSize: 20,
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
  adminCard: {
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
  adminInfo: {
    flex: 1,
  },
  adminNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  adminName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  adminConstituency: {
    fontSize: 14,
    color: '#6B7280',
  },
  moreButton: {
    padding: 4,
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    fontSize: 14,
    fontWeight: '500',
  },
  lastActive: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  viewButton: {
    backgroundColor: '#EBF4FF',
  },
  editButton: {
    backgroundColor: '#ECFDF5',
  },
  assignButton: {
    backgroundColor: '#FFFBEB',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalActionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  modalCancel: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedFilterOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedFilterText: {
    color: '#FFFFFF',
  },
  applyFilterButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyFilterText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AdminManagementScreen;