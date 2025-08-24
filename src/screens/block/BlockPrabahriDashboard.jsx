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

const BlockPrabahriDashboard = ({ prabahriInfo, onLogout, onMenuPress, onNavigate }) => {
  const [blockData, setBlockData] = useState({
    blockName: 'Maner',
    totalVoters: 25000,
    completedVoters: 18000,
    pendingVoters: 7000,
    dataCompleteness: 72,
    activeVolunteers: 85,
    totalVolunteers: 120,
    blockLead: 1500,
    trend: '+200',
    panchayats: [
      { 
        name: 'Rampur', 
        leadLag: 450, 
        dataCoverage: 88, 
        volunteers: { active: 25, total: 30 }, 
        status: 'leading',
        totalVoters: 4500,
        completedVoters: 3960
      },
      { 
        name: 'Sitaram', 
        leadLag: 200, 
        dataCoverage: 85, 
        volunteers: { active: 20, total: 25 }, 
        status: 'moderate',
        totalVoters: 3800,
        completedVoters: 3230
      },
      { 
        name: 'Bihta Village', 
        leadLag: -150, 
        dataCoverage: 70, 
        volunteers: { active: 15, total: 25 }, 
        status: 'losing',
        totalVoters: 3200,
        completedVoters: 2240
      },
      { 
        name: 'Keshopur', 
        leadLag: 300, 
        dataCoverage: 78, 
        volunteers: { active: 18, total: 20 }, 
        status: 'moderate',
        totalVoters: 4100,
        completedVoters: 3198
      },
      { 
        name: 'Mahnar', 
        leadLag: 180, 
        dataCoverage: 82, 
        volunteers: { active: 22, total: 25 }, 
        status: 'moderate',
        totalVoters: 4200,
        completedVoters: 3444
      },
      { 
        name: 'Daudpur', 
        leadLag: 520, 
        dataCoverage: 90, 
        volunteers: { active: 28, total: 30 }, 
        status: 'leading',
        totalVoters: 5200,
        completedVoters: 4680
      }
    ]
  });

  const [performanceInsights, setPerformanceInsights] = useState({
    topPerformingPrabharis: [
      { name: 'Anil Yadav', panchayat: 'Rampur', completion: 88, lead: 450 },
      { name: 'Rekha Sharma', panchayat: 'Sitaram', completion: 85, lead: 200 }
    ],
    underperformingPanchayats: [
      { name: 'Bihta Village', issue: 'Low data coverage (70%)', volunteers: '15/25' },
      { name: 'Keshopur', issue: 'Inactive volunteers', volunteers: '18/20' }
    ],
    dataQuality: {
      missingMobile: 15,
      missingCaste: 8,
      missingVotePreference: 12
    }
  });

  const defaultPrabahriInfo = {
    id: 'BP001',
    name: prabahriInfo?.name || 'सुनील कुमार यादव',
    phone: '+91 9876543210',
    assignedBlock: blockData.blockName,
    constituency: 'Danapur',
    assignedPanchayats: blockData.panchayats.map(p => p.name),
    role: 'block_prabhari',
    ...prabahriInfo
  };

  // Get dashboard configuration for Block Prabhari
  const dashboardConfig = getDashboardConfig(USER_ROLES.BLOCK_PRABHARI);

  // Map actual stats to display values
  const processedStats = dashboardConfig.stats.map(statConfig => {
    let value = 0;
    switch (statConfig.key) {
      case 'assignedBlock':
        value = 1;
        break;
      case 'panchayatOfficers':
        value = blockData.panchayats.length;
        break;
      case 'blockVoters':
        value = blockData.totalVoters.toLocaleString();
        break;
      case 'progress':
        value = `${blockData.dataCompleteness}%`;
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
      case 'blockVoters':
        console.log('View block voter analytics');
        break;
      case 'panchayatOfficers':
        console.log('View panchayat officers performance');
        break;
      default:
        console.log(`View ${statKey} details`);
    }
  };

  const handleActionPress = (actionType) => {
    switch (actionType) {
      case 'myBlock':
        console.log('View block overview');
        break;
      case 'panchayatOfficers':
        console.log('Manage panchayat officers');
        break;
      case 'reports':
        console.log('View block reports');
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
      case 'myBlock':
        console.log('Navigate to block overview');
        break;
      case 'panchayatOfficers':
        console.log('Navigate to panchayat officers list');
        break;
      case 'voterList':
        console.log('Navigate to block voter list');
        break;
      default:
        console.log('Unknown navigation:', screen);
    }
    onNavigate?.(screen, params);
  };

  const handlePanchayatDrillDown = (panchayatData) => {
    Alert.alert(
      `Panchayat: ${panchayatData.name}`,
      `Lead/Lag: ${panchayatData.leadLag > 0 ? '+' : ''}${panchayatData.leadLag}\nData Coverage: ${panchayatData.dataCoverage}%\nVolunteers: ${panchayatData.volunteers.active}/${panchayatData.volunteers.total}\nVoters: ${panchayatData.completedVoters}/${panchayatData.totalVoters}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Panchayat Dashboard', onPress: () => console.log(`Navigate to ${panchayatData.name} panchayat dashboard`) }
      ]
    );
  };

  // Generate activities for Block Prabhari
  const generateActivities = () => [
    { 
      id: 1, 
      action: `Block Operations: ${blockData.panchayats.length} panchayats managed`, 
      time: 'Now', 
      type: 'info' 
    },
    { 
      id: 2, 
      action: `Block lead: +${blockData.blockLead} (Trend: ${blockData.trend})`, 
      time: 'Now', 
      type: blockData.blockLead > 0 ? 'success' : 'warning'
    },
    { 
      id: 3, 
      action: `Data completeness: ${blockData.dataCompleteness}%`, 
      time: 'Now', 
      type: blockData.dataCompleteness > 75 ? 'success' : 'warning'
    },
    { 
      id: 4, 
      action: `Active volunteers: ${blockData.activeVolunteers}/${blockData.totalVolunteers}`, 
      time: 'Now', 
      type: (blockData.activeVolunteers / blockData.totalVolunteers) > 0.8 ? 'success' : 'warning'
    }
  ];

  // Custom title with prabhari info
  const customTitle = `${defaultPrabahriInfo.name}`;
  const customSubtitle = `Block Management - ${blockData.blockName}`;

  // Block Summary component
  const BlockSummary = () => (
    <View style={styles.summarySection}>
      <Text style={styles.sectionTitle}>Block Summary</Text>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{blockData.totalVoters.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Total Voters</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{blockData.completedVoters.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{blockData.pendingVoters.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </View>

      {/* Party-wise inclination */}
      <View style={styles.partyInclinationContainer}>
        <Text style={styles.subsectionTitle}>Party-wise Inclination (Block)</Text>
        <View style={styles.partyBars}>
          <View style={styles.partyBar}>
            <Text style={styles.partyLabel}>NDA</Text>
            <View style={[styles.partyBarFill, { width: '44%', backgroundColor: '#FF6B35' }]} />
            <Text style={styles.partyValue}>11k</Text>
          </View>
          <View style={styles.partyBar}>
            <Text style={styles.partyLabel}>INDIA</Text>
            <View style={[styles.partyBarFill, { width: '36%', backgroundColor: '#4ECDC4' }]} />
            <Text style={styles.partyValue}>9k</Text>
          </View>
          <View style={styles.partyBar}>
            <Text style={styles.partyLabel}>JS</Text>
            <View style={[styles.partyBarFill, { width: '6%', backgroundColor: '#45B7D1' }]} />
            <Text style={styles.partyValue}>1.5k</Text>
          </View>
          <View style={styles.partyBar}>
            <Text style={styles.partyLabel}>Others</Text>
            <View style={[styles.partyBarFill, { width: '14%', backgroundColor: '#96CEB4' }]} />
            <Text style={styles.partyValue}>3.5k</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Panchayat Status component
  const PanchayatStatus = () => {
    const leadingCount = blockData.panchayats.filter(p => p.status === 'leading').length;
    const moderateCount = blockData.panchayats.filter(p => p.status === 'moderate').length;
    const losingCount = blockData.panchayats.filter(p => p.status === 'losing').length;

    return (
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Panchayat Status (Total: {blockData.panchayats.length})</Text>
        
        <View style={styles.statusOverview}>
          <View style={styles.statusCard}>
            <Text style={[styles.statusCount, { color: '#10B981' }]}>{leadingCount}</Text>
            <Text style={styles.statusLabel}>Leading</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={[styles.statusCount, { color: '#F59E0B' }]}>{moderateCount}</Text>
            <Text style={styles.statusLabel}>Moderate</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={[styles.statusCount, { color: '#EF4444' }]}>{losingCount}</Text>
            <Text style={styles.statusLabel}>Losing</Text>
          </View>
        </View>
      </View>
    );
  };

  // Panchayat Performance component
  const PanchayatPerformance = () => (
    <View style={styles.performanceSection}>
      <Text style={styles.sectionTitle}>Panchayat-wise Breakdown</Text>
      
      <View style={styles.performanceHeader}>
        <Text style={styles.performanceHeaderText}>Panchayat</Text>
        <Text style={styles.performanceHeaderText}>Lead/Lag</Text>
        <Text style={styles.performanceHeaderText}>Coverage</Text>
        <Text style={styles.performanceHeaderText}>Volunteers</Text>
      </View>
      
      {blockData.panchayats.map((panchayat, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.performanceRow,
            { 
              backgroundColor: panchayat.status === 'losing' ? '#FEF2F2' : 
                              panchayat.status === 'leading' ? '#F0FDF4' : '#FFFBEB' 
            }
          ]}
          onPress={() => handlePanchayatDrillDown(panchayat)}
        >
          <Text style={styles.performanceCell}>{panchayat.name}</Text>
          <Text style={[
            styles.performanceCell,
            { 
              color: panchayat.leadLag > 0 ? '#10B981' : '#EF4444',
              fontWeight: 'bold'
            }
          ]}>
            {panchayat.leadLag > 0 ? '+' : ''}{panchayat.leadLag}
          </Text>
          <Text style={[
            styles.performanceCell,
            { color: panchayat.dataCoverage < 75 ? '#EF4444' : '#10B981' }
          ]}>
            {panchayat.dataCoverage}%
          </Text>
          <Text style={[
            styles.performanceCell,
            { color: (panchayat.volunteers.active / panchayat.volunteers.total) < 0.8 ? '#EF4444' : '#10B981' }
          ]}>
            {panchayat.volunteers.active}/{panchayat.volunteers.total}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Performance Overview component
  const PerformanceOverview = () => (
    <View style={styles.overviewSection}>
      <Text style={styles.sectionTitle}>Performance Overview</Text>
      
      <View style={styles.overviewGrid}>
        {/* Top Performing Prabharis */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewCardTitle}>Best Performing Panchayat Prabharis</Text>
          {performanceInsights.topPerformingPrabharis.map((prabhari, index) => (
            <View key={index} style={styles.performerItem}>
              <Text style={styles.performerRank}>{index + 1}.</Text>
              <View style={styles.performerInfo}>
                <Text style={styles.performerName}>{prabhari.name}</Text>
                <Text style={styles.performerPanchayat}>({prabhari.panchayat})</Text>
                <Text style={styles.performerStats}>
                  {prabhari.completion}% completion, +{prabhari.lead} lead
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Data Quality */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewCardTitle}>Data Quality Issues</Text>
          <View style={styles.dataQualityItem}>
            <Text style={styles.dataQualityLabel}>Missing Mobile:</Text>
            <Text style={styles.dataQualityValue}>{performanceInsights.dataQuality.missingMobile}%</Text>
          </View>
          <View style={styles.dataQualityItem}>
            <Text style={styles.dataQualityLabel}>Missing Caste Info:</Text>
            <Text style={styles.dataQualityValue}>{performanceInsights.dataQuality.missingCaste}%</Text>
          </View>
          <View style={styles.dataQualityItem}>
            <Text style={styles.dataQualityLabel}>Missing Vote Preference:</Text>
            <Text style={styles.dataQualityValue}>{performanceInsights.dataQuality.missingVotePreference}%</Text>
          </View>
        </View>
      </View>

      {/* Underperforming Areas */}
      <View style={styles.underperformingCard}>
        <Text style={styles.overviewCardTitle}>Areas Needing Attention</Text>
        {performanceInsights.underperformingPanchayats.map((panchayat, index) => (
          <View key={index} style={styles.underperformingItem}>
            <Text style={styles.underperformingName}>{panchayat.name}</Text>
            <Text style={styles.underperformingIssue}>{panchayat.issue}</Text>
            <Text style={styles.underperformingVolunteers}>Volunteers: {panchayat.volunteers}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ReusableDashboard
        user={defaultPrabahriInfo}
        userType={USER_ROLES.BLOCK_PRABHARI}
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
        {/* Custom block management components */}
        <BlockSummary />
        <PanchayatStatus />
        <PanchayatPerformance />
        <PerformanceOverview />
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
  overviewSection: {
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
    fontSize: 20,
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
    marginBottom: 10,
  },
  partyLabel: {
    width: 60,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  partyBarFill: {
    height: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  performanceHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  performanceRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  performanceCell: {
    flex: 1,
    fontSize: 12,
    color: '#111827',
    textAlign: 'center',
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
  performerItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  performerRank: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 8,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
  },
  performerPanchayat: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  performerStats: {
    fontSize: 10,
    color: '#374151',
    marginTop: 2,
  },
  dataQualityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataQualityLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  dataQualityValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  underperformingCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  underperformingItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  underperformingName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  underperformingIssue: {
    fontSize: 11,
    color: '#374151',
    marginTop: 2,
  },
  underperformingVolunteers: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default BlockPrabahriDashboard;