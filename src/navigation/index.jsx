import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import LoginScreen from '../screens/auth/LoginScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import SuperAdminDashboardScreen from '../screens/admin/SuperAdminDashboardScreen';

// Simple Booth Boy Dashboard
const BoothBoyDashboard = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>Booth Boy Dashboard</Text>
    <Text style={{ fontSize: 16, color: '#6B7280' }}>Voter data collection interface</Text>
  </View>
);

export const AppNavigator = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (user?.role === 'super_admin') {
    return <SuperAdminDashboardScreen />;
  } else if (user?.role === 'admin') {
    return <AdminDashboardScreen />;
  } else {
    return <BoothBoyDashboard />;
  }
};