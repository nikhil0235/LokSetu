import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { AppIcon } from '../../components/common';
import { loadAdminDashboardData } from '../../store/slices/adminDashboardSlice';
import CreatedUsersScreen from './CreatedUsersScreen';
import CreateBoothBoyScreen from './CreateBoothBoyScreen';
import BoothAssignmentScreen from './BoothAssignmentScreen';
import { logout } from '../../store/authSlice';

const { width } = Dimensions.get('window');

const getRoleDisplayName = (userType) => {
  const roleNames = {
    'admin': 'Admin',
    'political_party': 'Political Party',
    'candidate': 'Candidate',
    'vidhan_sabha_prabhari': 'Vidhan Sabha Prabhari',
    'block_prabhari': 'Block Prabhari',
    'panchayat_prabhari': 'Panchayat Prabhari',
    'booth_volunteer': 'Booth Volunteer'
  };
  return roleNames[userType] || 'User';
};

const getRoleDashboardTitle = (userType) => {
  const dashboardTitles = {
    'admin': 'Admin Dashboard & Controls',
    'political_party': 'Political Party Dashboard',
    'candidate': 'Candidate Management Portal',
    'vidhan_sabha_prabhari': 'Vidhan Sabha Management',
    'block_prabhari': 'Block Level Management',
    'panchayat_prabhari': 'Panchayat Level Management',
    'booth_volunteer': 'Booth Operations Dashboard'
  };
  return dashboardTitles[userType] || 'Dashboard';
};

const AdminDashboardScreen = ({ userType = 'admin' }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { stats, adminInfo, loading, lastUpdated } = useSelector(state => state.adminDashboard);
  const [refreshing, setRefreshing] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-250))[0];

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    console.log('Admin user data:', JSON.stringify(user, null, 2));
    setRefreshing(false);
  };

  useEffect(() => {
    dispatch(loadAdminDashboardData(false));
  }, [dispatch]);

  useEffect(() => {
    const roleSpecificActivities = getRoleSpecificActivities(userType, stats, adminInfo, user);
    setRecentActivities(roleSpecificActivities);
  }, [stats, adminInfo, user, userType]);

  const getRoleSpecificActivities = (userType, stats, adminInfo, user) => {
    const baseActivities = [
      { id: 1, action: `${getRoleDisplayName(userType)}: ${adminInfo.fullname || user.fullname}`, time: 'Now', type: 'info' },
    ];
    
    if (userType === 'admin' || userType === 'political_party') {
      return [
        ...baseActivities,
        { id: 2, action: `Created ${stats.totalCreatedUsers} users`, time: 'Now', type: 'success' },
        { id: 3, action: `${stats.totalAssignedBooths} booths assigned`, time: 'Now', type: 'info' },
        { id: 4, action: `${stats.totalAssignedConstituencies} constituencies`, time: 'Now', type: 'success' },
      ];
    }
    
    return [
      ...baseActivities,
      { id: 2, action: `Managing assigned areas`, time: 'Now', type: 'info' },
      { id: 3, action: `Voter data updated`, time: '2 mins ago', type: 'success' },
      { id: 4, action: `Reports generated`, time: '5 mins ago', type: 'info' },
    ];
  };

  const getRoleSpecificActions = (userType) => {
    const commonActions = [
      {
        iconName: "assessment",
        title: "Reports",
        description: "View analytics",
        color: "#8B5CF6",
        onPress: () => handleNavigate('reports')
      },
      {
        iconName: "settings",
        title: "Settings",
        description: "User preferences",
        color: "#F59E0B",
        onPress: () => {}
      }
    ];

    switch (userType) {
      case 'admin':
      case 'political_party':
        return [
          {
            iconName: "add",
            title: "Create User",
            description: "Add new user",
            color: "#3B82F6",
            onPress: () => handleNavigate('createBoothBoy')
          },
          {
            iconName: "assignment",
            title: "Assign Booths",
            description: "Manage assignments",
            color: "#10B981",
            onPress: () => handleNavigate('assignBooths')
          },
          ...commonActions
        ];
      case 'candidate':
        return [
          {
            iconName: "campaign",
            title: "Campaign",
            description: "Manage campaign",
            color: "#3B82F6",
            onPress: () => {}
          },
          {
            iconName: "people",
            title: "Supporters",
            description: "View supporters",
            color: "#10B981",
            onPress: () => {}
          },
          ...commonActions
        ];
      default:
        return [
          {
            iconName: "location-on",
            title: "My Area",
            description: "Assigned area",
            color: "#3B82F6",
            onPress: () => {}
          },
          {
            iconName: "group",
            title: "Voters",
            description: "Manage voters",
            color: "#10B981",
            onPress: () => {}
          },
          ...commonActions
        ];
    }
  };

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

  // Handle different screen navigation
  if (currentScreen === 'createdUsers') {
    return (
      <CreatedUsersScreen 
        onBack={handleBack}
      />
    );
  }

  if (currentScreen === 'createBoothBoy') {
    return (
      <CreateBoothBoyScreen 
        onBack={handleBack}
      />
    );
  }

  if (currentScreen === 'assignBooths') {
    return (
      <BoothAssignmentScreen 
        onBack={handleBack}
      />
    );
  }

  const MenuDrawer = () => (
    <Modal
      visible={menuVisible}
      transparent={true}
      animationType="none"
      onRequestClose={() => setMenuVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackground} 
          onPress={() => setMenuVisible(false)}
        />
        <Animated.View 
          style={[styles.menuDrawer, { transform: [{ translateX: slideAnim }] }]}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Admin Menu</Text>
            <TouchableOpacity onPress={() => setMenuVisible(false)}>
              <AppIcon name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.menuContent}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => { setMenuVisible(false); handleNavigate('createdUsers'); }}
            >
              <AppIcon name="group" size={20} color="#3B82F6" />
              <Text style={styles.menuItemText}>Created Users</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => { setMenuVisible(false); handleNavigate('boothList'); }}
            >
              <AppIcon name="location-on" size={20} color="#10B981" />
              <Text style={styles.menuItemText}>Booth List</Text>
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => { setMenuVisible(false); handleNavigate('createBoothBoy'); }}
            >
              <AppIcon name="add" size={20} color="#3B82F6" />
              <Text style={styles.menuItemText}>Create Booth Boy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => { setMenuVisible(false); handleNavigate('assignBooths'); }}
            >
              <AppIcon name="assignment" size={20} color="#10B981" />
              <Text style={styles.menuItemText}>Assign Booths</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  useEffect(() => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [menuVisible]);

  return (
    <View style={{ flex: 1 }}>
      <MenuDrawer />
      <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <AppIcon name="menu" size={28} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.adminName}>{user?.full_name || user?.username || getRoleDisplayName(userType)}</Text>
          <Text style={styles.greeting}>{getRoleDashboardTitle(userType)}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutIconContainer}>
            <AppIcon name="power-settings-new" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            iconName="group"
            title="Created Users"
            value={stats.totalCreatedUsers}
            color="#3B82F6"
            onPress={() => handleNavigate('createdUsers')}
          />
          <StatCard
            iconName="location-on"
            title="Assigned Booths"
            value={stats.totalAssignedBooths}
            color="#10B981"
            onPress={() => handleNavigate('boothList')}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            iconName="public"
            title="Constituencies"
            value={stats.totalAssignedConstituencies}
            color="#F59E0B"
            onPress={() => {}}
          />
          <StatCard
            iconName="online-prediction"
            title="Last Updated"
            value={lastUpdated ? 'Now' : 'Never'}
            color="#8B5CF6"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {getRoleSpecificActions(userType).map((action, index) => (
            <QuickActionCard
              key={index}
              iconName={action.iconName}
              title={action.title}
              description={action.description}
              color={action.color}
              onPress={action.onPress}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <View style={styles.activitiesContainer}>
          {recentActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Summary</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Data Overview</Text>
            <Text style={styles.progressPercentage}>{stats.totalCreatedUsers + stats.totalAssignedBooths}</Text>
          </View>
          <View style={styles.progressStats}>
            <Text style={styles.progressStat}>{stats.totalCreatedUsers} users created</Text>
            <Text style={styles.progressStat}>{stats.totalAssignedBooths} booths assigned</Text>
          </View>
        </View>
      </View>
    </ScrollView>
    </View>
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
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
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