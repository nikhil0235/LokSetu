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

const SuperAdminDashboard = ({ adminInfo, onLogout, onMenuPress, onNavigate }) => {
  const [systemData, setSystemData] = useState({
    activeUsers: 12500,
    dataUsage: '2.5 TB',
    apiStatus: 'Healthy',
    appHealth: 98.5,
    totalAdmins: 450,
    totalBoothBoys: 8500,
    totalVoters: 25000000,
    totalBooths: 45000,
    totalConstituencies: 243,
    systemUptime: '99.8%',
    dailyActiveUsers: 9800,
    dataProcessingRate: '1.2M records/hour'
  });

  const [stateWideOverview, setStateWideOverview] = useState({
    states: [
      {
        name: 'Bihar',
        party: 'BJP',
        constituencies: 40,
        lead: 125000,
        dataCompletion: 89,
        volunteers: { active: 8500, total: 9200 },
        status: 'winning'
      },
      {
        name: 'Uttar Pradesh',
        party: 'BJP',
        constituencies: 80,
        lead: 450000,
        dataCompletion: 92,
        volunteers: { active: 18200, total: 19500 },
        status: 'winning'
      },
      {
        name: 'Maharashtra',
        party: 'BJP',
        constituencies: 48,
        lead: -25000,
        dataCompletion: 85,
        volunteers: { active: 10800, total: 12000 },
        status: 'competitive'
      },
      {
        name: 'West Bengal',
        party: 'BJP',
        constituencies: 42,
        lead: -85000,
        dataCompletion: 78,
        volunteers: { active: 9200, total: 11000 },
        status: 'challenging'
      }
    ],
    totalLead: 465000,
    winningStates: 2,
    competitiveStates: 1,
    challengingStates: 1
  });

  const [systemMetrics, setSystemMetrics] = useState({
    performanceRanking: [
      { state: 'Uttar Pradesh', score: 94, trend: 'up' },
      { state: 'Bihar', score: 89, trend: 'up' },
      { state: 'Maharashtra', score: 85, trend: 'stable' },
      { state: 'West Bengal', score: 78, trend: 'down' }
    ],
    problemAreas: [
      { area: 'West Bengal - Voter data collection lagging', severity: 'high', count: 15 },
      { area: 'Maharashtra - Low volunteer activity in urban areas', severity: 'medium', count: 8 },
      { area: 'Bihar - Mobile number verification pending', severity: 'low', count: 25 }
    ],
    voterMovement: [
      { from: 'Doubtful', to: 'NDA', percentage: 12, votes: '450K' },
      { from: 'INDIA', to: 'Doubtful', percentage: 8, votes: '280K' },
      { from: 'Others', to: 'NDA', percentage: 5, votes: '125K' }
    ]
  });

  const defaultAdminInfo = {
    id: 'SA001',
    name: adminInfo?.name || 'System Administrator',
    email: 'admin@boothpulse.in',
    phone: '+91 9876543210',
    role: 'super_admin',
    permissions: 'all',
    ...adminInfo
  };

  // Get dashboard configuration for Super Admin
  const dashboardConfig = getDashboardConfig(USER_ROLES.SUPER_ADMIN);

  // Map actual stats to display values
  const processedStats = dashboardConfig.stats.map(statConfig => {
    let value = 0;
    switch (statConfig.key) {
      case 'totalAdmins':
        value = systemData.totalAdmins.toLocaleString();
        break;
      case 'totalBoothBoys':
        value = systemData.totalBoothBoys.toLocaleString();
        break;
      case 'totalVoters':
        value = (systemData.totalVoters / 1000000).toFixed(1) + 'M';
        break;
      case 'totalBooths':
        value = (systemData.totalBooths / 1000).toFixed(0) + 'K';
        break;
      case 'totalConstituencies':
        value = systemData.totalConstituencies;
        break;
      case 'dataProgress':
        value = '89%';
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
      case 'totalAdmins':
        console.log('View all system admins');
        break;
      case 'totalBoothBoys':
        console.log('View all booth volunteers');
        break;
      case 'totalVoters':
        console.log('View voter analytics');
        break;
      case 'totalBooths':
        console.log('View booth analytics');
        break;
      default:
        console.log(`View ${statKey} details`);
    }
  };

  const handleActionPress = (actionType) => {
    switch (actionType) {
      case 'createAdmin':
        console.log('Create new admin user');
        break;
      case 'assignConstituency':
        console.log('Assign constituencies');
        break;
      case 'dataScraper':
        console.log('Open data scraper');
        break;
      case 'systemReports':
        console.log('View system reports');
        break;
      default:
        console.log('Unknown action:', actionType);
    }
  };

  const handleNavigation = (screen, params = null) => {
    switch (screen) {
      case 'allAdmins':
        console.log('Navigate to all admins');
        break;
      case 'allBoothBoys':
        console.log('Navigate to all booth boys');
        break;
      case 'allVoters':
        console.log('Navigate to voter management');
        break;
      case 'boothList':
        console.log('Navigate to booth list');
        break;
      case 'constituenciesList':
        console.log('Navigate to constituencies');
        break;
      default:
        console.log('Unknown navigation:', screen);
    }
    onNavigate?.(screen, params);
  };

  const handleStateDrillDown = (state) => {
    Alert.alert(
      `${state.name} State Overview`,
      `Party: ${state.party}\nConstituencies: ${state.constituencies}\nLead: ${state.lead > 0 ? '+' : ''}${state.lead.toLocaleString()}\nData Completion: ${state.dataCompletion}%\nVolunteers: ${state.volunteers.active.toLocaleString()}/${state.volunteers.total.toLocaleString()}\nStatus: ${state.status}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View State Dashboard', onPress: () => console.log(`Navigate to ${state.name} state dashboard`) },
        { text: 'System Override', onPress: () => console.log(`System override for ${state.name}`) }
      ]
    );
  };

  // Generate activities for Super Admin
  const generateActivities = () => [
    { 
      id: 1, 
      action: `System Health: ${systemData.appHealth}% uptime`, 
      time: 'Now', 
      type: 'success' 
    },
    { 
      id: 2, 
      action: `Daily Active Users: ${systemData.dailyActiveUsers.toLocaleString()}`, 
      time: 'Now', 
      type: 'info'
    },
    { 
      id: 3, 
      action: `Data Processing: ${systemData.dataProcessingRate}`, 
      time: 'Now', 
      type: 'info'
    },
    { 
      id: 4, 
      action: `Overall lead: +${stateWideOverview.totalLead.toLocaleString()} across all states`, 
      time: 'Now', 
      type: 'success'
    }
  ];

  // Custom title with admin info
  const customTitle = `${defaultAdminInfo.name}`;
  const customSubtitle = `Super Admin Console - National Operations`;

  // Application Health component
  const ApplicationHealth = () => (
    <View style={styles.healthSection}>
      <Text style={styles.sectionTitle}>Application Health & Usage</Text>
      
      <View style={styles.healthGrid}>
        <View style={styles.healthCard}>
          <Text style={styles.healthValue}>{systemData.activeUsers.toLocaleString()}</Text>
          <Text style={styles.healthLabel}>Active Users</Text>
          <Text style={styles.healthSubtext}>Last 24 hours</Text>
        </View>
        
        <View style={styles.healthCard}>
          <Text style={styles.healthValue}>{systemData.dataUsage}</Text>
          <Text style={styles.healthLabel}>Data Usage</Text>
          <Text style={styles.healthSubtext}>Current month</Text>
        </View>
        
        <View style={styles.healthCard}>
          <Text style={[styles.healthValue, { color: '#10B981' }]}>{systemData.apiStatus}</Text>
          <Text style={styles.healthLabel}>API Status</Text>
          <Text style={styles.healthSubtext}>All systems operational</Text>
        </View>
      </View>

      {/* System Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>System Uptime:</Text>
          <Text style={[styles.metricValue, { color: '#10B981' }]}>{systemData.systemUptime}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>App Health Score:</Text>
          <Text style={[styles.metricValue, { color: '#10B981' }]}>{systemData.appHealth}%</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Data Processing Rate:</Text>
          <Text style={styles.metricValue}>{systemData.dataProcessingRate}</Text>
        </View>
      </View>
    </View>
  );

  // System Controls component
  const SystemControls = () => (
    <View style={styles.controlsSection}>
      <Text style={styles.sectionTitle}>System Controls</Text>
      
      <View style={styles.controlsGrid}>
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: '#3B82F6' }]}
          onPress={() => Alert.alert('User Management', 'Open user management system?')}
        >
          <Text style={styles.controlButtonText}>Manage Users & Roles</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: '#10B981' }]}
          onPress={() => Alert.alert('Announcement', 'Send system-wide announcement?')}
        >
          <Text style={styles.controlButtonText}>Push Announcement</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: '#F59E0B' }]}
          onPress={() => Alert.alert('Audit Logs', 'View system audit logs?')}
        >
          <Text style={styles.controlButtonText}>View Audit Logs</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: '#EF4444' }]}
          onPress={() => Alert.alert('Data Override', 'Manual data override - Use with caution!')}
        >
          <Text style={styles.controlButtonText}>Manual Data Override</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // State-wide Performance component
  const StateWidePerformance = () => (
    <View style={styles.stateSection}>
      <Text style={styles.sectionTitle}>State-wise Performance Ranking</Text>
      
      <View style={styles.stateHeader}>
        <Text style={styles.stateHeaderText}>State</Text>
        <Text style={styles.stateHeaderText}>Lead/Lag</Text>
        <Text style={styles.stateHeaderText}>Data Coverage</Text>
        <Text style={styles.stateHeaderText}>Volunteers</Text>
        <Text style={styles.stateHeaderText}>Status</Text>
      </View>
      
      {stateWideOverview.states.map((state, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.stateRow,
            { 
              backgroundColor: state.status === 'challenging' ? '#FEF2F2' : 
                              state.status === 'winning' ? '#F0FDF4' : '#FFFBEB' 
            }
          ]}
          onPress={() => handleStateDrillDown(state)}
        >
          <Text style={styles.stateCell}>{state.name}</Text>
          <Text style={[
            styles.stateCell,
            { 
              color: state.lead > 0 ? '#10B981' : '#EF4444',
              fontWeight: 'bold'
            }
          ]}>
            {state.lead > 0 ? '+' : ''}{(state.lead / 1000).toFixed(0)}K
          </Text>
          <Text style={[
            styles.stateCell,
            { color: state.dataCompletion < 85 ? '#EF4444' : '#10B981' }
          ]}>
            {state.dataCompletion}%
          </Text>
          <Text style={styles.stateCell}>
            {(state.volunteers.active / 1000).toFixed(1)}K/{(state.volunteers.total / 1000).toFixed(1)}K
          </Text>
          <Text style={styles.stateCell}>
            {state.status.charAt(0).toUpperCase() + state.status.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Problem Areas component
  const ProblemAreas = () => (
    <View style={styles.problemSection}>
      <Text style={styles.sectionTitle}>Problem Areas & Alerts</Text>
      
      <View style={styles.problemContainer}>
        {systemMetrics.problemAreas.map((problem, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.problemCard,
              { 
                borderLeftColor: problem.severity === 'high' ? '#EF4444' : 
                                problem.severity === 'medium' ? '#F59E0B' : '#10B981',
                borderLeftWidth: 4
              }
            ]}
            onPress={() => Alert.alert('Problem Details', problem.area)}
          >
            <View style={styles.problemHeader}>
              <Text style={[
                styles.problemSeverity,
                { 
                  color: problem.severity === 'high' ? '#EF4444' : 
                        problem.severity === 'medium' ? '#F59E0B' : '#10B981'
                }
              ]}>
                {problem.severity.toUpperCase()}
              </Text>
              <Text style={styles.problemCount}>{problem.count} issues</Text>
            </View>
            <Text style={styles.problemText}>{problem.area}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Voter Movement Tracker component
  const VoterMovementTracker = () => (
    <View style={styles.movementSection}>
      <Text style={styles.sectionTitle}>Voter Movement Tracker</Text>
      
      <View style={styles.movementContainer}>
        <Text style={styles.movementSubtitle}>Major shifts across all states (Last 30 days)</Text>
        {systemMetrics.voterMovement.map((movement, index) => (
          <View key={index} style={styles.movementItem}>
            <View style={styles.movementFlow}>
              <Text style={styles.movementFrom}>{movement.from}</Text>
              <Text style={styles.movementArrow}>→</Text>
              <Text style={styles.movementTo}>{movement.to}</Text>
            </View>
            <View style={styles.movementStats}>
              <Text style={styles.movementPercentage}>{movement.percentage}%</Text>
              <Text style={styles.movementVotes}>{movement.votes} voters</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ReusableDashboard
        user={defaultAdminInfo}
        userType={USER_ROLES.SUPER_ADMIN}
        title={customTitle}
        subtitle={customSubtitle}
        stats={processedStats}
        actions={processedActions}
        activities={generateActivities()}
        healthMetrics={dashboardConfig.healthMetrics}
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
        {/* Custom super admin components */}
        <ApplicationHealth />
        <SystemControls />
        <StateWidePerformance />
        <ProblemAreas />
        <VoterMovementTracker />
      </ReusableDashboard>
    </View>
  );
};

const styles = StyleSheet.create({
  healthSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  controlsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  stateSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  problemSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  movementSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  healthGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  healthCard: {
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
  healthValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  healthLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  healthSubtext: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  metricsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  stateHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  stateHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  stateRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  stateCell: {
    flex: 1,
    fontSize: 11,
    color: '#111827',
    textAlign: 'center',
  },
  problemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  problemCard: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
  },
  problemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  problemSeverity: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  problemCount: {
    fontSize: 10,
    color: '#6B7280',
  },
  problemText: {
    fontSize: 12,
    color: '#374151',
  },
  movementContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  movementSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
  },
  movementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  movementFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  movementFrom: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  movementArrow: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 8,
  },
  movementTo: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: 'bold',
  },
  movementStats: {
    alignItems: 'flex-end',
  },
  movementPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  movementVotes: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default SuperAdminDashboard;