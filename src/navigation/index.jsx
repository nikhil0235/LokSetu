import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LokSetuLogin from '../LokSetuLogin';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import SuperAdminDashboardScreen from '../screens/admin/SuperAdminDashboardScreen';
import { BoothBoyDashboard } from '../screens/boothboy';
import { MenuDrawer } from '../components/common';
import { getDashboardConfig } from '../config/userRoleConfig';
import { logout } from '../store/authSlice';
import { USER_ROLES } from '../services/api/config';

const BoothBoyDashboardWrapper = ({ user }) => {
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  
  const dashboardConfig = getDashboardConfig(USER_ROLES.BOOTH_VOLUNTEER);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const handleNavigation = (screen) => {
    console.log('Navigation to:', screen);
  };
  
  return (
    <>
      <BoothBoyDashboard 
        boothBoyInfo={user} 
        onMenuPress={() => setMenuVisible(true)}
      />
      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        user={user}
        menuItems={dashboardConfig.menuItems}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />
    </>
  );
};

const getRoleDashboard = (userRole, user) => {
  console.log('🔍 Routing user with role:', userRole);
  
  switch (userRole) {
    case USER_ROLES.SUPER_ADMIN:
    case 'super_admin':
      return <SuperAdminDashboardScreen />;
    case 'admin':
    case 'Admin':
      return <AdminDashboardScreen userType="admin" />;
    case USER_ROLES.POLITICAL_PARTY:
      return <AdminDashboardScreen userType="political_party" />;
    case USER_ROLES.CANDIDATE:
      return <AdminDashboardScreen userType="candidate" />;
    case USER_ROLES.VIDHAN_SABHA_PRABHARI:
      return <AdminDashboardScreen userType="vidhan_sabha_prabhari" />;
    case USER_ROLES.BLOCK_PRABHARI:
      return <AdminDashboardScreen userType="block_prabhari" />;
    case USER_ROLES.PANCHAYAT_PRABHARI:
      return <AdminDashboardScreen userType="panchayat_prabhari" />;
    case USER_ROLES.BOOTH_VOLUNTEER:
    case 'booth_boy':
    case 'boothboy':
    case 'booth_volunteer':
    default:
      console.log('🏢 Routing to BoothBoyDashboard for role:', userRole);
      return <BoothBoyDashboardWrapper user={user} />;
  }
};

export const AppNavigator = () => {
  const { user, token } = useSelector((state) => state.auth);
  
  console.log('🚀 AppNavigator - User:', user?.username, 'Role:', user?.role, 'Token:', !!token);
  
  // Go directly to login, skip welcome screen
  if (!user || !token) {
    return <LokSetuLogin />;
  }

  // Route based on user role
  return getRoleDashboard(user.role, user);
};