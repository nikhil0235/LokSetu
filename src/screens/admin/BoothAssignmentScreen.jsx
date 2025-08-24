import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { boothService } from '../../services/api/booth.service';
const icons = {
  MapPin: '📍',
  Users: '👥',
  Search: '🔍',
  Check: '✓',
  X: '✖️',
  ArrowRight: '➡️',
};

const BoothAssignmentScreen = ({ onBack }) => {
  const { token } = useSelector(state => state.auth);
  const [boothBoys, setBoothBoys] = useState([]);
  const [booths, setBooths] = useState([]);
  const [filteredBooths, setFilteredBooths] = useState([]);
  const [selectedBoothBoy, setSelectedBoothBoy] = useState(null);
  const [selectedBooths, setSelectedBooths] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load data from API
  const loadData = async () => {
    setLoading(true);
    try {
      const [boothBoysData, boothsData] = await Promise.all([
        boothService.getBoothBoys(token),
        boothService.getBooths(token, {
          state_id: 'S04',
          district_id: 'S0429',
          assembly_id: '195'
        })
      ]);
      
      // Transform booth boys data
      const transformedBoothBoys = boothBoysData.map(user => ({
        id: user.UserID || user.user_id,
        name: user.FullName || user.full_name || user.Username,
        phone: user.Phone || user.phone,
        assignedBooths: user.AssignedBoothIDs ? user.AssignedBoothIDs.split(',').filter(id => id).length : 0,
        maxBooths: 5, // Default max booths
        area: 'General', // Default area
        status: 'active',
        assignedBoothIds: user.AssignedBoothIDs ? user.AssignedBoothIDs.split(',').filter(id => id) : []
      }));
      
      // Transform booths data
      const transformedBooths = Array.isArray(boothsData) ? boothsData.map(booth => ({
        id: booth.partId,
        boothNumber: booth.partNumber,
        boothName: booth.partName,
        area: 'General',
        address: booth.partName,
        totalVoters: 0, // Not available in current API
        assignedTo: null,
        assignedToName: null,
        status: 'unassigned'
      })) : [];
      
      // Check which booths are assigned
      transformedBooths.forEach(booth => {
        const assignedBoothBoy = transformedBoothBoys.find(bb => 
          bb.assignedBoothIds.includes(booth.id.toString())
        );
        if (assignedBoothBoy) {
          booth.assignedTo = assignedBoothBoy.id;
          booth.assignedToName = assignedBoothBoy.name;
          booth.status = 'assigned';
        }
      });
      
      setBoothBoys(transformedBoothBoys);
      setBooths(transformedBooths);
      setFilteredBooths(transformedBooths);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = booths;

    if (searchQuery.trim()) {
      filtered = filtered.filter(booth =>
        booth.boothName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booth.boothNumber.includes(searchQuery) ||
        booth.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterArea !== 'all') {
      filtered = filtered.filter(booth => booth.area === filterArea);
    }

    setFilteredBooths(filtered);
  }, [searchQuery, filterArea, booths]);

  const areas = ['all', 'North Zone', 'South Zone', 'East Zone', 'West Zone'];

  const handleBoothSelection = (booth) => {
    if (booth.status === 'assigned') return;
    
    const isSelected = selectedBooths.some(b => b.id === booth.id);
    if (isSelected) {
      setSelectedBooths(selectedBooths.filter(b => b.id !== booth.id));
    } else {
      setSelectedBooths([...selectedBooths, booth]);
    }
  };

  const handleAssignment = async () => {
    if (!selectedBoothBoy || selectedBooths.length === 0) {
      Alert.alert('Selection Required', 'Please select a booth boy and at least one booth.');
      return;
    }

    const boothBoy = boothBoys.find(bb => bb.id === selectedBoothBoy);
    const totalAfterAssignment = boothBoy.assignedBooths + selectedBooths.length;
    
    if (totalAfterAssignment > boothBoy.maxBooths) {
      Alert.alert(
        'Assignment Limit Exceeded',
        `${boothBoy.name} can only handle ${boothBoy.maxBooths} booths. Currently has ${boothBoy.assignedBooths} assigned.`
      );
      return;
    }

    setIsAssigning(true);
    
    try {
      // Get current assigned booth IDs and add new ones
      const currentBoothIds = boothBoy.assignedBoothIds || [];
      const newBoothIds = selectedBooths.map(booth => booth.id.toString());
      const allBoothIds = [...currentBoothIds, ...newBoothIds];
      
      // Call API to assign booths
      await boothService.assignBooths(token, selectedBoothBoy, allBoothIds);
      
      // Reload data to reflect changes
      await loadData();
      
      setSelectedBooths([]);
      setSelectedBoothBoy(null);
      setShowAssignModal(false);
      
      Alert.alert(
        'Assignment Successful',
        `Successfully assigned ${selectedBooths.length} booths to ${boothBoy.name}.`
      );
    } catch (error) {
      console.error('Assignment error:', error);
      Alert.alert('Error', error.message || 'Failed to assign booths. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  const BoothBoyCard = ({ boothBoy }) => {
    const utilizationPercentage = (boothBoy.assignedBooths / boothBoy.maxBooths) * 100;
    const isSelected = selectedBoothBoy === boothBoy.id;
    
    return (
      <TouchableOpacity
        style={[styles.boothBoyCard, isSelected && styles.selectedBoothBoyCard]}
        onPress={() => setSelectedBoothBoy(isSelected ? null : boothBoy.id)}
      >
        <View style={styles.boothBoyHeader}>
          <View style={styles.boothBoyInfo}>
            <Text style={styles.boothBoyName}>{boothBoy.name}</Text>
            <Text style={styles.boothBoyArea}>{boothBoy.area}</Text>
          </View>
          {isSelected && <Text style={[styles.iconText, { color: '#10B981' }]}>{icons.Check}</Text>}
        </View>
        
        <View style={styles.boothBoyStats}>
          <Text style={styles.assignmentText}>
            {boothBoy.assignedBooths} / {boothBoy.maxBooths} booths assigned
          </Text>
          <View style={styles.utilizationBar}>
            <View 
              style={[
                styles.utilizationFill, 
                { 
                  width: `${utilizationPercentage}%`,
                  backgroundColor: utilizationPercentage > 80 ? '#EF4444' : 
                                   utilizationPercentage > 60 ? '#F59E0B' : '#10B981'
                }
              ]} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const BoothCard = ({ booth }) => {
    const isSelected = selectedBooths.some(b => b.id === booth.id);
    const isAssigned = booth.status === 'assigned';
    
    return (
      <TouchableOpacity
        style={[
          styles.boothCard,
          isSelected && styles.selectedBoothCard,
          isAssigned && styles.assignedBoothCard
        ]}
        onPress={() => handleBoothSelection(booth)}
        disabled={isAssigned}
      >
        <View style={styles.boothHeader}>
          <View style={styles.boothInfo}>
            <Text style={styles.boothNumber}>#{booth.boothNumber}</Text>
            <Text style={styles.boothName}>{booth.boothName}</Text>
          </View>
          <View style={styles.statusContainer}>
            {isAssigned && <Text style={styles.assignedLabel}>Assigned</Text>}
            {isSelected && !isAssigned && <Text style={[styles.iconText, { color: '#10B981' }]}>{icons.Check}</Text>}
          </View>
        </View>
        
        <Text style={styles.boothAddress}>{booth.address}</Text>
        <Text style={styles.boothArea}>{booth.area}</Text>
        
        <View style={styles.boothFooter}>
          <Text style={styles.voterCount}>{booth.totalVoters} voters</Text>
          {isAssigned && (
            <Text style={styles.assignedTo}>→ {booth.assignedToName}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const AssignmentModal = () => (
    <Modal
      visible={showAssignModal}
      transparent
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.assignmentModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Confirm Assignment</Text>
            <TouchableOpacity onPress={() => setShowAssignModal(false)}>
              <Text style={styles.iconText}>{icons.X}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.assignmentSummary}>
            <View style={styles.summarySection}>
              <Text style={styles.summaryLabel}>Booth Boy:</Text>
              <Text style={styles.summaryValue}>
                {boothBoys.find(bb => bb.id === selectedBoothBoy)?.name}
              </Text>
            </View>
            
            <View style={styles.summarySection}>
              <Text style={styles.summaryLabel}>Booths to Assign:</Text>
              <Text style={styles.summaryValue}>{selectedBooths.length} booths</Text>
            </View>
            
            <View style={styles.boothsList}>
              {selectedBooths.map(booth => (
                <Text key={booth.id} style={styles.boothListItem}>
                  • #{booth.boothNumber} - {booth.boothName}
                </Text>
              ))}
            </View>
          </View>
          
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAssignModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, isAssigning && styles.assigningButton]}
              onPress={handleAssignment}
              disabled={isAssigning}
            >
              <Text style={styles.confirmButtonText}>
                {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.iconText}>{icons.X}</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Booth Assignment</Text>
            <Text style={styles.headerSubtitle}>Assign booths to booth boys</Text>
          </View>
        </View>

      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading booth assignment data...</Text>
          </View>
        ) : (
          <>
            {/* Booth Boy Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Booth Boy</Text>
              <FlatList
                data={boothBoys}
                renderItem={({ item }) => <BoothBoyCard boothBoy={item} />}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            </View>

        {/* Search and Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Booths</Text>
          
          <View style={styles.filterContainer}>
            <View style={styles.searchContainer}>
              <Text style={styles.iconText}>{icons.Search}</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search booths..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <View style={styles.areaFilter}>
              <Picker
                selectedValue={filterArea}
                onValueChange={setFilterArea}
                style={styles.picker}
              >
                <Picker.Item label="All Areas" value="all" />
                {areas.slice(1).map(area => (
                  <Picker.Item key={area} label={area} value={area} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Booth List */}
        <View style={styles.section}>
          <FlatList
            data={filteredBooths}
            renderItem={({ item }) => <BoothCard booth={item} />}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={[styles.iconText, { fontSize: 48, color: '#D1D5DB' }]}>{icons.MapPin}</Text>
                <Text style={styles.emptyTitle}>No Booths Found</Text>
                <Text style={styles.emptyText}>
                  {searchQuery || filterArea !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No booths available'
                  }
                </Text>
              </View>
            )}
          />
        </View>
          </>
        )}
      </ScrollView>

      {/* Assignment Button */}
      {selectedBoothBoy && selectedBooths.length > 0 && (
        <View style={styles.assignmentBar}>
          <Text style={styles.selectionText}>
            {selectedBooths.length} booth{selectedBooths.length > 1 ? 's' : ''} selected
          </Text>
          <TouchableOpacity
            style={styles.assignButton}
            onPress={() => setShowAssignModal(true)}
          >
            <Text style={[styles.iconText, { color: '#FFFFFF' }]}>{icons.ArrowRight}</Text>
            <Text style={styles.assignButtonText}>Assign Booths</Text>
          </TouchableOpacity>
        </View>
      )}

      <AssignmentModal />
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
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
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
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  horizontalList: {
    paddingRight: 20,
  },
  boothBoyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 200,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedBoothBoyCard: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  boothBoyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  boothBoyInfo: {
    flex: 1,
  },
  boothBoyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  boothBoyArea: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  boothBoyStats: {
    marginTop: 8,
  },
  assignmentText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  utilizationBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  utilizationFill: {
    height: 4,
    borderRadius: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  areaFilter: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    minWidth: 120,
  },
  picker: {
    height: 40,
  },
  boothCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedBoothCard: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  assignedBoothCard: {
    opacity: 0.6,
    backgroundColor: '#F3F4F6',
  },
  boothHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  boothInfo: {
    flex: 1,
  },
  boothNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  boothName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  assignedLabel: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  boothAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  boothArea: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  boothFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voterCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  assignedTo: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  assignmentBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  selectionText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  assignButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignmentModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    minWidth: 300,
    maxWidth: '90%',
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
  assignmentSummary: {
    marginBottom: 24,
  },
  summarySection: {
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  boothsList: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  boothListItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  assigningButton: {
    backgroundColor: '#9CA3AF',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default BoothAssignmentScreen;