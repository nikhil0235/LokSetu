import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { 
  DashboardHeader,
  StatsRow,
  QuickActions,
  HorizontalScrollCards, 
  DemographicsCard, 
  ElectionResultsCard,
  AppIcon,
  VoterEditModal
} from '../../components/common';
import VoterListScreen from './VoterListScreen';
import VoterDataForm from './VoterDataForm';
import FilterModal from './components/FilterModal';

import { logout } from '../../store/authSlice';


const BoothBoyDashboard = ({ boothBoyInfo, onMenuPress }) => {
  const dispatch = useDispatch();
  const [showVoterList, setShowVoterList] = useState(false);
  const [showVoterDataForm, setShowVoterDataForm] = useState(false);
  const [showVoterEditModal, setShowVoterEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedVoterForEdit, setSelectedVoterForEdit] = useState(null);
  const [voterStats, setVoterStats] = useState({
    total: 2847,
    completed: 1923,
    pending: 924,
    male: 1456,
    female: 1341,
    others: 50,
  });

  // Mock data for new dashboard sections
  const partyWiseData = [
    { name: 'BJP', count: 1205, percentage: 42.3, color: '#FF6B35' },
    { name: 'RJD', count: 968, percentage: 34.0, color: '#00A86B' },
    { name: 'JDU', count: 412, percentage: 14.5, color: '#4169E1' },
    { name: 'Congress', count: 156, percentage: 5.5, color: '#19CDFF' },
    { name: 'Others', count: 106, percentage: 3.7, color: '#9CA3AF' },
  ];

  const demographicsData = {
    gender: { male: voterStats.male, female: voterStats.female, others: voterStats.others },
    age: { '18-35': 1227, '36-55': 1170, '56+': 450 },
    caste: { General: 1205, OBC: 968, SC: 412, ST: 156, Others: 106 }
  };

  const votingFamilies = [
    { familyName: 'Kumar Family', members: 8, voters: 6, influence: 'High' },
    { familyName: 'Singh Family', members: 12, voters: 9, influence: 'Very High' },
    { familyName: 'Sharma Family', members: 6, voters: 4, influence: 'Medium' },
    { familyName: 'Yadav Family', members: 10, voters: 7, influence: 'High' },
    { familyName: 'Prasad Family', members: 5, voters: 3, influence: 'Medium' },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const handlePartyCardPress = (party) => {
    if (party.parties) {
      // Alliance clicked - pass all parties in alliance
      setActiveFilters({ type: 'alliance', value: party.name, parties: party.parties });
    } else {
      // Individual party clicked
      setActiveFilters({ type: 'party', value: party.name });
    }
    setShowVoterList(true);
  };

  const handleFamilyCardPress = (family) => {
    setActiveFilters({ type: 'family', value: family.familyName });
    setShowVoterList(true);
  };

  const handleDemographicPress = (type, value) => {
    setActiveFilters({ type: type, value: value });
    setShowVoterList(true);
  };

  const [performanceData, setPerformanceData] = useState({
    todayUpdates: 47,
    weeklyUpdates: 320,
    dataCompleteness: 89,
    lastSyncTime: new Date(),
    boothCoverage: 95,
    voterContactRate: 78,
    issuesReported: 3,
    pendingVerifications: 24
  });

  const boothBoyData = useMemo(() => ({
    id: 'BB001',
    name: 'राम कुमार',
    phone: '<phone_number>',
    assignedBooths: ['B001'],
    constituency: 'Constituency-1',
    area: 'North Zone',
    totalVoters: 2847,
    role: 'booth_volunteer',
    ...boothBoyInfo
  }), [boothBoyInfo]);



  // Top row stats: Total, Completed, Pending
  const topRowStats = useMemo(() => [
    {
      title: 'Total Voters',
      value: voterStats.total,
      icon: 'group',
      color: '#3B82F6',
      onPress: () => {
        setActiveFilters({ type: 'all', value: 'all' });
        setShowVoterList(true);
      }
    },
    {
      title: 'Completed',
      value: voterStats.completed,
      icon: 'check-circle',
      color: '#10B981',
      onPress: () => {
        setActiveFilters({ type: 'status', value: 'completed' });
        setShowVoterList(true);
      }
    },
    {
      title: 'Pending',
      value: voterStats.pending,
      icon: 'schedule',
      color: '#F59E0B',
      onPress: () => {
        setActiveFilters({ type: 'status', value: 'pending' });
        setShowVoterList(true);
      }
    }
  ], [voterStats]);

  // Quick actions
  const quickActions = useMemo(() => [
    {
      title: 'Collect Data',
      icon: 'add-circle',
      color: '#10B981',
      onPress: () => handleNavigation('voterDataForm')
    },
    {
      title: 'Sync Data',
      icon: 'sync',
      color: '#3B82F6',
      onPress: () => {
        setPerformanceData(prev => ({ ...prev, lastSyncTime: new Date() }));
        Alert.alert('Sync Complete', 'Data synchronized successfully!');
      }
    }
  ], []);



  const applyFilters = (filters) => {
    setActiveFilters(filters);
    setShowFilterModal(false);
    setShowVoterList(true);
  };

  const handleNavigation = (screen, params = null) => {
    switch (screen) {
      case 'voterList':
        setActiveFilters({});
        setShowVoterList(true);
        break;
      case 'voterDataForm':
        setSelectedVoterForEdit(null);
        setShowVoterDataForm(true);
        break;
      case 'profile':
        Alert.alert('Profile', 'Profile screen not implemented yet');
        break;
      case 'syncData':
        Alert.alert('Sync', 'Data sync not implemented yet');
        break;
      default:
        console.log('Unknown navigation:', screen);
    }
  };

  const handleEditVoter = (voter) => {
    setSelectedVoterForEdit(voter);
    setShowVoterEditModal(true);
  };

  const handleSaveVoterData = (voterData) => {
    // Here you would typically call the API to save voter data
    console.log('Voter data saved:', voterData);
    setShowVoterEditModal(false);
    setSelectedVoterForEdit(null);
    // Update voter stats or refresh data as needed
  };



  if (showVoterDataForm) {
    return (
      <VoterDataForm
        epicId={selectedVoterForEdit?.epic_id}
        initialData={selectedVoterForEdit}
        onBack={() => {
          setShowVoterDataForm(false);
          setSelectedVoterForEdit(null);
        }}
        onSave={handleSaveVoterData}
      />
    );
  }

  if (showVoterList) {
    return (
      <>
        <VoterListScreen
          filters={activeFilters}
          boothBoyInfo={boothBoyData}
          onBack={() => setShowVoterList(false)}
          onMenuPress={onMenuPress}
          onEditVoter={handleEditVoter}
        />
        <VoterEditModal
          visible={showVoterEditModal}
          voter={selectedVoterForEdit}
          onClose={() => {
            setShowVoterEditModal(false);
            setSelectedVoterForEdit(null);
          }}
          onSave={handleSaveVoterData}
        />
      </>
    );
  }

  const CustomDashboardContent = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <StatsRow stats={topRowStats} title="Booth Overview" />
      
      <View style={styles.cardSpacing}>
        <HorizontalScrollCards
          title="Party-wise Voters"
          data={partyWiseData}
          cardStyle="party"
          onCardPress={handlePartyCardPress}
          showTabs={true}
        />
      </View>

      <View style={styles.demographicsSpacing}>
        <DemographicsCard
          genderData={demographicsData.gender}
          ageData={demographicsData.age}
          casteData={demographicsData.caste}
          onDemographicPress={handleDemographicPress}
        />
      </View>

      <View style={styles.cardSpacing}>
        <HorizontalScrollCards
          title="Influential Voting Families"
          data={votingFamilies}
          cardStyle="family"
          onCardPress={handleFamilyCardPress}
        />
      </View>

      <View style={styles.cardSpacing}>
        <ElectionResultsCard />
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1 }}>
      <DashboardHeader
        title={boothBoyData.name}
        subtitle={`Booth: ${boothBoyData.assignedBooths.join(', ')} • ${boothBoyData.constituency}`}
        onMenuPress={onMenuPress}
        onLogout={handleLogout}
        showLogout={true}
      />

      <CustomDashboardContent />

      <FilterModal
        visible={showFilterModal}
        filterType={activeFilters.type}
        onClose={() => setShowFilterModal(false)}
        onApply={applyFilters}
      />

      <VoterEditModal
        visible={showVoterEditModal}
        voter={selectedVoterForEdit}
        onClose={() => {
          setShowVoterEditModal(false);
          setSelectedVoterForEdit(null);
        }}
        onSave={handleSaveVoterData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  sectionContainer: {
    marginTop: 16,
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  cardSpacing: {
    marginBottom: 4,
  },
  demographicsSpacing: {
    marginBottom: 4,
  },

});

export default BoothBoyDashboard;