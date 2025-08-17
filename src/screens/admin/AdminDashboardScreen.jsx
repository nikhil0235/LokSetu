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
import { AppIcon } from '../../components/common';

const { width } = Dimensions.get('window');

const AdminDashboardScreen = ({ onLogout, onNavigate, onBack, currentScreen, onMenuPress }) => {
  const { user } = useSelector(state => state.auth);
  const [dashboardData, setDashboardData] = useState({
    totalBoothBoys: user?.created_users?.length || 0,
    totalBooths: 45,
    dataProgress: 78,
    activeToday: 12,
    recentActivities: [
      { id: 1, action: 'Created booth boy "Suresh Patel"', time: '2h ago', type: 'success' },
      { id: 2, action: 'Assigned booth #145 to Meera Joshi', time: '4h ago', type: 'info' },
      { id: 3, action: 'Data export completed', time: '6h ago', type: 'success' },
      { id: 4, action: 'Booth boy "Ravi" went offline', time: '8h ago', type: 'warning' },
    ]
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setDashboardData(prev => ({
        ...prev,
        totalBoothBoys: user?.created_users?.length || 0,
        activeToday: prev.activeToday + Math.floor(Math.random() * 5),
      }));
      setRefreshing(false);
    }, 1000);
  };

  // Update booth boys count when user data changes
  useEffect(() => {
    setDashboardData(prev => ({
      ...prev,
      totalBoothBoys: user?.created_users?.length || 0,
    }));
  }, [user?.created_users]);

  const StatCard = ({ iconName, title, value, color, onPress }) => {
    return (
      <TouchableOpacity style={styles.statCard} onPress={onPress}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
          <AppIcon name={iconName} size={24} color={color} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const QuickActionCard = ({ iconName, title, description, color, onPress }) => {
    return (
      <TouchableOpacity style={[styles.actionCard, { borderColor: color + '30' }]} onPress={onPress}>
        <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
          <AppIcon name={iconName} size={28} color={color} />
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
          <AppIcon name="menu" size={28} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.adminName}>{user?.full_name || user?.username || 'Admin'}</Text>
          <Text style={styles.greeting}>Admin Dashboard & Controls</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <View style={styles.logoutIconContainer}>
            <AppIcon name="power-settings-new" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            iconName="group"
            title="Total Booth Boys"
            value={dashboardData.totalBoothBoys}
            color="#3B82F6"
            onPress={() => onNavigate('createdBoothBoys')}
          />
          <StatCard
            iconName="location-on"
            title="Total Booths"
            value={dashboardData.totalBooths}
            color="#10B981"
            onPress={() => onNavigate('boothList')}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            iconName="bar-chart"
            title="Data Progress"
            value={`${dashboardData.dataProgress}%`}
            color="#F59E0B"
            onPress={() => {}}
          />
          <StatCard
            iconName="online-prediction"
            title="Active Today"
            value={dashboardData.activeToday}
            color="#8B5CF6"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <QuickActionCard
            iconName="add"
            title="Create Booth Boy"
            description="Add new booth boy"
            color="#3B82F6"
            onPress={() => onNavigate('createBoothBoy')}
          />
          <QuickActionCard
            iconName="assignment"
            title="Assign Booths"
            description="Manage booth assignments"
            color="#10B981"
            onPress={() => onNavigate('assignBooths')}
          />
          <QuickActionCard
            iconName="assessment"
            title="Reports"
            description="View analytics"
            color="#8B5CF6"
            onPress={() => onNavigate('reports')}
          />
          <QuickActionCard
            iconName="settings"
            title="Settings"
            description="Admin preferences"
            color="#F59E0B"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <View style={styles.activitiesContainer}>
          {dashboardData.recentActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Collection Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Overall Progress</Text>
            <Text style={styles.progressPercentage}>{dashboardData.dataProgress}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${dashboardData.dataProgress}%` }
              ]} 
            />
          </View>
          <View style={styles.progressStats}>
            <Text style={styles.progressStat}>23 booth boys active</Text>
            <Text style={styles.progressStat}>45 booths assigned</Text>
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
    padding: 12,
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
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
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
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    fontSize: 12,
    color: '#6B7280',
  },

});

export default AdminDashboardScreen;