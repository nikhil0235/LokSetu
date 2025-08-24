import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ReusableDashboard } from '../../components/common';
import { getDashboardConfig } from '../../config/userRoleConfig';
import { USER_ROLES } from '../../services/api/config';

const CandidateDashboard = ({ candidateInfo, onLogout, onMenuPress, onNavigate }) => {
  const [constituencyData, setConstituencyData] = useState({
    totalVoters: 280000,
    currentMargin: 5500,
    winProbability: 75,
    publicSentiment: 0.45,
    dataCompleteness: 85,
    volunteerActivity: 92,
    blocks: {
      khagaul: { lead: 3500, status: 'strong', color: '#10B981' },
      maner: { lead: 1800, status: 'moderate', color: '#F59E0B' },
      anandpur: { lead: 1400, status: 'weak', color: '#EF4444' },
      bihta: { lead: -1200, status: 'losing', color: '#DC2626' }
    }
  });

  const [voterIssues, setVoterIssues] = useState([
    { issue: 'Employment', percentage: 35, priority: 'high' },
    { issue: 'Road/Infrastructure', percentage: 25, priority: 'high' },
    { issue: 'Healthcare', percentage: 15, priority: 'medium' },
    { issue: 'Electricity', percentage: 12, priority: 'medium' },
    { issue: 'Water Supply', percentage: 8, priority: 'low' },
  ]);

  const [votingBloc, setVotingBloc] = useState([
    { community: 'EBC', trend: 'positive', shift: '+5%', description: 'Strong positive shift' },
    { community: 'Youth (18-25)', trend: 'negative', shift: '-3%', description: 'Sentiment trending negative' },
    { community: 'Yadav', trend: 'neutral', shift: '+2%', description: 'Slight positive shift' },
  ]);

  const defaultCandidateInfo = {
    id: 'CAND001',
    name: candidateInfo?.name || 'Asha Sinha',
    party: 'NDA',
    constituency: 'Danapur',
    phone: '+91 9876543210',
    role: 'candidate',
    ...candidateInfo
  };

  // Get dashboard configuration for candidate
  const dashboardConfig = getDashboardConfig(USER_ROLES.CANDIDATE);

  // Map actual stats to display values (read-only for candidate)
  const processedStats = dashboardConfig.stats.map(statConfig => {
    let value = 0;
    switch (statConfig.key) {
      case 'campaignEvents':
        value = 12;
        break;
      case 'supporters':
        value = 3200;
        break;
      case 'targetVoters':
        value = constituencyData.totalVoters;
        break;
      case 'progress':
        value = `${constituencyData.dataCompleteness}%`;
        break;
      default:
        value = statConfig.value || 0;
    }
    
    return {
      ...statConfig,
      value,
      onPress: () => {
        // Candidate has read-only access, show info instead of navigation
        console.log(`Viewing ${statConfig.title} details (Read-only)`);
      }
    };
  });

  // Map actions - all are read-only or informational for candidate
  const processedActions = dashboardConfig.actions.map(actionConfig => ({
    ...actionConfig,
    onPress: () => handleCandidateAction(actionConfig.onPress)
  }));

  const handleCandidateAction = (actionType) => {
    switch (actionType) {
      case 'campaign':
        console.log('View campaign activities');
        break;
      case 'supporters':
        console.log('View supporter analytics');
        break;
      case 'reports':
        console.log('View campaign reports');
        break;
      case 'settings':
        console.log('View candidate settings');
        break;
      default:
        console.log('Unknown candidate action:', actionType);
    }
  };

  const handleNavigation = (screen, params = null) => {
    switch (screen) {
      case 'campaign':
        console.log('Navigate to campaign management');
        break;
      case 'supporters':
        console.log('Navigate to supporters list');
        break;
      case 'voterList':
        console.log('Navigate to constituency voter list (read-only)');
        break;
      default:
        console.log('Unknown navigation:', screen);
    }
    onNavigate?.(screen, params);
  };

  // Generate activities for candidate
  const generateActivities = () => [
    { 
      id: 1, 
      action: `Current estimated margin: +${constituencyData.currentMargin.toLocaleString()} votes`, 
      time: 'Now', 
      type: constituencyData.currentMargin > 0 ? 'success' : 'warning'
    },
    { 
      id: 2, 
      action: `Win probability: ${constituencyData.winProbability}%`, 
      time: 'Now', 
      type: constituencyData.winProbability > 70 ? 'success' : 'info'
    },
    { 
      id: 3, 
      action: `Data completeness: ${constituencyData.dataCompleteness}%`, 
      time: 'Now', 
      type: constituencyData.dataCompleteness > 80 ? 'success' : 'warning'
    },
    { 
      id: 4, 
      action: `Volunteer activity: ${constituencyData.volunteerActivity}%`, 
      time: 'Now', 
      type: constituencyData.volunteerActivity > 90 ? 'success' : 'info'
    }
  ];

  // Custom title with candidate info
  const customTitle = `${defaultCandidateInfo.name}`;
  const customSubtitle = `Candidate Command Center - ${defaultCandidateInfo.constituency}`;

  // Custom strategic overview component
  const StrategicOverview = () => (
    <View style={styles.strategicSection}>
      <Text style={styles.sectionTitle}>Strategic Overview</Text>
      
      {/* Big Picture Metrics */}
      <View style={styles.bigPictureContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>+{constituencyData.currentMargin.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Estimated Margin</Text>
          <Text style={styles.metricTarget}>(Target: +15,000)</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{constituencyData.winProbability}%</Text>
          <Text style={styles.metricLabel}>Win Probability</Text>
          <Text style={styles.metricTrend}>Trend: ▲</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>Positive</Text>
          <Text style={styles.metricLabel}>Public Sentiment</Text>
          <Text style={styles.metricScore}>Score: +{constituencyData.publicSentiment}</Text>
        </View>
      </View>

      {/* Constituency Strength Map */}
      <View style={styles.strengthMapContainer}>
        <Text style={styles.subsectionTitle}>Constituency Strength Map</Text>
        <View style={styles.strengthGrid}>
          {Object.entries(constituencyData.blocks).map(([blockName, data]) => (
            <TouchableOpacity 
              key={blockName} 
              style={[styles.strengthBlock, { backgroundColor: data.color + '20', borderColor: data.color }]}
              onPress={() => console.log(`View ${blockName} details (Read-only)`)}
            >
              <Text style={styles.blockName}>{blockName.toUpperCase()}</Text>
              <Text style={[styles.blockLead, { color: data.color }]}>
                {data.lead > 0 ? '+' : ''}{data.lead}
              </Text>
              <Text style={styles.blockStatus}>{data.status}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  // Strategic briefing component
  const StrategicBriefing = () => (
    <View style={styles.briefingSection}>
      <Text style={styles.sectionTitle}>Strategic Briefing</Text>
      
      <View style={styles.briefingGrid}>
        {/* Key Voter Issues */}
        <View style={styles.briefingCard}>
          <Text style={styles.cardTitle}>Key Voter Issues (This Week)</Text>
          {voterIssues.slice(0, 3).map((issue, index) => (
            <View key={index} style={styles.issueItem}>
              <Text style={styles.issueNumber}>{index + 1}.</Text>
              <Text style={styles.issueText}>{issue.issue}</Text>
              <Text style={styles.issuePercentage}>({issue.percentage}%)</Text>
            </View>
          ))}
        </View>

        {/* Voting Bloc Momentum */}
        <View style={styles.briefingCard}>
          <Text style={styles.cardTitle}>Voting Bloc Momentum</Text>
          {votingBloc.map((bloc, index) => (
            <View key={index} style={styles.blocItem}>
              <Text style={styles.blocTrend}>
                {bloc.trend === 'positive' ? '▲' : bloc.trend === 'negative' ? '▼' : '▶'}
              </Text>
              <View style={styles.blocInfo}>
                <Text style={styles.blocCommunity}>{bloc.community}</Text>
                <Text style={styles.blocDescription}>{bloc.description}</Text>
              </View>
              <Text style={[
                styles.blocShift, 
                { color: bloc.trend === 'positive' ? '#10B981' : bloc.trend === 'negative' ? '#EF4444' : '#6B7280' }
              ]}>
                {bloc.shift}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Campaign Health & Risk */}
      <View style={styles.healthRiskContainer}>
        <View style={styles.healthCard}>
          <Text style={styles.cardTitle}>Campaign Health</Text>
          <View style={styles.healthItem}>
            <Text style={styles.healthIcon}>✅</Text>
            <Text style={styles.healthText}>Data Coverage: On Track ({constituencyData.dataCompleteness}%)</Text>
          </View>
          <View style={styles.healthItem}>
            <Text style={styles.healthIcon}>✅</Text>
            <Text style={styles.healthText}>Volunteer Activity: Strong ({constituencyData.volunteerActivity}%)</Text>
          </View>
          <View style={styles.healthItem}>
            <Text style={styles.healthIcon}>🚨</Text>
            <Text style={styles.healthText}>RISK: Turnout projection in Bihta block critically low</Text>
          </View>
        </View>

        <View style={styles.comparisonCard}>
          <Text style={styles.cardTitle}>vs. 2020 Election</Text>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Current Lead:</Text>
            <Text style={styles.comparisonValue}>+{constituencyData.currentMargin.toLocaleString()}</Text>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>2020 Result:</Text>
            <Text style={styles.comparisonValue}>+8,200 (Won)</Text>
          </View>
          <View style={styles.comparisonItem}>
            <Text style={styles.comparisonLabel}>Change:</Text>
            <Text style={[styles.comparisonValue, { color: '#EF4444' }]}>-2,700</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ReusableDashboard
        user={defaultCandidateInfo}
        userType={USER_ROLES.CANDIDATE}
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
        readonly={true} // Candidate has read-only access
      >
        {/* Custom strategic components */}
        <StrategicOverview />
        <StrategicBriefing />
      </ReusableDashboard>
    </View>
  );
};

const styles = StyleSheet.create({
  strategicSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  briefingSection: {
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
  bigPictureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
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
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  metricTarget: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  metricTrend: {
    fontSize: 10,
    color: '#10B981',
    marginTop: 2,
  },
  metricScore: {
    fontSize: 10,
    color: '#3B82F6',
    marginTop: 2,
  },
  strengthMapContainer: {
    marginBottom: 20,
  },
  strengthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  strengthBlock: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 10,
    alignItems: 'center',
  },
  blockName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  blockLead: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  blockStatus: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  briefingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  briefingCard: {
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
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 5,
  },
  issueText: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  issuePercentage: {
    fontSize: 10,
    color: '#6B7280',
  },
  blocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  blocTrend: {
    fontSize: 16,
    marginRight: 8,
  },
  blocInfo: {
    flex: 1,
  },
  blocCommunity: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  blocDescription: {
    fontSize: 10,
    color: '#6B7280',
  },
  blocShift: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  healthRiskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comparisonCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  healthText: {
    fontSize: 11,
    color: '#374151',
    flex: 1,
  },
  comparisonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  comparisonValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
});

export default CandidateDashboard;