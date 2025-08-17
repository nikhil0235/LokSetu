import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import VoterListScreen from './VoterListScreen';
import FilterModal from './components/FilterModal';
import BoothBoyProfile from './components/BoothBoyProfile';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BoothBoyDashboard = ({ boothBoyInfo, onLogout, onMenuPress }) => {
  const [showVoterList, setShowVoterList] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [voterStats, setVoterStats] = useState({
    total: 2847,
    verified: 1923,
    unverified: 924,
    male: 1456,
    female: 1341,
    thirdGender: 50,
  });

  const defaultBoothBoyInfo = {
    id: 'BB001',
    name: 'राम कुमार',
    phone: '+91 9876543210',
    assignedBooths: ['B001', 'B002', 'B003'],
    constituency: 'Constituency-1',
    area: 'North Zone',
    totalVoters: 2847,
    ...boothBoyInfo
  };

  const filterOptions = [
    { id: 'booth', title: 'Booth Wise', iconName: 'location-on', color: '#3B82F6' },
    { id: 'address', title: 'Address Wise', iconName: 'home', color: '#10B981' },
    { id: 'age', title: 'Age Wise', iconName: 'cake', color: '#F59E0B' },
    { id: 'caste', title: 'Caste Wise', iconName: 'group', color: '#8B5CF6' },
    { id: 'verification', title: 'Verification Status', iconName: 'verified', color: '#EF4444' },
    { id: 'gender', title: 'Gender Wise', iconName: 'person', color: '#EC4899' }
  ];

  const handleFilterSelect = (filterId) => {
    setActiveFilters({ type: filterId });
    setShowFilterModal(true);
  };

  const applyFilters = (filters) => {
    setActiveFilters(filters);
    setShowFilterModal(false);
    setShowVoterList(true);
  };

  if (showVoterList) {
    return (
      <VoterListScreen
        filters={activeFilters}
        boothBoyInfo={defaultBoothBoyInfo}
        onBack={() => setShowVoterList(false)}
        onLogout={onLogout}
        onMenuPress={onMenuPress}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
            <Icon name="menu" size={28} color="#374151" />
          </TouchableOpacity>
          <View style={styles.profilePic}>
            <Text style={styles.profileText}>{defaultBoothBoyInfo.name.charAt(0)}</Text>
          </View>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{defaultBoothBoyInfo.name}</Text>
          <Text style={styles.headerSubtitle}>Booth Boy Dashboard - {defaultBoothBoyInfo.constituency}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <View style={styles.logoutIconContainer}>
            <Icon name="power-settings-new" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <BoothBoyProfile boothBoyInfo={defaultBoothBoyInfo} />

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Voter Statistics</Text>
          <View style={styles.statsGrid}>
            {Object.entries(voterStats).map(([key, value]) => (
              <View key={key} style={styles.statCard}>
                <Text style={styles.statValue}>{value.toLocaleString()}</Text>
                <Text style={styles.statTitle}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Filter Voters</Text>
          <View style={styles.filtersGrid}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.filterCard, { borderColor: option.color + '30' }]}
                onPress={() => handleFilterSelect(option.id)}
              >
                <View style={[styles.filterIcon, { backgroundColor: option.color + '20' }]}>
                  <Icon name={option.iconName} size={20} color={option.color} />
                </View>
                <Text style={styles.filterTitle}>{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.allVotersButton}
          onPress={() => {
            setActiveFilters({});
            setShowVoterList(true);
          }}
        >
          <Text style={styles.allVotersButtonText}>View All Voters</Text>
        </TouchableOpacity>
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        filterType={activeFilters.type}
        onClose={() => setShowFilterModal(false)}
        onApply={applyFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  menuButton: { marginRight: 10 },

  profilePic: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  profileText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1F2937', letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2, fontWeight: '500' },
  logoutButton: { padding: 4 },
  logoutIconContainer: { backgroundColor: '#EF4444', borderRadius: 20, padding: 8, shadowColor: '#EF4444', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 15 },
  statsSection: { marginBottom: 30 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, width: '48%', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  statTitle: { fontSize: 14, color: '#6B7280', marginTop: 5 },
  filtersSection: { marginBottom: 30 },
  filtersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  filterCard: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, width: '48%', marginBottom: 15, borderWidth: 1, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  filterIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },

  filterTitle: { fontSize: 14, fontWeight: '600', color: '#111827', textAlign: 'center' },
  allVotersButton: { backgroundColor: '#3B82F6', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  allVotersButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default BoothBoyDashboard;