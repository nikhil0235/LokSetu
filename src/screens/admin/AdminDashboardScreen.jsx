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

const { width } = Dimensions.get('window');

const icons = {
  Users: '👥',
  MapPin: '📍',
  BarChart3: '📊',
  Plus: '➕',
  Globe: '🌐',
  FileText: '📄',
  Settings: '⚙️',
  TrendingUp: '📈',
};

const AdminDashboardScreen = ({ onLogout, onNavigate, onBack, currentScreen, onMenuPress }) => {
  const [dashboardData, setDashboardData] = useState({
    totalBoothBoys: 23,
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
        activeToday: prev.activeToday + Math.floor(Math.random() * 5),
      }));
      setRefreshing(false);
    }, 1000);
  };

  const StatCard = ({ icon, title, value, color, onPress }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.statCardContent}>
        <Text style={[styles.iconText, { color }]}>{icon}</Text>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ icon, title, color, onPress }) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
        <Text style={[styles.iconText, { color }]}>{icon}</Text>
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );

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
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.adminName}>Party Admin</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          icon={icons.Users}
          title="Total Booth Boys"
          value={dashboardData.totalBoothBoys}
          color="#3B82F6"
          onPress={() => {}}
        />
        <StatCard
          icon={icons.MapPin}
          title="Total Booths"
          value={dashboardData.totalBooths}
          color="#10B981"
          onPress={() => {}}
        />
        <StatCard
          icon={icons.BarChart3}
          title="Data Progress"
          value={`${dashboardData.dataProgress}%`}
          color="#F59E0B"
          onPress={() => {}}
        />
        <StatCard
          icon={icons.TrendingUp}
          title="Active Today"
          value={dashboardData.activeToday}
          color="#8B5CF6"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <QuickActionCard
            icon={icons.Plus}
            title="Create Booth Boy"
            color="#3B82F6"
            onPress={() => onNavigate('createBoothBoy')}
          />
          <QuickActionCard
            icon={icons.MapPin}
            title="Assign Booths"
            color="#10B981"
            onPress={() => onNavigate('assignBooths')}
          />
          <QuickActionCard
            icon={icons.Globe}
            title="Data Scraper"
            color="#F59E0B"
            onPress={() => onNavigate('dataScraper')}
          />
          <QuickActionCard
            icon={icons.FileText}
            title="Reports"
            color="#8B5CF6"
            onPress={() => onNavigate('reports')}
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
  menuIcon: {
    fontSize: 20,
    color: '#374151',
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
    padding: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
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
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statInfo: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
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
  iconText: {
    fontSize: 24,
  },
});

export default AdminDashboardScreen;