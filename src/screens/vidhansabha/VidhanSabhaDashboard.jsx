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

const VidhanSabhaDashboard = ({ prabahriInfo, onLogout, onMenuPress, onNavigate }) => {
  const [constituencyData, setConstituencyData] = useState({
    totalVoters: 280000,
    completedVoters: 238000,
    pendingVoters: 42000,
    dataCompleteness: 85,
    activeVolunteers: 420,
    totalVolunteers: 450,
    currentLead: 5500,
    trend: '+450',
    blocks: [
      { 
        name: 'Maner', 
        leadLag: 1800, 
        dataCoverage: 91, 
        volunteers: { active: 150, total: 160 }, 
        topIssue: 'Employment',
        status: 'leading' 
      },
      { 
        name: 'Bihta', 
        leadLag: -1200, 
        dataCoverage: 78, 
        volunteers: { active: 120, total: 130 }, 
        topIssue: 'Roads',
        status: 'losing' 
      },
      { 
        name: 'Khagaul', 
        leadLag: 3500, 
        dataCoverage: 95, 
        volunteers: { active: 100, total: 100 }, 
        topIssue: 'Electricity',
        status: 'leading' 
      },
      { 
        name: 'Anandpur', 
        leadLag: 1400, 
        dataCoverage: 84, 
        volunteers: { active: 80, total: 100 }, 
        topIssue: 'Healthcare',
        status: 'moderate' 
      }
    ]
  });

  const [tacticalInsights, setTacticalInsights] = useState({
    prabhrisNeedingAction: [
      { name: 'Anil Kumar', block: 'Anandpur', issue: 'Low volunteer activity (70%)' },
      { name: 'Sunil Singh', block: 'Bihta', issue: 'Data coverage below target (78%)' }
    ],
    voterIssuesHotspot: [
      { area: 'Bihta', issue: 'Road/Infrastructure', percentage: 45 },
      { area: 'Maner', issue: 'Employment', percentage: 38 }
    ],
    casteMovement: [
      { community: 'EBC', movement: '5% shift to NDA from Doubtful', trend: 'positive' },
      { community: 'Yadav', movement: '2% shift to INDIA from Doubtful', trend: 'negative' },
      { community: 'Rajput', movement: 'Holding steady at 75% for NDA', trend: 'stable' }
    ]
  });

  const defaultPrabahriInfo = {
    id: 'VSP001',
    name: prabahriInfo?.name || 'राजेश कुमार सिंह',
    phone: '+91 9876543210',
    constituency: 'Danapur',
    assignedBlocks: ['Maner', 'Bihta', 'Khagaul', 'Anandpur'],
    role: 'vidhan_sabha_prabhari',
    ...prabahriInfo
  };

  // Get dashboard configuration for Vidhan Sabha Prabhari
  const dashboardConfig = getDashboardConfig(USER_ROLES.VIDHAN_SABHA_PRABHARI);

  // Map actual stats to display values
  const processedStats = dashboardConfig.stats.map(statConfig => {
    let value = 0;
    switch (statConfig.key) {
      case 'assignedArea':
        value = 1;
        break;
      case 'blockOfficers':
        value = constituencyData.blocks.length;
        break;
      case 'totalVoters':
        value = constituencyData.totalVoters.toLocaleString();
        break;
      case 'reports':
        value = 15;
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
      case 'totalVoters':
        console.log('View constituency voter analytics');
        break;
      case 'blockOfficers':
        console.log('View block officers performance');
        break;
      default:
        console.log(`View ${statKey} details`);
    }
  };

  const handleActionPress = (actionType) => {
    switch (actionType) {
      case 'myArea':
        console.log('View constituency overview');
        break;
      case 'manageOfficers':
        console.log('Manage block officers');
        break;
      case 'reports':
        console.log('View constituency reports');
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
      case 'myArea':
        console.log('Navigate to constituency area view');
        break;
      case 'blockOfficers':
        console.log('Navigate to block officers list');
        break;
      case 'voterList':
        console.log('Navigate to constituency voter list');
        break;
      default:
        console.log('Unknown navigation:', screen);
    }
    onNavigate?.(screen, params);
  };

  const handleBlockDrillDown = (blockData) => {
    Alert.alert(
      `Block: ${blockData.name}`,
      `Lead/Lag: ${blockData.leadLag > 0 ? '+' : ''}${blockData.leadLag}\nData Coverage: ${blockData.dataCoverage}%\nVolunteers: ${blockData.volunteers.active}/${blockData.volunteers.total}\nTop Issue: ${blockData.topIssue}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Block Dashboard', onPress: () => console.log(`Navigate to ${blockData.name} block dashboard`) }
      ]
    );
  };

  // Generate activities for Vidhan Sabha Prabhari
  const generateActivities = () => [
    { 
      id: 1, 
      action: `Constituency Operations: ${constituencyData.blocks.length} blocks managed`, 
      time: 'Now', 
      type: 'info' 
    },
    { 
      id: 2, 
      action: `Current lead: +${constituencyData.currentLead} (Trend: ${constituencyData.trend})`, 
      time: 'Now', 
      type: constituencyData.currentLead > 0 ? 'success' : 'warning'
    },
    { 
      id: 3, 
      action: `Data completeness: ${constituencyData.dataCompleteness}%`, 
      time: 'Now', 
      type: constituencyData.dataCompleteness > 80 ? 'success' : 'warning'
    },
    { 
      id: 4, 
      action: `Active volunteers: ${constituencyData.activeVolunteers}/${constituencyData.totalVolunteers}`, 
      time: 'Now', 
      type: 'info'
    }
  ];

  // Custom title with prabhari info
  const customTitle = `${defaultPrabahriInfo.name}`;
  const customSubtitle = `Constituency Operations - ${defaultPrabahriInfo.constituency}`;

  // Live Political Status component
  const LivePoliticalStatus = () => (
    <View style={styles.politicalSection}>
      <Text style={styles.sectionTitle}>Live Political Status</Text>
      
      <View style={styles.statusContainer}>
        <View style={styles.statusCard}>
          <Text style={styles.statusValue}>+{constituencyData.currentLead.toLocaleString()}</Text>
          <Text style={styles.statusLabel}>Estimated Lead (NDA)</Text>
          <Text style={styles.statusTrend}>7-day trend: {constituencyData.trend}</Text>
        </View>
        
        <View style={styles.voteShareContainer}>
          <Text style={styles.voteShareTitle}>Constituency Vote Share</Text>
          <View style={styles.voteShareBar}>
            <View style={[styles.voteSegment, { flex: 46, backgroundColor: '#FF6B35' }]}>
              <Text style={styles.voteText}>NDA 46%</Text>
            </View>
            <View style={[styles.voteSegment, { flex: 40, backgroundColor: '#4ECDC4' }]}>
              <Text style={styles.voteText}>INDIA 40%</Text>
            </View>
            <View style={[styles.voteSegment, { flex: 8, backgroundColor: '#45B7D1' }]}>
              <Text style={styles.voteText}>JS 8%</Text>
            </View>
            <View style={[styles.voteSegment, { flex: 6, backgroundColor: '#96CEB4' }]}>
              <Text style={styles.voteText}>Other 6%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // Block Performance component
  const BlockPerformance = () => (
    <View style={styles.performanceSection}>
      <Text style={styles.sectionTitle}>Block Performance & Management</Text>
      
      <View style={styles.performanceHeader}>
        <Text style={styles.performanceHeaderText}>Block</Text>
        <Text style={styles.performanceHeaderText}>Lead/Lag</Text>
        <Text style={styles.performanceHeaderText}>Data Cov.</Text>
        <Text style={styles.performanceHeaderText}>Volunteers</Text>
        <Text style={styles.performanceHeaderText}>Top Issue</Text>
      </View>
      
      {constituencyData.blocks.map((block, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.performanceRow,
            { backgroundColor: block.status === 'losing' ? '#FEF2F2' : block.status === 'leading' ? '#F0FDF4' : '#FFFBEB' }
          ]}
          onPress={() => handleBlockDrillDown(block)}
        >
          <Text style={styles.performanceCell}>{block.name}</Text>
          <Text style={[
            styles.performanceCell,
            { 
              color: block.leadLag > 0 ? '#10B981' : '#EF4444',
              fontWeight: 'bold'
            }
          ]}>
            {block.leadLag > 0 ? '+' : ''}{block.leadLag}
            {block.status === 'losing' && <Text style={styles.alertText}> (Alert!)</Text>}
          </Text>
          <Text style={[
            styles.performanceCell,
            { color: block.dataCoverage < 80 ? '#EF4444' : '#10B981' }
          ]}>
            {block.dataCoverage}%
            {block.dataCoverage < 80 && <Text style={styles.lowText}> (Low!)</Text>}
          </Text>
          <Text style={[
            styles.performanceCell,
            { color: (block.volunteers.active / block.volunteers.total) < 0.8 ? '#EF4444' : '#10B981' }
          ]}>
            {block.volunteers.active}/{block.volunteers.total}
            {(block.volunteers.active / block.volunteers.total) < 0.8 && <Text style={styles.inactiveText}> (Low)</Text>}
          </Text>
          <Text style={styles.performanceCell}>{block.topIssue}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Tactical Insights component
  const TacticalInsights = () => (
    <View style={styles.tacticalSection}>
      <Text style={styles.sectionTitle}>Tactical Insights</Text>
      
      <View style={styles.tacticalGrid}>
        {/* Prabharis Needing Action */}
        <View style={styles.tacticalCard}>
          <Text style={styles.tacticalCardTitle}>Prabharis Needing Action</Text>
          {tacticalInsights.prabhrisNeedingAction.map((prabhari, index) => (
            <View key={index} style={styles.actionItem}>
              <Text style={styles.prabahriName}>{prabhari.name}</Text>
              <Text style={styles.prabahriBlock}>({prabhari.block})</Text>
              <Text style={styles.prabahriIssue}>{prabhari.issue}</Text>
            </View>
          ))}
        </View>

        {/* Voter Issues Hotspot */}
        <View style={styles.tacticalCard}>
          <Text style={styles.tacticalCardTitle}>Voter Issues Hotspot</Text>
          {tacticalInsights.voterIssuesHotspot.map((hotspot, index) => (
            <View key={index} style={styles.hotspotItem}>
              <Text style={styles.hotspotArea}>{hotspot.area}:</Text>
              <Text style={styles.hotspotIssue}>{hotspot.issue}</Text>
              <Text style={styles.hotspotPercentage}>({hotspot.percentage}%)</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Caste/Community Inclination */}
      <View style={styles.casteInclinationCard}>
        <Text style={styles.tacticalCardTitle}>Caste/Community Inclination (Top 3 Movers)</Text>
        {tacticalInsights.casteMovement.map((movement, index) => (
          <View key={index} style={styles.movementItem}>
            <Text style={styles.movementNumber}>{index + 1}.</Text>
            <Text style={styles.movementCommunity}>{movement.community}:</Text>
            <Text style={styles.movementText}>{movement.movement}</Text>
            <Text style={[
              styles.movementTrend,
              { 
                color: movement.trend === 'positive' ? '#10B981' : 
                      movement.trend === 'negative' ? '#EF4444' : '#6B7280' 
              }
            ]}>
              {movement.trend === 'positive' ? '▲' : movement.trend === 'negative' ? '▼' : '▶'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ReusableDashboard
        user={defaultPrabahriInfo}
        userType={USER_ROLES.VIDHAN_SABHA_PRABHARI}
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
        {/* Custom operational components */}
        <LivePoliticalStatus />
        <BlockPerformance />
        <TacticalInsights />
      </ReusableDashboard>
    </View>
  );
};

const styles = StyleSheet.create({
  politicalSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  performanceSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tacticalSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusCard: {
    alignItems: 'center',
    marginBottom: 15,
  },
  statusValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
  },
  statusLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 5,
  },
  statusTrend: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 2,
  },
  voteShareContainer: {
    marginTop: 10,
  },
  voteShareTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  voteShareBar: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
  voteSegment: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  alertText: {
    color: '#EF4444',
    fontSize: 10,
  },
  lowText: {
    color: '#EF4444',
    fontSize: 10,
  },
  inactiveText: {
    color: '#EF4444',
    fontSize: 10,
  },
  tacticalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  tacticalCard: {
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
  tacticalCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  actionItem: {
    marginBottom: 10,
  },
  prabahriName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  prabahriBlock: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  prabahriIssue: {
    fontSize: 10,
    color: '#374151',
    marginTop: 2,
  },
  hotspotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hotspotArea: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 5,
  },
  hotspotIssue: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  hotspotPercentage: {
    fontSize: 10,
    color: '#6B7280',
  },
  casteInclinationCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  movementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  movementNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 5,
  },
  movementCommunity: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 5,
  },
  movementText: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  movementTrend: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default VidhanSabhaDashboard;