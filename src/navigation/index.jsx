import React from 'react';
import { useSelector } from 'react-redux';
import LokSetuLogin from '../LokSetuLogin';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import SuperAdminDashboardScreen from '../screens/admin/SuperAdminDashboardScreen';
import { BoothBoyDashboard } from '../screens/boothboy';

export const AppNavigator = () => {
  const { user, token } = useSelector((state) => state.auth);
  
  // Check if user is authenticated
  if (!user || !token) {
    return <LokSetuLogin />;
  }

  // Route based on user role
  switch (user.role) {
    case 'super_admin':
    case 'Admin':
      return <SuperAdminDashboardScreen />;
    case 'admin':
      return <AdminDashboardScreen />;
    default:
      return <BoothBoyDashboard boothBoyInfo={user} />;
  }
};