import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ReusableDashboard } from '../../components/common';
import { getDashboardConfig } from '../../config/userRoleConfig';
import { USER_ROLES } from '../../services/api/config';

const PanchayatPrabahriDashboard = ({ prabahriInfo, onLogout, onMenuPress, onNavigate }) => {
  const [panchayatData, setPanchayatData] = useState({
    panchayatName: 'Rampur',
    totalVoters: 4500,
    completedVoters: 3100,
    pendingVoters: 1400,
    dataCompleteness: 69,
    activeVolunteers: 28,
    totalVolunteers: 35,
    panchayatLead: 450,
    trend: '+80',
    booths: [
      { 
        id: 'B142', 
        leadLag: 150, 
        dataCoverage: 95, 
        volunteers: { active: 1, total: 1, name: 'राम कुमार' }, 
        status: 'leading',
        totalVoters: 850,
        completedVoters: 807
      },
      { 
        id: 'B143', 
        leadLag: 80, 
        dataCoverage: 88, 
        volunteers: { active: 1, total: 1, name: 'सीता देवी' }, 
        status: 'moderate',
        totalVoters: 920,
        completedVoters: 810
      },
      { 
        id: 'B144', 
        leadLag: -50, 
        dataCoverage: 75, 
        volunteers: { active: 0, total: 1, name: 'अमित शर्मा' }, 
        status: 'losing',
        totalVoters: 780,
        completedVoters: 585
      },
      { 
        id: 'B145', 
        leadLag: 120, 
        dataCoverage: 82, 
        volunteers: { active: 1, total: 1, name: 'सुनीता कुमारी' }, 
        status: 'moderate',
        totalVoters: 890,
        completedVoters: 730
      },
      { 
        id: 'B146', 
        leadLag: 150, 
        dataCoverage: 90, 
        volunteers: { active: 1, total: 1, name: 'विनोद सिंह' }, 
        status: 'leading',
        totalVoters: 1060,
        completedVoters: 954
      }
    ]
  });

  const [performanceData, setPerformanceData] = useState({
    topPerformingVolunteers: [
      { name: 'राम कुमार', booth: 'B142', completion: 95, updates: '300+' },
      { name: 'सुनीता कुमारी', booth: 'B145', completion: 82, updates: '280+' }
    ],
    inactiveVolunteers: [
      { name: 'अमित शर्मा', booth: 'B144', lastActive: '3 days ago', issue: 'Low activity' }
    ],
    boothClassification: {
      leading: 2,
      moderate: 2,
      losing: 1
    }
  });

  const defaultPrabahriInfo = {
    id: 'PP001',
    name: prabahriInfo?.name || 'अनिल यादव',
    phone: '+91 9876543210',
    assignedPanchayat: panchayatData.panchayatName,
    block: 'Maner',
    constituency: 'Danapur',
    assignedBooths: panchayatData.booths.map(b => b.id),
    role: 'panchayat_prabhari',
    ...prabahriInfo
  };

  // Get dashboard configuration for Panchayat Prabhari
  const dashboardConfig = getDashboardConfig(USER_ROLES.PANCHAYAT_PRABHARI);

  // Map actual stats to display values
  const processedStats = dashboardConfig.stats.map(statConfig => {
    let value = 0;
    switch (statConfig.key) {
      case 'assignedPanchayat':
        value = 1;
        break;
      case 'boothVolunteers':
        value = panchayatData.booths.length;
        break;
      case 'localVoters':
        value = panchayatData.totalVoters.toLocaleString();
        break;
      case 'coverage':
        value = `${panchayatData.dataCompleteness}%`;
        break;
      default:
        value = statConfig.value || 0;
    }
    
    return {
      ...statConfig,
      value,
      onPress: () => handleStatPress(statConfig.key)
    };
  });

  // Map actions with proper handlers
  const processedActions = dashboardConfig.actions.map(actionConfig => ({
    ...actionConfig,
    onPress: () => handleActionPress(actionConfig.onPress)
  }));

  const handleStatPress = (statKey) => {
    switch (statKey) {
      case 'localVoters':
        console.log('View panchayat voter analytics');
        break;
      case 'boothVolunteers':
        console.log('View booth volunteers performance');
        break;
      default:
        console.log(`View ${statKey} details`);
    }
  };

  const handleActionPress = (actionType) => {
    switch (actionType) {
      case 'myPanchayat':
        console.log('View panchayat overview');
        break;
      case 'volunteers':
        console.log('Manage booth volunteers');
        break;
      case 'reports':
        console.log('View panchayat reports');
        break;
      case 'settings':
        console.log('View settings');
        break;
      default:
        console.log('Unknown action:', actionType);
    }
  };

  const handleNavigation = (screen, params = null) => {
    switch (screen) {
      case 'myPanchayat':
        console.log('Navigate to panchayat overview');
        break;
      case 'boothVolunteers':
        console.log('Navigate to booth volunteers list');
        break;
      case 'voterList':
        console.log('Navigate to panchayat voter list');
        break;
      default:
        console.log('Unknown navigation:', screen);
    }
    onNavigate?.(screen, params);
  };

  const handleBoothDrillDown = (boothData) => {
    Alert.alert(
      `Booth: ${boothData.id}`,
      `Lead/Lag: ${boothData.leadLag > 0 ? '+' : ''}${boothData.leadLag}\nData Coverage: ${boothData.dataCoverage}%\nVolunteer: ${boothData.volunteers.name}\nVoters: ${boothData.completedVoters}/${boothData.totalVoters}\nStatus: ${boothData.volunteers.active ? 'Active' : 'Inactive'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Booth Dashboard', onPress: () => console.log(`Navigate to ${boothData.id} booth dashboard`) },
        { text: 'Contact Volunteer', onPress: () => console.log(`Contact ${boothData.volunteers.name}`) }
      ]
    );
  };

  // Generate activities for Panchayat Prabhari
  const generateActivities = () => [
    { 
      id: 1, 
      action: `Panchayat Operations: ${panchayatData.booths.length} booths managed`, 
      time: 'Now', 
      type: 'info' 
    },
    { 
      id: 2, 
      action: `Panchayat lead: +${panchayatData.panchayatLead} (Trend: ${panchayatData.trend})`, 
      time: 'Now', 
      type: panchayatData.panchayatLead > 0 ? 'success' : 'warning'
    },
    { 
      id: 3, 
      action: `Data completeness: ${panchayatData.dataCompleteness}%`, 
      time: 'Now', 
      type: panchayatData.dataCompleteness > 70 ? 'success' : 'warning'
    },
    { 
      id: 4, 
      action: `Active volunteers: ${panchayatData.activeVolunteers}/${panchayatData.totalVolunteers}`, 
      time: 'Now', 
      type: (panchayatData.activeVolunteers / panchayatData.totalVolunteers) > 0.8 ? 'success' : 'warning'
    }
  ];

  // Custom title with prabhari info
  const customTitle = `${defaultPrabahriInfo.name}`;
  const customSubtitle = `Panchayat Focus Panel - ${panchayatData.panchayatName}`;

  // Panchayat Summary component
  const PanchayatSummary = () => (
    <View style={styles.summarySection}>
      <Text style={styles.sectionTitle}>Panchayat Summary</Text>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{panchayatData.totalVoters.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Total Voters</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{panchayatData.completedVoters.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{panchayatData.pendingVoters.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </View>

      {/* Party-wise inclination */}
      <View style={styles.partyInclinationContainer}>
        <Text style={styles.subsectionTitle}>Party-wise Inclination (Panchayat)</Text>
        <View style={styles.partyBars}>
          <View style={styles.partyBar}>
            <Text style={styles.partyLabel}>NDA</Text>
            <View style={[styles.partyBarFill, { width: '40%', backgroundColor: '#FF6B35' }]} />
            <Text style={styles.partyValue}>1800</Text>
          </View>
          <View style={styles.partyBar}>
            <Text style={styles.partyLabel}>INDIA</Text>
            <View style={[styles.partyBarFill, { width: '34%', backgroundColor: '#4ECDC4' }]} />
            <Text style={styles.partyValue}>1550</Text>
          </View>
          <View style={styles.partyBar}>
            <Text style={styles.partyLabel}>JS</Text>
            <View style={[styles.partyBarFill, { width: '6%', backgroundColor: '#45B7D1' }]} />
            <Text style={styles.partyValue}>250</Text>
          </View>
          <View style={styles.partyBar}>
            <Text style={styles.partyLabel}>Others</Text>
            <View style={[styles.partyBarFill, { width: '20%', backgroundColor: '#96CEB4' }]} />
            <Text style={styles.partyValue}>900</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Booth Status component
  const BoothStatus = () => (
    <View style={styles.statusSection}>
      <Text style={styles.sectionTitle}>Booth Status (Total: {panchayatData.booths.length})</Text>
      
      <View style={styles.statusOverview}>
        <View style={styles.statusCard}>
          <Text style={[styles.statusCount, { color: '#10B981' }]}>{performanceData.boothClassification.leading}</Text>
          <Text style={styles.statusLabel}>Leading Booths</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={[styles.statusCount, { color: '#F59E0B' }]}>{performanceData.boothClassification.moderate}</Text>
          <Text style={styles.statusLabel}>Moderate Booths</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={[styles.statusCount, { color: '#EF4444' }]}>{performanceData.boothClassification.losing}</Text>
          <Text style={styles.statusLabel}>Losing Booths</Text>
        </View>
      </View>
    </View>
  );

  // Booth Performance component
  const BoothPerformance = () => (
    <View style={styles.performanceSection}>
      <Text style={styles.sectionTitle}>Booth-wise Breakdown</Text>
      
      <View style={styles.performanceHeader}>
        <Text style={styles.performanceHeaderText}>Booth</Text>
        <Text style={styles.performanceHeaderText}>Lead/Lag</Text>
        <Text style={styles.performanceHeaderText}>Coverage</Text>
        <Text style={styles.performanceHeaderText}>Volunteer</Text>
        <Text style={styles.performanceHeaderText}>Status</Text>
      </View>
      
      {panchayatData.booths.map((booth, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.performanceRow,
            { 
              backgroundColor: booth.status === 'losing' ? '#FEF2F2' : 
                              booth.status === 'leading' ? '#F0FDF4' : '#FFFBEB' 
            }
          ]}
          onPress={() => handleBoothDrillDown(booth)}
        >
          <Text style={styles.performanceCell}>{booth.id}</Text>
          <Text style={[
            styles.performanceCell,
            { 
              color: booth.leadLag > 0 ? '#10B981' : '#EF4444',
              fontWeight: 'bold'
            }
          ]}>
            {booth.leadLag > 0 ? '+' : ''}{booth.leadLag}
          </Text>
          <Text style={[
            styles.performanceCell,
            { color: booth.dataCoverage < 80 ? '#EF4444' : '#10B981' }
          ]}>
            {booth.dataCoverage}%
          </Text>
          <Text style={[
            styles.performanceCell,
            { color: booth.volunteers.active ? '#10B981' : '#EF4444' }
          ]}>
            {booth.volunteers.active ? '✅' : '❌'}
          </Text>
          <Text style={styles.performanceCell}>
            {booth.status.charAt(0).toUpperCase() + booth.status.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Volunteer Performance component
  const VolunteerPerformance = () => (
    <View style={styles.volunteerSection}>
      <Text style={styles.sectionTitle}>Volunteer Performance</Text>
      
      <View style={styles.volunteerGrid}>
        {/* Top Performers */}
        <View style={styles.volunteerCard}>
          <Text style={styles.volunteerCardTitle}>Top Performing Volunteers</Text>
          {performanceData.topPerformingVolunteers.map((volunteer, index) => (
            <View key={index} style={styles.volunteerItem}>
              <Text style={styles.volunteerRank}>{index + 1}.</Text>
              <View style={styles.volunteerInfo}>
                <Text style={styles.volunteerName}>{volunteer.name}</Text>
                <Text style={styles.volunteerBooth}>Booth: {volunteer.booth}</Text>
                <Text style={styles.volunteerStats}>
                  {volunteer.completion}% completion, {volunteer.updates} updates
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Inactive Volunteers */}
        <View style={styles.volunteerCard}>
          <Text style={styles.volunteerCardTitle}>Volunteers Needing Attention</Text>
          {performanceData.inactiveVolunteers.map((volunteer, index) => (
            <View key={index} style={styles.inactiveVolunteerItem}>
              <Text style={styles.inactiveVolunteerName}>{volunteer.name}</Text>
              <Text style={styles.inactiveVolunteerBooth}>Booth: {volunteer.booth}</Text>
              <Text style={styles.inactiveVolunteerIssue}>Last active: {volunteer.lastActive}</Text>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => Alert.alert('Contact', `Contact ${volunteer.name}?`)}
              >
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  // Voter Analytics component
  const VoterAnalytics = () => {
    const demographics = {
      gender: { male: 2400, female: 2090, other: 10 },
      ageGroups: { young: 900, middle: 1800, senior: 1800 },
      topCastes: [
        { name: 'Yadav', count: 950 },
        { name: 'Kurmi', count: 600 },
        { name: 'Bhumihar', count: 450 }
      ]
    };

    return (
      <View style={styles.analyticsSection}>
        <Text style={styles.sectionTitle}>Voter Analytics</Text>
        
        <View style={styles.analyticsGrid}>
          {/* Gender Distribution */}
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsCardTitle}>Gender Distribution</Text>
            <View style={styles.genderItem}>
              <Text style={styles.genderLabel}>Male:</Text>
              <Text style={styles.genderValue}>{demographics.gender.male}</Text>
            </View>
            <View style={styles.genderItem}>
              <Text style={styles.genderLabel}>Female:</Text>
              <Text style={styles.genderValue}>{demographics.gender.female}</Text>
            </View>
            <View style={styles.genderItem}>
              <Text style={styles.genderLabel}>Other:</Text>
              <Text style={styles.genderValue}>{demographics.gender.other}</Text>
            </View>
          </View>

          {/* Top Castes */}
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsCardTitle}>Top Communities</Text>
            {demographics.topCastes.map((caste, index) => (
              <View key={index} style={styles.casteItem}>
                <Text style={styles.casteRank}>{index + 1}.</Text>
                <Text style={styles.casteName}>{caste.name}:</Text>
                <Text style={styles.casteCount}>{caste.count}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ReusableDashboard
        user={defaultPrabahriInfo}
        userType={USER_ROLES.PANCHAYAT_PRABHARI}
        title={customTitle}
        subtitle={customSubtitle}
        stats={processedStats}
        actions={processedActions}
        activities={generateActivities()}
        onLogout={onLogout}
        onMenuPress={onMenuPress}
        refreshing={false}
        showMenu={true}
        menuItems={dashboardConfig.menuItems.map(item => ({
          ...item,
          onPress: () => handleNavigation(item.screen)
        }))}
        onNavigate={handleNavigation}
      >
        {/* Custom panchayat management components */}
        <PanchayatSummary />
        <BoothStatus />
        <BoothPerformance />
        <VolunteerPerformance />
        <VoterAnalytics />
      </ReusableDashboard>
    </View>
  );
};

const styles = StyleSheet.create({
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statusSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  performanceSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  volunteerSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  analyticsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  partyInclinationContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partyBars: {
    marginTop: 10,
  },
  partyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  partyLabel: {
    width: 60,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  partyBarFill: {
    height: 16,
    borderRadius: 4,
    marginHorizontal: 10,
    minWidth: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    minWidth: 40,
  },
  statusOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  performanceHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  performanceHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  performanceRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  performanceCell: {
    flex: 1,
    fontSize: 11,
    color: '#111827',
    textAlign: 'center',
  },
  volunteerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  volunteerCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  volunteerCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  volunteerItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  volunteerRank: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 8,
  },
  volunteerInfo: {
    flex: 1,
  },
  volunteerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
  },
  volunteerBooth: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  volunteerStats: {
    fontSize: 10,
    color: '#374151',
    marginTop: 2,
  },
  inactiveVolunteerItem: {
    marginBottom: 15,
  },
  inactiveVolunteerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  inactiveVolunteerBooth: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  inactiveVolunteerIssue: {
    fontSize: 10,
    color: '#374151',
    marginTop: 2,
  },
  contactButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  analyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyticsCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  genderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  genderLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  genderValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  casteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  casteRank: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 5,
  },
  casteName: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  casteCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
});

export default PanchayatPrabahriDashboard;