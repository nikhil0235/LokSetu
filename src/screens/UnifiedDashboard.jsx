import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReusableDashboard } from '../components/common';
import { getDashboardConfig, hasPermission } from '../config/userRoleConfig';
import { loadDashboardData } from '../store/slices/dashboardSlice';
import { loadAdminDashboardData } from '../store/slices/adminDashboardSlice';
import { logout } from '../store/authSlice';

const UnifiedDashboard = ({ onNavigate, onLogout, onMenuPress }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const { stats: superStats, loading: superLoading } = useSelector(state => state.dashboard);
  const { stats: adminStats, loading: adminLoading } = useSelector(state => state.adminDashboard);
  
  const [refreshing, setRefreshing] = useState(false);

  // Get appropriate stats based on user role
  const stats = user?.role === 'super_admin' ? superStats : adminStats;
  const loading = user?.role === 'super_admin' ? superLoading : adminLoading;

  // Get dashboard configuration for user role
  const dashboardConfig = getDashboardConfig(user?.role);

  useEffect(() => {
    // Load initial dashboard data
    if (user?.role === 'super_admin') {
      dispatch(loadDashboardData(false));
    } else {
      dispatch(loadAdminDashboardData(false));
    }
  }, [dispatch, user?.role]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (user?.role === 'super_admin') {
        await dispatch(loadDashboardData(true)).unwrap();
      } else {
        await dispatch(loadAdminDashboardData(true)).unwrap();
      }
    } catch (error) {
      console.log('Dashboard - Error loading data:', error);
    }
    setRefreshing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    if (onLogout) onLogout();
  };

  // Process stats data to match dashboard config
  const processedStats = dashboardConfig.stats.map(statConfig => ({
    ...statConfig,
    value: statConfig.value || stats[statConfig.key] || 0,
    onPress: () => {
      if (statConfig.onPress && onNavigate) {
        onNavigate(statConfig.onPress);
      }
    }
  }));

  // Process actions with navigation handlers
  const processedActions = dashboardConfig.actions.map(actionConfig => ({
    ...actionConfig,
    onPress: () => {
      if (actionConfig.onPress && onNavigate) {
        onNavigate(actionConfig.onPress);
      }
    }
  }));

  // Generate activities based on user role and stats
  const generateActivities = () => {
    const activities = [
      { 
        id: 1, 
        action: `${user?.full_name || user?.username}: ${dashboardConfig.title}`, 
        time: 'Now', 
        type: 'info' 
      }
    ];

    if (user?.role === 'super_admin') {
      activities.push(
        { id: 2, action: `${stats.totalAdmins || 0} admins in system`, time: 'Now', type: 'success' },
        { id: 3, action: `${stats.totalBoothBoys || 0} booth volunteers active`, time: 'Now', type: 'info' },
        { id: 4, action: `${stats.totalBooths || 0} booths available`, time: 'Now', type: 'success' }
      );
    } else if (user?.role === 'political_party' || user?.role === 'admin') {
      activities.push(
        { id: 2, action: `Created ${stats.totalCreatedUsers || 0} users`, time: 'Now', type: 'success' },
        { id: 3, action: `${stats.totalAssignedBooths || 0} booths assigned`, time: 'Now', type: 'info' },
        { id: 4, action: `${stats.totalAssignedConstituencies || 0} constituencies managed`, time: 'Now', type: 'success' }
      );
    } else {
      activities.push(
        { id: 2, action: 'Managing assigned areas', time: 'Now', type: 'info' },
        { id: 3, action: 'Voter data updated', time: '2 mins ago', type: 'success' },
        { id: 4, action: 'Reports generated', time: '5 mins ago', type: 'info' }
      );
    }

    return activities;
  };

  // Process menu items with permission checks
  const processedMenuItems = dashboardConfig.menuItems.filter(item => {
    // Add basic permission check here if needed
    return true; // For now, show all menu items
  }).map(item => ({
    ...item,
    onPress: () => {
      if (item.screen && onNavigate) {
        onNavigate(item.screen);
      }
    }
  }));

  return (
    <ReusableDashboard
      user={user}
      userType={user?.role}
      title={dashboardConfig.title}
      subtitle={dashboardConfig.subtitle}
      stats={processedStats}
      actions={processedActions}
      activities={generateActivities()}
      healthMetrics={dashboardConfig.healthMetrics || []}
      onRefresh={onRefresh}
      onLogout={handleLogout}
      onMenuPress={onMenuPress}
      refreshing={refreshing}
      showMenu={true}
      menuItems={processedMenuItems}
      onNavigate={onNavigate}
    />
  );
};

export default UnifiedDashboard;