import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadDashboardData } from '../../store/slices/dashboardSlice';
import { AppIcon, BackButton } from '../../components/common';

const ConstituencyVotersScreen = ({ onBack, onLogout, assemblyNo, constituencyName }) => {
  const dispatch = useDispatch();
  const { voters } = useSelector(state => state.dashboard);
  const [refreshing, setRefreshing] = useState(false);

  const constituencyVoters = useMemo(() => {
    console.log('Filtering voters for assembly no:', assemblyNo);
    console.log('Available voters:', voters.length);
    const filtered = voters.filter(voter => voter.ConstituencyID === assemblyNo);
    console.log('Filtered voters:', filtered.length);
    return filtered;
  }, [voters, assemblyNo]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(loadDashboardData(true)).unwrap();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
    setRefreshing(false);
  };

  const VoterCard = ({ voter }) => (
    <View style={styles.voterCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{voter.Voter_fName} {voter.Voter_lName}</Text>
          <Text style={styles.userRole}>EPIC: {voter.VoterEPIC}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.genderAge}>{voter.Gender}, {voter.Age}y</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mobile:</Text>
          <Text style={styles.infoValue}>{voter.Mobile}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Booth:</Text>
          <Text style={styles.infoValue}>{voter.BoothID}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Preference:</Text>
          <Text style={[styles.infoValue, { color: '#3B82F6', fontWeight: 'bold' }]}>{voter.VotingPreference}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{constituencyName}</Text>
          <Text style={styles.headerSubtitle}>Constituency Voters</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Voters</Text>
        <Text style={styles.summaryCount}>{constituencyVoters.length}</Text>
        <Text style={styles.summarySubtitle}>In this constituency</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {constituencyVoters.length > 0 ? (
          constituencyVoters.map((voter, index) => (
            <VoterCard key={voter.VoterEPIC || index} voter={voter} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <AppIcon name="how-to-vote" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Voters Found</Text>
            <Text style={styles.emptySubtitle}>No voters found in this constituency.</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    color: '#3B82F6',
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
  voterCard: {
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
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  genderAge: {
    fontSize: 12,
    color: '#6B7280',
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

export default ConstituencyVotersScreen;