import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { AppIcon } from './index';
import MenuDrawer from './MenuDrawer';

const { width } = Dimensions.get('window');

const ReusableDashboard = ({
  user,
  userType,
  title,
  subtitle,
  stats = [],
  actions = [],
  activities = [],
  healthMetrics = [],
  onRefresh,
  onLogout,
  onMenuPress,
  refreshing = false,
  children,
  showMenu = false,
  menuItems = [],
  onNavigate = () => {},
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const StatCard = ({ iconName, title, value, color, onPress, subtitle }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
      <View style={styles.statHeader}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
          <AppIcon name={iconName} size={20} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );

  const QuickActionCard = ({ iconName, title, description, color, onPress }) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
        <AppIcon name={iconName} size={24} color={color} />
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



  const renderStatsGrid = () => {
    if (stats.length === 0) return null;

    const rows = [];
    for (let i = 0; i < stats.length; i += 2) {
      rows.push(stats.slice(i, i + 2));
    }

    return (
      <View style={styles.statsContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.statsRow}>
            {row.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderActionsGrid = () => {
    if (actions.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {actions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </View>
      </View>
    );
  };

  const renderActivities = () => {
    if (activities.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <View style={styles.activitiesContainer}>
          {activities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))}
        </View>
      </View>
    );
  };

  const renderHealthMetrics = () => {
    if (healthMetrics.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Health</Text>
        <View style={styles.healthCard}>
          {healthMetrics.map((metric, index) => (
            <View key={index} style={styles.healthMetric}>
              <Text style={styles.healthLabel}>{metric.label}</Text>
              <View style={styles.healthStatus}>
                <AppIcon name="circle" size={8} color={metric.color} />
                <Text style={[styles.healthText, { color: metric.color }]}>{metric.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <MenuDrawer
        visible={menuVisible && showMenu}
        onClose={() => setMenuVisible(false)}
        user={user}
        menuItems={menuItems}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      <ScrollView 
        style={styles.container}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {showMenu && (
            <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
              <AppIcon name="menu" size={28} color="#374151" />
            </TouchableOpacity>
          )}
          <View style={styles.headerCenter}>
            <Text style={styles.adminName}>{title}</Text>
            <Text style={styles.greeting}>{subtitle}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <View style={styles.logoutIconContainer}>
              <AppIcon name="power-settings-new" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        {renderStatsGrid()}

        {/* Actions Grid */}
        {renderActionsGrid()}

        {/* Activities */}
        {renderActivities()}

        {/* Health Metrics */}
        {renderHealthMetrics()}

        {/* Children for custom content */}
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 1,
  },
  menuButton: {
    marginRight: 15,
  },
  headerCenter: {
    flex: 1,
  },
  adminName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.3,
  },
  greeting: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '400',
  },
  logoutButton: {
    padding: 4,
  },
  logoutIconContainer: {
    backgroundColor: '#EF4444',
    borderRadius: 22,
    padding: 10,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flex: 1,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
  healthText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },

});

export default ReusableDashboard;