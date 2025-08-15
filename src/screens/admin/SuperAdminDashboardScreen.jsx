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

// Text icons instead of lucide
const icons = {
  Users: '👥',
  MapPin: '📍',
  BarChart3: '📊',
  Plus: '➕',
  Globe: '🌐',
  FileText: '📄',
  Settings: '⚙️',
  TrendingUp: '📈',
  Shield: '🛡️',
  Database: '🗄️',
  Activity: '📊',
};

const SuperAdminDashboardScreen = ({ onLogout, onNavigate, onBack, currentScreen, onMenuPress }) => {
  const [dashboardData, setDashboardData] = useState({
    totalAdmins: 8,
    totalBoothBoys: 156,
    totalBooths: 342,
    totalConstituencies: 12,
    dataProgress: 85,
    activeToday: 45,
    recentActivities: [
      { id: 1, action: 'Admin "Rajesh Kumar" created 3 booth boys', time: '1h ago', type: 'success' },
      { id: 2, action: 'Data scraping completed for Constituency-5', time: '2h ago', type: 'info' },
      { id: 3, action: 'New admin "Priya Singh" registered', time: '4h ago', type: 'success' },
      { id: 4, action: 'Booth assignment updated in Zone-A', time: '6h ago', type: 'warning' },
    ]
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setDashboardData(prev => ({
        ...prev,
        activeToday: prev.activeToday + Math.floor(Math.random() * 10),
      }));
      setRefreshing(false);
    }, 1000);
  };

  const StatCard = ({ icon, title, value, color, onPress, subtitle }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.statCardContent}>
        <Text style={[styles.iconText, { color }]}>{icon}</Text>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ icon, title, description, color, onPress }) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
        <Text style={[styles.iconText, { color }]}>{icon}</Text>
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionDescription}>{description}</Text>
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
          <Text style={styles.greeting}>Super Admin Portal</Text>
          <Text style={styles.adminName}>System Overview</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          icon={icons.Shield}
          title="Total Admins"
          value={dashboardData.totalAdmins}
          color="#8B5CF6"
          subtitle="Across all constituencies"
          onPress={() => {}}
        />
        <StatCard
          icon={icons.Users}
          title="Total Booth Boys"
          value={dashboardData.totalBoothBoys}
          color="#3B82F6"
          subtitle="Created by all admins"
          onPress={() => {}}
        />
        <StatCard
          icon={icons.MapPin}
          title="Total Booths"
          value={dashboardData.totalBooths}
          color="#10B981"
          subtitle="Across all constituencies"
          onPress={() => {}}
        />
        <StatCard
          icon={icons.Globe}
          title="Constituencies"
          value={dashboardData.totalConstituencies}
          color="#F59E0B"
          subtitle="Under management"
          onPress={() => {}}
        />
        <StatCard
          icon={icons.BarChart3}
          title="Data Progress"
          value={`${dashboardData.dataProgress}%`}
          color="#EF4444"
          subtitle="Overall completion"
          onPress={() => {}}
        />
        <StatCard
          icon={icons.Activity}
          title="Active Today"
          value={dashboardData.activeToday}
          color="#06B6D4"
          subtitle="Users online"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Super Admin Actions</Text>
        <View style={styles.actionsGrid}>
          <QuickActionCard
            icon={icons.Plus}
            title="Create Admin"
            description="Add new admin user"
            color="#8B5CF6"
            onPress={() => onNavigate('createAdmin')}
          />
          <QuickActionCard
            icon={icons.MapPin}
            title="Assign Constituency"
            description="Manage admin areas"
            color="#10B981"
            onPress={() => onNavigate('assignConstituency')}
          />
          <QuickActionCard
            icon={icons.Database}
            title="Data Scraper"
            description="Scrape voter data"
            color="#F59E0B"
            onPress={() => onNavigate('dataScraper')}
          />
          <QuickActionCard
            icon={icons.FileText}
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
  statSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
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
  iconText: {
    fontSize: 24,
  },
});

export default SuperAdminDashboardScreen;