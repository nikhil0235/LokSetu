import React from 'react';
import { useSelector } from 'react-redux';
import LokSetuLogin from '../LokSetuLogin';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import SuperAdminDashboardScreen from '../screens/admin/SuperAdminDashboardScreen';
import { BoothBoyDashboard } from '../screens/boothboy';
import { USER_ROLES } from '../services/api/config';

export const AppNavigator = () => {
  const { user, token } = useSelector((state) => state.auth);
  
  // Check if user is authenticated
  if (!user || !token) {
    return <LokSetuLogin />;
  }

  // Route based on user role
  switch (user.role) {
    case USER_ROLES.SUPER_ADMIN:
      return <SuperAdminDashboardScreen />;
    case USER_ROLES.ADMIN:
      return <AdminDashboardScreen />;
    case USER_ROLES.BOOTH_BOY:
    default:
      return <BoothBoyDashboard boothBoyInfo={user} />;
  }
};