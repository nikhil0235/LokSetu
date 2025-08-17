import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useApiService } from '../../hooks/useApiService';
import { apiClient } from '../../services/api/client';

const { width } = Dimensions.get('window');

const SuperAdminDashboardScreen = ({ onLogout, onNavigate, onBack, currentScreen, onMenuPress }) => {
  const { user, token } = useSelector(state => state.auth);
  const { getUsers, getVoters, getPollingBooths, loading } = useApiService();
  const [dashboardData, setDashboardData] = useState({
    totalAdmins: 0,
    totalBoothBoys: 0,
    totalBooths: 0,
    totalVoters: 0,
    allUsers: [],
    allVoters: [],
    recentActivities: []
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    console.log('Dashboard - Loading data, token:', token);
    try {
      const [usersData, votersData] = await Promise.all([
        getUsers(),
        getVoters()
      ]);
      
      // Load booths with body data
      const boothsData = await apiClient.get('/general/booths', token, {
        state_id: 'S04',
        district_id: 'S0429',
        assembly_id: '195'
      });
      
      console.log('Dashboard - Users data:', usersData?.length);
      console.log('Dashboard - Voters data:', votersData?.length);
      console.log('Dashboard - Booths data:', boothsData?.length);
      
      const admins = usersData?.filter(u => u.role === 'admin' || u.role === 'super_admin') || [];
      const boothBoys = usersData?.filter(u => u.role === 'booth_boy' || u.role === 'boothboy') || [];
      
      setDashboardData({
        totalAdmins: admins.length,
        totalBoothBoys: boothBoys.length,
        totalBooths: boothsData?.length || 0,
        totalVoters: votersData?.length || 0,
        allUsers: usersData || [],
        allVoters: votersData || [],
        recentActivities: [
          { id: 1, action: `${admins.length} admins in system`, time: 'Now', type: 'info' },
          { id: 2, action: `${boothBoys.length} booth boys active`, time: 'Now', type: 'success' },
          { id: 3, action: `${boothsData?.length || 0} booths available`, time: 'Now', type: 'info' }
        ]
      });
    } catch (error) {
      console.log('Dashboard - Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const StatCard = ({ iconName, iconFamily = 'MaterialIcons', title, value, color, onPress }) => {
    const IconComponent = iconFamily === 'Feather' ? FeatherIcon : Icon;
    return (
      <TouchableOpacity style={styles.statCard} onPress={onPress}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
          <IconComponent name={iconName} size={24} color={color} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const QuickActionCard = ({ iconName, iconFamily = 'MaterialIcons', title, description, color, onPress }) => {
    const IconComponent = iconFamily === 'Feather' ? FeatherIcon : Icon;
    return (
      <TouchableOpacity style={[styles.actionCard, { borderColor: color + '30' }]} onPress={onPress}>
        <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
          <IconComponent name={iconName} size={28} color={color} />
        </View>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </TouchableOpacity>
    );
  };

  const ActivityItem = ({ activity }) => {
    const getActivityColor = (type) => {
      switch (type) {
        case 'success': return '#10B981';
        case 'warning': return '#F59E0B';
        case 'error': return '#EF4444';
        default: return '#3B82F6';
      }
    };

    return (
      <View style={styles.activityItem}>
        <View style={[styles.activityDot, { backgroundColor: getActivityColor(activity.type) }]} />
        <View style={styles.activityContent}>
          <Text style={styles.activityText}>{activity.action}</Text>
          <Text style={styles.activityTime}>{activity.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Icon name="menu" size={28} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.adminName}>Super Admin Portal</Text>
          <Text style={styles.greeting}>System Overview & Analytics</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <View style={styles.logoutIconContainer}>
            <Icon name="power-settings-new" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            iconName="admin-panel-settings"
            title="Total Admins"
            value={dashboardData.totalAdmins}
            color="#8B5CF6"
            onPress={() => onNavigate('allAdmins')}
          />
          <StatCard
            iconName="group"
            title="Total Booth Boys"
            value={dashboardData.totalBoothBoys}
            color="#3B82F6"
            onPress={() => onNavigate('allBoothBoys')}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            iconName="location-on"
            title="Total Booths"
            value={dashboardData.totalBooths}
            color="#10B981"
            onPress={() => onNavigate('boothSelection')}
          />
          <StatCard
            iconName="public"
            title="Constituencies"
            value={dashboardData.totalConstituencies}
            color="#F59E0B"
            onPress={() => {}}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            iconName="bar-chart"
            title="Data Progress"
            value={`${dashboardData.dataProgress}%`}
            color="#EF4444"
            onPress={() => {}}
          />
          <StatCard
            iconName="online-prediction"
            title="Active Today"
            value={dashboardData.activeToday}
            color="#06B6D4"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Super Admin Actions</Text>
        <View style={styles.actionsGrid}>
          <QuickActionCard
            iconName="add"
            title="Create Admin"
            description="Add new admin user"
            color="#8B5CF6"
            onPress={() => onNavigate('createAdmin')}
          />
          <QuickActionCard
            iconName="assignment"
            title="Assign Constituency"
            description="Manage admin areas"
            color="#10B981"
            onPress={() => onNavigate('assignConstituency')}
          />
          <QuickActionCard
            iconName="storage"
            title="Data Scraper"
            description="Scrape voter data"
            color="#F59E0B"
            onPress={() => onNavigate('dataScraper')}
          />
          <QuickActionCard
            iconName="assessment"
            title="System Reports"
            description="View all reports"
            color="#EF4444"
            onPress={() => onNavigate('systemReports')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Activities</Text>
        <View style={styles.activitiesContainer}>
          {dashboardData.recentActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Health</Text>
        <View style={styles.healthCard}>
          <View style={styles.healthMetric}>
            <Text style={styles.healthLabel}>Database Status</Text>
            <View style={styles.healthStatus}>
              <View style={[styles.healthDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.healthText, { color: '#10B981' }]}>Online</Text>
            </View>
          </View>
          <View style={styles.healthMetric}>
            <Text style={styles.healthLabel}>API Status</Text>
            <View style={styles.healthStatus}>
              <View style={[styles.healthDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.healthText, { color: '#10B981' }]}>Healthy</Text>
            </View>
          </View>
          <View style={styles.healthMetric}>
            <Text style={styles.healthLabel}>Scraper Status</Text>
            <View style={styles.healthStatus}>
              <View style={[styles.healthDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.healthText, { color: '#F59E0B' }]}>Running</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
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
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  menuButton: {
    marginRight: 15,
  },

  headerCenter: {
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  backIcon: {
    fontSize: 20,
    color: '#374151',
  },
  logoutButton: {
    padding: 4,
  },
  logoutIconContainer: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  adminName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  settingsIcon: {
    fontSize: 24,
    color: '#6B7280',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  activitiesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  healthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthLabel: {
    fontSize: 14,
    color: '#374151',
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  healthText: {
    fontSize: 12,
    fontWeight: '500',
  },

});

export default SuperAdminDashboardScreen;