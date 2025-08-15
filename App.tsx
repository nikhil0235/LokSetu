import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import LoginScreen from './src/screens/auth/LoginScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import SuperAdminDashboardScreen from './src/screens/admin/SuperAdminDashboardScreen';
import CreateAdminScreen from './src/screens/admin/CreateAdminScreen';
import ConstituencyAssignmentScreen from './src/screens/admin/ConstituencyAssignmentScreen';
import ScrapperScreen from './src/screens/admin/ScrapperScreen';
import ReportScreen from './src/screens/admin/ReportScreen';
import CreateBoothBoyScreen from './src/screens/admin/CreateBoothBoyScreen';
import BoothAssignmentScreen from './src/screens/admin/BoothAssignmentScreen';
import { BoothBoyDashboard } from './src/screens/boothboy';
import SideDrawer from './src/components/common/SideDrawer';
import { View, Text, TouchableOpacity } from 'react-native';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [showDrawer, setShowDrawer] = useState(false);



  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('dashboard');
  };

  const handleNavigation = (screen) => {
    setCurrentScreen(screen);
    setShowDrawer(false);
  };

  const handleBack = () => {
    setCurrentScreen('dashboard');
  };

  const renderScreen = () => {
    if (!user) {
      return <LoginScreen onLoginSuccess={handleLogin} />;
    }



    // Handle sub-screens
    if (currentScreen !== 'dashboard') {
      const screenProps = { onBack: handleBack, onLogout: handleLogout, user };
      
      switch (currentScreen) {
        case 'createAdmin':
          return <CreateAdminScreen {...screenProps} />;
        case 'assignConstituency':
          return <ConstituencyAssignmentScreen {...screenProps} />;
        case 'dataScraper':
          return <ScrapperScreen {...screenProps} />;
        case 'systemReports':
          return <ReportScreen {...screenProps} />;
        case 'createBoothBoy':
          return <CreateBoothBoyScreen {...screenProps} />;
        case 'assignBooths':
          return <BoothAssignmentScreen {...screenProps} />;
        case 'reports':
          return <ReportScreen {...screenProps} />;
        default:
          return null;
      }
    }

    const navigationProps = {
      onLogout: handleLogout,
      onNavigate: handleNavigation,
      onBack: handleBack,
      onMenuPress: () => setShowDrawer(true),
      currentScreen,
      user
    };

    if (user.role === 'super_admin') {
      return <SuperAdminDashboardScreen {...navigationProps} />;
    } else if (user.role === 'admin') {
      return <AdminDashboardScreen {...navigationProps} />;
    } else {
      return <BoothBoyDashboard boothBoyInfo={user} onLogout={handleLogout} onMenuPress={() => setShowDrawer(true)} />;
    }
  };

  return (
    <Provider store={store}>
      {renderScreen()}
      <SideDrawer
        visible={showDrawer}
        onClose={() => setShowDrawer(false)}
        user={user}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />
    </Provider>
  );
};

export default App;