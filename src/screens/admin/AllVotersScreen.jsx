import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadDashboardData } from '../../store/slices/dashboardSlice';
import { AppIcon, BackButton } from '../../components/common';

const AllVotersScreen = ({ onBack, onLogout }) => {
  const dispatch = useDispatch();
  const { voters } = useSelector(state => state.dashboard);
  const [refreshing, setRefreshing] = useState(false);

  console.log('AllVotersScreen - Voters data:', voters);
  console.log('AllVotersScreen - First voter:', voters[0]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(loadDashboardData(true)).unwrap();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
    setRefreshing(false);
  };

  const VoterCard = ({ voter }) => {
    const [showAll, setShowAll] = useState(false);
    
    return (
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
            <Text style={styles.infoValue}>{voter.BoothID} - {voter.BoothLocation}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Constituency:</Text>
            <Text style={styles.infoValue}>{voter.ConstituencyName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Preference:</Text>
            <Text style={[styles.infoValue, { color: '#3B82F6', fontWeight: 'bold' }]}>{voter.VotingPreference}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Voted:</Text>
            <Text style={styles.infoValue}>{voter.LastVotedParty}</Text>
          </View>
          
          {showAll && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Serial No:</Text>
                <Text style={styles.infoValue}>{voter.SerialNoInList}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Category:</Text>
                <Text style={styles.infoValue}>{voter.Category}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Caste:</Text>
                <Text style={styles.infoValue}>{voter.Caste}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Religion:</Text>
                <Text style={styles.infoValue}>{voter.Religion}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Education:</Text>
                <Text style={styles.infoValue}>{voter.EducationLevel}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Employment:</Text>
                <Text style={styles.infoValue}>{voter.EmploymentStatus}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Job Role:</Text>
                <Text style={styles.infoValue}>{voter.JobRole}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Salary Range:</Text>
                <Text style={styles.infoValue}>{voter.MonthlySalaryRange}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>House No:</Text>
                <Text style={styles.infoValue}>{voter.HouseNo}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Guardian:</Text>
                <Text style={styles.infoValue}>{voter.Relation} {voter.Guardian_fName} {voter.Guardian_lName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>DOB:</Text>
                <Text style={styles.infoValue}>{voter.DOB}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{voter.EmailId}</Text>
              </View>
            </>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.viewAllButton} 
          onPress={() => setShowAll(!showAll)}
        >
          <Text style={styles.viewAllText}>{showAll ? 'Show Less' : 'View All Details'}</Text>
          <AppIcon name={showAll ? 'expand-less' : 'expand-more'} size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.headerTitle}>All Voters</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <AppIcon name="power-settings-new" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Voters</Text>
        <Text style={styles.summaryCount}>{voters.length}</Text>
        <Text style={styles.summarySubtitle}>Registered voters</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {voters.length > 0 ? (
          voters.map((voter, index) => (
            <VoterCard key={voter.VoterEPIC || index} voter={voter} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <AppIcon name="how-to-vote" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Voters Found</Text>
            <Text style={styles.emptySubtitle}>No voters are currently registered in the system.</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  logoutButton: {
    padding: 8,
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
    textTransform: 'capitalize',
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
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginRight: 4,
  },
});

export default AllVotersScreen;