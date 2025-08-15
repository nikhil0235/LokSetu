import React, { useState, useEffect, useMemo } from 'react';
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
import VoterEditModal from './components/VoterEditModal';

const icons = {
  Search: '🔍',
  Edit: '✏️',
  Phone: '📱',
  User: '👤',
  Check: '✓',
  X: '✖️',
  Filter: '🔽',
};

const VoterListScreen = ({ filters, boothBoyInfo, onBack, onLogout }) => {
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  // Mock voter data
  const mockVoters = useMemo(() => [
    {
      epic_id: 'ABC1234567',
      name: 'राम कुमार सिंह',
      name_phonetic: 'Ram Kumar Singh',
      age: 45,
      gender: 'M',
      mobile: '9876543210',
      booth_id: 'B001',
      part_no: '001',
      area: 'Ward 1, Patna',
      caste: 'General',
      last_voted_party: 'BJP',
      voting_preference: 'BJP',
      certainty_of_vote: 'High',
      verification_status: 'Verified',
      house_number: '123A',
      guardian_name: 'श्याम सिंह',
    },
    {
      epic_id: 'DEF7890123',
      name: 'सीता देवी',
      name_phonetic: 'Sita Devi',
      age: 38,
      gender: 'F',
      mobile: '8765432109',
      booth_id: 'B002',
      part_no: '002',
      area: 'Ward 2, Patna',
      caste: 'OBC',
      last_voted_party: 'RJD',
      voting_preference: 'Undecided',
      certainty_of_vote: 'Medium',
      verification_status: 'Unverified',
      house_number: '456B',
      guardian_name: 'राम प्रसाद',
    },
    {
      epic_id: 'GHI4567890',
      name: 'अमित शर्मा',
      name_phonetic: 'Amit Sharma',
      age: 29,
      gender: 'M',
      mobile: '7654321098',
      booth_id: 'B001',
      part_no: '001',
      area: 'Ward 1, Patna',
      caste: 'General',
      last_voted_party: 'Congress',
      voting_preference: 'BJP',
      certainty_of_vote: 'Low',
      verification_status: 'Verified',
      house_number: '789C',
      guardian_name: 'विनोद शर्मा',
    }
  ], []);

  useEffect(() => {
    let filtered = [...mockVoters];
    
    // Apply filters
    if (filters.type === 'booth' && filters.value) {
      filtered = filtered.filter(voter => voter.booth_id === filters.value);
    }
    if (filters.type === 'age' && filters.value) {
      const [min, max] = filters.value.split('-').map(Number);
      filtered = filtered.filter(voter => voter.age >= min && voter.age <= max);
    }
    if (filters.type === 'caste' && filters.value) {
      filtered = filtered.filter(voter => voter.caste === filters.value);
    }
    if (filters.type === 'verification' && filters.value) {
      filtered = filtered.filter(voter => voter.verification_status === filters.value);
    }
    if (filters.type === 'gender' && filters.value) {
      filtered = filtered.filter(voter => voter.gender === filters.value);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(voter =>
        voter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voter.name_phonetic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voter.epic_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voter.mobile.includes(searchQuery)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name_phonetic.localeCompare(b.name_phonetic);
      if (sortBy === 'age') return a.age - b.age;
      if (sortBy === 'booth') return a.booth_id.localeCompare(b.booth_id);
      return 0;
    });

    setVoters(mockVoters);
    setFilteredVoters(filtered);
  }, [filters, searchQuery, sortBy]);

  const handleEditVoter = (voter) => {
    setSelectedVoter(voter);
    setShowEditModal(true);
  };

  const handleSaveVoter = (updatedVoter) => {
    const updatedVoters = voters.map(voter =>
      voter.epic_id === updatedVoter.epic_id ? updatedVoter : voter
    );
    setVoters(updatedVoters);
    setShowEditModal(false);
    Alert.alert('Success', 'Voter details updated successfully');
  };

  const getFilterTitle = () => {
    if (!filters.type) return 'All Voters';
    const titles = {
      booth: `Booth: ${filters.value || 'All'}`,
      age: `Age: ${filters.value || 'All'}`,
      caste: `Caste: ${filters.value || 'All'}`,
      verification: `Status: ${filters.value || 'All'}`,
      gender: `Gender: ${filters.value || 'All'}`,
      address: `Address: ${filters.value || 'All'}`
    };
    return titles[filters.type] || 'Filtered Voters';
  };

  const VoterCard = ({ voter }) => (
    <View style={styles.voterCard}>
      <View style={styles.voterHeader}>
        <View style={styles.voterInfo}>
          <Text style={styles.voterName}>{voter.name}</Text>
          <Text style={styles.voterNameEng}>{voter.name_phonetic}</Text>
          <Text style={styles.voterDetails}>
            {voter.epic_id} • Age: {voter.age} • {voter.gender === 'M' ? 'Male' : voter.gender === 'F' ? 'Female' : 'Other'}
          </Text>
        </View>
        <View style={styles.verificationBadge}>
          <Text style={[
            styles.verificationText,
            { color: voter.verification_status === 'Verified' ? '#10B981' : '#EF4444' }
          ]}>
            {voter.verification_status === 'Verified' ? icons.Check : icons.X}
          </Text>
        </View>
      </View>

      <View style={styles.voterMeta}>
        <Text style={styles.metaText}>📍 {voter.area}</Text>
        <Text style={styles.metaText}>🏠 {voter.house_number}</Text>
        <Text style={styles.metaText}>📊 Booth: {voter.booth_id}</Text>
      </View>

      <View style={styles.politicalInfo}>
        <Text style={styles.politicalLabel}>Last Voted: <Text style={styles.politicalValue}>{voter.last_voted_party}</Text></Text>
        <Text style={styles.politicalLabel}>Preference: <Text style={styles.politicalValue}>{voter.voting_preference}</Text></Text>
        <Text style={styles.politicalLabel}>Certainty: <Text style={styles.politicalValue}>{voter.certainty_of_vote}</Text></Text>
      </View>

      <View style={styles.voterActions}>
        {voter.mobile && (
          <Text style={styles.phoneText}>{icons.Phone} {voter.mobile}</Text>
        )}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditVoter(voter)}
        >
          <Text style={styles.editButtonText}>{icons.Edit} Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{getFilterTitle()}</Text>
          <Text style={styles.headerSubtitle}>{filteredVoters.length} voters</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>{icons.Search}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, EPIC ID, or mobile..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            const options = ['name', 'age', 'booth'];
            const currentIndex = options.indexOf(sortBy);
            setSortBy(options[(currentIndex + 1) % options.length]);
          }}
        >
          <Text style={styles.sortText}>{icons.Filter}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredVoters}
        keyExtractor={(item) => item.epic_id}
        renderItem={({ item }) => <VoterCard voter={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <VoterEditModal
        visible={showEditModal}
        voter={selectedVoter}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveVoter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { marginRight: 15 },
  backText: { fontSize: 16, color: '#3B82F6' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 14, color: '#6B7280' },
  logoutButton: { padding: 8 },
  logoutText: { fontSize: 18 },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 12 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 16, color: '#111827' },
  sortButton: { marginLeft: 10, padding: 10, backgroundColor: '#F3F4F6', borderRadius: 8 },
  sortText: { fontSize: 16 },
  listContainer: { padding: 20 },
  voterCard: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  voterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  voterInfo: { flex: 1 },
  voterName: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  voterNameEng: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  voterDetails: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  verificationBadge: { padding: 5 },
  verificationText: { fontSize: 16 },
  voterMeta: { marginBottom: 10 },
  metaText: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  politicalInfo: { marginBottom: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  politicalLabel: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  politicalValue: { fontWeight: '600', color: '#111827' },
  voterActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  phoneText: { fontSize: 12, color: '#3B82F6' },
  editButton: { backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  editButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});

export default VoterListScreen;