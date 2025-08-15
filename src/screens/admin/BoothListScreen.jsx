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
  MapPin,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
} from 'lucide-react-native';

const BoothBoyListScreen = ({ navigation }) => {
  const [boothBoys, setBoothBoys] = useState([]);
  const [filteredBoothBoys, setFilteredBoothBoys] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBoothBoy, setSelectedBoothBoy] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Mock data
  const mockBoothBoys = [
    {
      id: 1,
      name: 'Suresh Patel',
      email: 'suresh.patel@email.com',
      phone: '+91-9876543210',
      address: 'Sector 15, Phase 1, Bengaluru',
      assignedBooths: 3,
      maxBooths: 5,
      completedVoters: 2847,
      totalVoters: 3245,
      progress: 87.7,
      status: 'active',
      lastActive: '2h ago',
      joinedDate: '2024-01-15',
      area: 'North Zone',
    },
    {
      id: 2,
      name: 'Meera Joshi',
      email: 'meera.joshi@email.com',
      phone: '+91-9876543211',
      address: 'Sector 22, Phase 2, Bengaluru',
      assignedBooths: 2,
      maxBooths: 4,
      completedVoters: 2156,
      totalVoters: 2340,
      progress: 92.1,
      status: 'active',
      lastActive: '1h ago',
      joinedDate: '2024-01-18',
      area: 'South Zone',
    },
    {
      id: 3,
      name: 'Ravi Kumar',
      email: 'ravi.kumar@email.com',
      phone: '+91-9876543212',
      address: 'Sector 8, Phase 3, Bengaluru',
      assignedBooths: 4,
      maxBooths: 6,
      completedVoters: 3421,
      totalVoters: 5112,
      progress: 66.9,
      status: 'active',
      lastActive: '5h ago',
      joinedDate: '2024-01-20',
      area: 'East Zone',
    },
    {
      id: 4,
      name: 'Anita Singh',
      email: 'anita.singh@email.com',
      phone: '+91-9876543213',
      address: 'Sector 12, Phase 2, Bengaluru',
      assignedBooths: 2,
      maxBooths: 3,
      completedVoters: 2890,
      totalVoters: 3045,
      progress: 94.9,
      status: 'inactive',
      lastActive: '2d ago',
      joinedDate: '2024-01-22',
      area: 'West Zone',
    },
    {
      id: 5,
      name: 'Prakash Sharma',
      email: 'prakash.sharma@email.com',
      phone: '+91-9876543214',
      address: 'Sector 25, Phase 1, Bengaluru',
      assignedBooths: 1,
      maxBooths: 2,
      completedVoters: 756,
      totalVoters: 1234,
      progress: 61.3,
      status: 'active',
      lastActive: '30m ago',
      joinedDate: '2024-01-25',
      area: 'Central Zone',
    },
  ];

  useEffect(() => {
    setBoothBoys(mockBoothBoys);
    setFilteredBoothBoys(mockBoothBoys);
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    applyFilters(text, statusFilter);
  };

  const applyFilters = (searchText, status) => {
    let filtered = boothBoys;

    if (searchText.trim()) {
      filtered = filtered.filter(bb =>
        bb.name.toLowerCase().includes(searchText.toLowerCase()) ||
        bb.email.toLowerCase().includes(searchText.toLowerCase()) ||
        bb.phone.includes(searchText) ||
        bb.area.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(bb => bb.status === status);
    }

    setFilteredBoothBoys(filtered);
  };

  const toggleBoothBoyStatus = (boothBoyId) => {
    const updatedBoothBoys = boothBoys.map(bb => {
      if (bb.id === boothBoyId) {
        return {
          ...bb,
          status: bb.status === 'active' ? 'inactive' : 'active'
        };
      }
      return bb;
    });
    
    setBoothBoys(updatedBoothBoys);
    applyFilters(searchQuery, statusFilter);
    setShowActionModal(false);
    
    const boothBoy = updatedBoothBoys.find(bb => bb.id === boothBoyId);
    Alert.alert(
      'Status Updated', 
      `${boothBoy.name} has been ${boothBoy.status === 'active' ? 'activated' : 'deactivated'}.`
    );
  };

  const deleteBoothBoy = (boothBoyId) => {
    Alert.alert(
      'Delete Booth Boy',
      'Are you sure you want to delete this booth boy? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedBoothBoys = boothBoys.filter(bb => bb.id !== boothBoyId);
            setBoothBoys(updatedBoothBoys);
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

  const BoothBoyCard = ({ boothBoy }) => (
    <View style={styles.boothBoyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.boothBoyInfo}>
          <Text style={styles.boothBoyName}>{boothBoy.name}</Text>
          <Text style={styles.boothBoyArea}>{boothBoy.area}</Text>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            setSelectedBoothBoy(boothBoy);
            setShowActionModal(true);
          }}
        >
          <MoreVertical size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.contactRow}>
          <Mail size={14} color="#6B7280" />
          <Text style={styles.contactText}>{boothBoy.email}</Text>
        </View>
        <View style={styles.contactRow}>
          <Phone size={14} color="#6B7280" />
          <Text style={styles.contactText}>{boothBoy.phone}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{boothBoy.assignedBooths}</Text>
          <Text style={styles.statLabel}>Booths</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{boothBoy.completedVoters}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: getProgressColor(boothBoy.progress) }]}>
            {boothBoy.progress.toFixed(1)}%
          </Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${boothBoy.progress}%`,
                backgroundColor: getProgressColor(boothBoy.progress)
              }
            ]} 
          />
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(boothBoy.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(boothBoy.status) }]}>
            {boothBoy.status.charAt(0).toUpperCase() + boothBoy.status.slice(1)}
          </Text>
        </View>
        <Text style={styles.lastActive}>Last active: {boothBoy.lastActive}</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => navigation.navigate('BoothBoyDetails', { boothBoy })}
        >
          <Eye size={14} color="#3B82F6" />
          <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditBoothBoy', { boothBoy })}
        >
          <Edit size={14} color="#10B981" />
          <Text style={[styles.actionButtonText, { color: '#10B981' }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.assignButton]}
          onPress={() => navigation.navigate('BoothAssignment', { selectedBoothBoy: boothBoy.id })}
        >
          <MapPin size={14} color="#F59E0B" />
          <Text style={[styles.actionButtonText, { color: '#F59E0B' }]}>Assign</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ActionModal = () => (
    <Modal
      visible={showActionModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowActionModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowActionModal(false)}
      >
        <TouchableOpacity 
          style={styles.actionModal}
          activeOpacity={1}
          onPress={() => {}}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Booth Boy Actions</Text>
            <Text style={styles.modalSubtitle}>{selectedBoothBoy?.name}</Text>
          </View>

          <TouchableOpacity
            style={styles.modalAction}
            onPress={() => {
              setShowActionModal(false);
              navigation.navigate('BoothBoyDetails', { boothBoy: selectedBoothBoy });
            }}
          >
            <Eye size={20} color="#3B82F6" />
            <Text style={[styles.modalActionText, { color: '#3B82F6' }]}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalAction}
            onPress={() => {
              setShowActionModal(false);
              navigation.navigate('EditBoothBoy', { boothBoy: selectedBoothBoy });
            }}
          >
            <Edit size={20} color="#10B981" />
            <Text style={[styles.modalActionText, { color: '#10B981' }]}>Edit Booth Boy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalAction}
            onPress={() => {
              setShowActionModal(false);
              navigation.navigate('BoothAssignment', { selectedBoothBoy: selectedBoothBoy?.id });
            }}
          >
            <MapPin size={20} color="#F59E0B" />
            <Text style={[styles.modalActionText, { color: '#F59E0B' }]}>Assign Booths</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalAction}
            onPress={() => toggleBoothBoyStatus(selectedBoothBoy?.id)}
          >
            {selectedBoothBoy?.status === 'active' ? (
              <>
                <UserX size={20} color="#EF4444" />
                <Text style={[styles.modalActionText, { color: '#EF4444' }]}>Deactivate</Text>
              </>
            ) : (
              <>
                <UserCheck size={20} color="#10B981" />
                <Text style={[styles.modalActionText, { color: '#10B981' }]}>Activate</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalAction}
            onPress={() => deleteBoothBoy(selectedBoothBoy?.id)}
          >
            <Trash2 size={20} color="#EF4444" />
            <Text style={[styles.modalActionText, { color: '#EF4444' }]}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCancel}
            onPress={() => setShowActionModal(false)}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowFilterModal(false)}
      >
        <TouchableOpacity 
          style={styles.filterModal}
          activeOpacity={1}
          onPress={() => {}}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Options</Text>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.filterOptions}>
              {[
                { label: 'All', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ].map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterOption,
                    statusFilter === option.value && styles.selectedFilterOption
                  ]}
                  onPress={() => setStatusFilter(option.value)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    statusFilter === option.value && styles.selectedFilterOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setStatusFilter('all');
                applyFilters(searchQuery, 'all');
              }}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                applyFilters(searchQuery, statusFilter);
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booth Boys</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateBoothBoy')}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search booth boys..."
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

      {/* Stats Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{boothBoys.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {boothBoys.filter(bb => bb.status === 'active').length}
          </Text>
          <Text style={styles.summaryLabel}>Active</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {boothBoys.reduce((sum, bb) => sum + bb.assignedBooths, 0)}
          </Text>
          <Text style={styles.summaryLabel}>Booths</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {boothBoys.length > 0 ? Math.round(boothBoys.reduce((sum, bb) => sum + bb.progress, 0) / boothBoys.length) : 0}%
          </Text>
          <Text style={styles.summaryLabel}>Avg Progress</Text>
        </View>
      </View>

      {/* Booth Boys List */}
      <FlatList
        data={filteredBoothBoys}
        renderItem={({ item }) => <BoothBoyCard boothBoy={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          filteredBoothBoys.length === 0 && { flex: 1, justifyContent: 'center' }
        ]}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <User size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Booth Boys Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by creating your first booth boy'
              }
            </Text>
          </View>
        )}
      />

      <ActionModal />
      <FilterModal />
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
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
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
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
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
  boothBoyCard: {
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
  boothBoyInfo: {
    flex: 1,
  },
  boothBoyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  boothBoyArea: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  contactInfo: {
    marginBottom: 12,
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
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: 12,
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
    marginBottom: 12,
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
    fontWeight: '600',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  viewButton: {
    backgroundColor: '#EFF6FF',
  },
  editButton: {
    backgroundColor: '#ECFDF5',
  },
  assignButton: {
    backgroundColor: '#FFFBEB',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  filterModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  modalAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  modalActionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedFilterOption: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedFilterOptionText: {
    color: '#FFFFFF',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default BoothBoyListScreen;