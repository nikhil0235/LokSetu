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

const PoliticalPartyDashboard = ({ partyInfo, onLogout, onMenuPress, onNavigate }) => {
  const [partyData, setPartyData] = useState({
    partyName: 'BJP Bihar',
    state: 'Bihar',
    totalConstituencies: 45,
    assignedConstituencies: 35,
    totalUsers: 2850,
    activeUsers: 2680,
    totalBooths: 15420,
    assignedBooths: 14890,
    totalVoters: 12500000,
    dataCompleteness: 82,
    constituencies: [
      {
        name: 'Patna Sahib',
        candidate: 'रवि शंकर प्रसाद',
        lead: 15000,
        dataCompletion: 95,
        volunteers: { active: 450, total: 480 },
        status: 'safe'
      },
      {
        name: 'Danapur',
        candidate: 'आशा सिन्हा',
        lead: 5500,
        dataCompletion: 85,
        volunteers: { active: 420, total: 450 },
        status: 'moderate'
      },
      {
        name: 'Bankipur',
        candidate: 'नितिन नवीन',
        lead: -2500,
        dataCompletion: 78,
        volunteers: { active: 380, total: 420 },
        status: 'risk'
      },
      {
        name: 'Kumhrar',
        candidate: 'अनिल कुमार सिंह',
        lead: 8200,
        dataCompletion: 88,
        volunteers: { active: 390, total: 400 },
        status: 'safe'
      },
      {
        name: 'Digha',
        candidate: 'संजय कुमार',
        lead: 3200,
        dataCompletion: 76,
        volunteers: { active: 320, total: 380 },
        status: 'moderate'
      }
    ]
  });

  const [stateOverview, setStateOverview] = useState({
    totalLead: 29400,
    winningSeats: 28,
    competitiveSeats: 12,
    riskSeats: 5,
    performanceMetrics: {
      dataCollection: 82,
      volunteerActivity: 94,
      targetAchievement: 76
    },
    topIssues: [
      { issue: 'Employment', constituencies: 18, percentage: 42 },
      { issue: 'Infrastructure', constituencies: 12, percentage: 28 },
      { issue: 'Healthcare', constituencies: 8, percentage: 18 },
      { issue: 'Education', constituencies: 5, percentage: 12 }
    ]
  });

  const defaultPartyInfo = {
    id: 'PARTY001',
    name: partyInfo?.name || 'भारतीय जनता पार्टी',
    shortName: 'BJP',
    state: partyData.state,
    president: 'संजय जायसवाल',
    phone: '+91 9876543210',
    role: 'political_party',
    ...partyInfo
  };

  // Get dashboard configuration for Political Party
  const dashboardConfig = getDashboardConfig(USER_ROLES.POLITICAL_PARTY);

  // Map actual stats to display values
  const processedStats = dashboardConfig.stats.map(statConfig => {
    let value = 0;
    switch (statConfig.key) {
      case 'totalCreatedUsers':
        value = partyData.totalUsers.toLocaleString();
        break;
      case 'totalAssignedBooths':
        value = partyData.assignedBooths.toLocaleString();
        break;
      case 'totalAssignedConstituencies':
        value = partyData.assignedConstituencies;
        break;
      case 'lastUpdated':
        value = 'Now';
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
      case 'totalCreatedUsers':
        console.log('View all party users');
        break;
      case 'totalAssignedBooths':
        console.log('View all assigned booths');
        break;
      case 'totalAssignedConstituencies':
        console.log('View all assigned constituencies');
        break;
      default:
        console.log(`View ${statKey} details`);
    }
  };

  const handleActionPress = (actionType) => {
    switch (actionType) {
      case 'createBoothBoy':
        console.log('Create new booth volunteer');
        break;
      case 'assignBooths':
        console.log('Assign booths to volunteers');
        break;
      case 'reports':
        console.log('View party reports');
        break;
      case 'settings':
        console.log('View party settings');
        break;
      default:
        console.log('Unknown action:', actionType);
    }
  };

  const handleNavigation = (screen, params = null) => {
    switch (screen) {
      case 'createdUsers':
        console.log('Navigate to created users list');
        break;
      case 'boothList':
        console.log('Navigate to booth list');
        break;
      case 'createBoothBoy':
        console.log('Navigate to create booth boy');
        break;
      case 'assignBooths':
        console.log('Navigate to assign booths');
        break;
      default:
        console.log('Unknown navigation:', screen);
    }
    onNavigate?.(screen, params);
  };

  const handleConstituencyDrillDown = (constituency) => {
    Alert.alert(
      `Constituency: ${constituency.name}`,
      `Candidate: ${constituency.candidate}\nLead/Lag: ${constituency.lead > 0 ? '+' : ''}${constituency.lead}\nData Completion: ${constituency.dataCompletion}%\nVolunteers: ${constituency.volunteers.active}/${constituency.volunteers.total}\nStatus: ${constituency.status}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Constituency Dashboard', onPress: () => console.log(`Navigate to ${constituency.name} constituency dashboard`) },
        { text: 'Contact Candidate', onPress: () => console.log(`Contact ${constituency.candidate}`) }
      ]
    );
  };

  // Generate activities for Political Party
  const generateActivities = () => [
    { 
      id: 1, 
      action: `State Operations: ${partyData.assignedConstituencies}/${partyData.totalConstituencies} constituencies`, 
      time: 'Now', 
      type: 'info' 
    },
    { 
      id: 2, 
      action: `Overall lead: +${stateOverview.totalLead.toLocaleString()} across ${stateOverview.winningSeats} winning seats`, 
      time: 'Now', 
      type: 'success'
    },
    { 
      id: 3, 
      action: `Data completeness: ${partyData.dataCompleteness}% state-wide`, 
      time: 'Now', 
      type: partyData.dataCompleteness > 80 ? 'success' : 'warning'
    },
    { 
      id: 4, 
      action: `Active users: ${partyData.activeUsers.toLocaleString()}/${partyData.totalUsers.toLocaleString()}`, 
      time: 'Now', 
      type: 'info'
    }
  ];

  // Custom title with party info
  const customTitle = `${defaultPartyInfo.shortName} ${defaultPartyInfo.state}`;
  const customSubtitle = `Party Management Dashboard - ${stateOverview.winningSeats} Winning Seats`;

  // State Overview component
  const StateOverview = () => (
    <View style={styles.overviewSection}>
      <Text style={styles.sectionTitle}>State Overview</Text>
      
      <View style={styles.overviewGrid}>
        {/* Performance Metrics */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewCardTitle}>Performance Metrics</Text>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Data Collection:</Text>
            <Text style={[styles.metricValue, { color: '#10B981' }]}>
              {stateOverview.performanceMetrics.dataCollection}%
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Volunteer Activity:</Text>
            <Text style={[styles.metricValue, { color: '#10B981' }]}>
              {stateOverview.performanceMetrics.volunteerActivity}%
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Target Achievement:</Text>
            <Text style={[styles.metricValue, { color: '#F59E0B' }]}>
              {stateOverview.performanceMetrics.targetAchievement}%
            </Text>
          </View>
        </View>

        {/* Seat Classification */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewCardTitle}>Seat Classification</Text>
          <View style={styles.seatItem}>
            <View style={[styles.seatIndicator, { backgroundColor: '#10B981' }]} />
            <Text style={styles.seatLabel}>Winning Seats:</Text>
            <Text style={styles.seatValue}>{stateOverview.winningSeats}</Text>
          </View>
          <View style={styles.seatItem}>
            <View style={[styles.seatIndicator, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.seatLabel}>Competitive:</Text>
            <Text style={styles.seatValue}>{stateOverview.competitiveSeats}</Text>
          </View>
          <View style={styles.seatItem}>
            <View style={[styles.seatIndicator, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.seatLabel}>At Risk:</Text>
            <Text style={styles.seatValue}>{stateOverview.riskSeats}</Text>
          </View>
        </View>
      </View>

      {/* Overall State Lead */}
      <View style={styles.stateLeadCard}>
        <Text style={styles.stateLeadTitle}>Overall State Lead</Text>
        <Text style={styles.stateLeadValue}>+{stateOverview.totalLead.toLocaleString()}</Text>
        <Text style={styles.stateLeadSubtext}>votes across all constituencies</Text>
      </View>
    </View>
  );

  // Constituency Performance component
  const ConstituencyPerformance = () => (
    <View style={styles.constituencySection}>
      <Text style={styles.sectionTitle}>Constituency Performance</Text>
      
      <View style={styles.constituencyHeader}>
        <Text style={styles.constituencyHeaderText}>Constituency</Text>
        <Text style={styles.constituencyHeaderText}>Candidate</Text>
        <Text style={styles.constituencyHeaderText}>Lead/Lag</Text>
        <Text style={styles.constituencyHeaderText}>Data %</Text>
        <Text style={styles.constituencyHeaderText}>Status</Text>
      </View>
      
      {partyData.constituencies.map((constituency, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.constituencyRow,
            { 
              backgroundColor: constituency.status === 'risk' ? '#FEF2F2' : 
                              constituency.status === 'safe' ? '#F0FDF4' : '#FFFBEB' 
            }
          ]}
          onPress={() => handleConstituencyDrillDown(constituency)}
        >
          <Text style={styles.constituencyCell}>{constituency.name}</Text>
          <Text style={styles.constituencyCell}>{constituency.candidate}</Text>
          <Text style={[
            styles.constituencyCell,
            { 
              color: constituency.lead > 0 ? '#10B981' : '#EF4444',
              fontWeight: 'bold'
            }
          ]}>
            {constituency.lead > 0 ? '+' : ''}{constituency.lead.toLocaleString()}
          </Text>
          <Text style={[
            styles.constituencyCell,
            { color: constituency.dataCompletion < 80 ? '#EF4444' : '#10B981' }
          ]}>
            {constituency.dataCompletion}%
          </Text>
          <Text style={styles.constituencyCell}>
            {constituency.status.charAt(0).toUpperCase() + constituency.status.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Top Issues component
  const TopIssues = () => (
    <View style={styles.issuesSection}>
      <Text style={styles.sectionTitle}>Top Voter Issues Across State</Text>
      
      <View style={styles.issuesContainer}>
        {stateOverview.topIssues.map((issue, index) => (
          <View key={index} style={styles.issueCard}>
            <Text style={styles.issueRank}>#{index + 1}</Text>
            <View style={styles.issueInfo}>
              <Text style={styles.issueName}>{issue.issue}</Text>
              <Text style={styles.issueDetails}>
                {issue.constituencies} constituencies ({issue.percentage}%)
              </Text>
            </View>
            <View style={styles.issueBarContainer}>
              <View 
                style={[
                  styles.issueBar, 
                  { 
                    width: `${issue.percentage * 2}%`,
                    backgroundColor: index === 0 ? '#EF4444' : index === 1 ? '#F59E0B' : '#10B981'
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // Resource Allocation component
  const ResourceAllocation = () => {
    const resourceData = {
      totalBudget: '₹12 Cr',
      allocated: 85,
      pending: 15,
      highPriorityConstituencies: 5,
      mediumPriority: 12,
      lowPriority: 18
    };

    return (
      <View style={styles.resourceSection}>
        <Text style={styles.sectionTitle}>Resource Allocation</Text>
        
        <View style={styles.resourceGrid}>
          {/* Budget Overview */}
          <View style={styles.resourceCard}>
            <Text style={styles.resourceCardTitle}>Budget Overview</Text>
            <Text style={styles.budgetValue}>{resourceData.totalBudget}</Text>
            <Text style={styles.budgetLabel}>Total Allocated</Text>
            <View style={styles.budgetProgress}>
              <View style={[styles.budgetProgressFill, { width: `${resourceData.allocated}%` }]} />
            </View>
            <Text style={styles.budgetProgressText}>{resourceData.allocated}% Utilized</Text>
          </View>

          {/* Priority Distribution */}
          <View style={styles.resourceCard}>
            <Text style={styles.resourceCardTitle}>Constituency Priorities</Text>
            <View style={styles.priorityItem}>
              <View style={[styles.priorityDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.priorityLabel}>High Priority:</Text>
              <Text style={styles.priorityValue}>{resourceData.highPriorityConstituencies}</Text>
            </View>
            <View style={styles.priorityItem}>
              <View style={[styles.priorityDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.priorityLabel}>Medium:</Text>
              <Text style={styles.priorityValue}>{resourceData.mediumPriority}</Text>
            </View>
            <View style={styles.priorityItem}>
              <View style={[styles.priorityDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.priorityLabel}>Low Priority:</Text>
              <Text style={styles.priorityValue}>{resourceData.lowPriority}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ReusableDashboard
        user={defaultPartyInfo}
        userType={USER_ROLES.POLITICAL_PARTY}
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
        {/* Custom party management components */}
        <StateOverview />
        <ConstituencyPerformance />
        <TopIssues />
        <ResourceAllocation />
      </ReusableDashboard>
    </View>
  );
};

const styles = StyleSheet.create({
  overviewSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  constituencySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  issuesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  resourceSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  overviewCard: {
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
  overviewCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  seatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  seatIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  seatLabel: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  seatValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  stateLeadCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stateLeadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  stateLeadValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
  },
  stateLeadSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  constituencyHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  constituencyHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  constituencyRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  constituencyCell: {
    flex: 1,
    fontSize: 10,
    color: '#111827',
    textAlign: 'center',
  },
  issuesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  issueRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 15,
    width: 25,
  },
  issueInfo: {
    flex: 1,
  },
  issueName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  issueDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  issueBarContainer: {
    width: 80,
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    marginLeft: 10,
  },
  issueBar: {
    height: 4,
    borderRadius: 2,
  },
  resourceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resourceCard: {
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
  resourceCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  budgetValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    textAlign: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 5,
  },
  budgetProgress: {
    width: '100%',
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  budgetProgressFill: {
    height: 8,
    backgroundColor: '#10B981',
  },
  budgetProgressText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 5,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityLabel: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  priorityValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
});

export default PoliticalPartyDashboard;