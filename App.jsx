import React, { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Linking } from 'react-native';
import { store } from './src/store';
import { logout, setAuthData } from './src/store/authSlice';
import { storage } from './src/utils/storage';
import { parseResetToken, isResetPasswordLink } from './src/utils/deepLinking';
import LokSetuLogin from './src/LokSetuLogin';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import SuperAdminDashboardScreen from './src/screens/admin/SuperAdminDashboardScreen';
import CreateAdminScreen from './src/screens/admin/CreateAdminScreen';
import ConstituencyAssignmentScreen from './src/screens/admin/ConstituencyAssignmentScreen';
import ScrapperScreen from './src/screens/admin/ScrapperScreen';
import ReportScreen from './src/screens/admin/ReportScreen';
import CreateBoothBoyScreen from './src/screens/admin/CreateBoothBoyScreen';
import BoothAssignmentScreen from './src/screens/admin/BoothAssignmentScreen';
import CreatedBoothBoysScreen from './src/screens/admin/CreatedBoothBoysScreen';
import AllAdminsScreen from './src/screens/admin/AllAdminsScreen';
import AllBoothBoysScreen from './src/screens/admin/AllBoothBoysScreen';
import BoothListScreen from './src/screens/admin/BoothListScreen';
import BoothSelectionScreen from './src/screens/admin/BoothSelectionScreen';
import ConstituenciesListScreen from './src/screens/ConstituenciesListScreen';
import { BoothBoyDashboard } from './src/screens/boothboy';
import SideDrawer from './src/components/common/SideDrawer';
import SplashScreen from './src/components/common/SplashScreen';
import { View, Text, TouchableOpacity } from 'react-native';

const AppContent = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [resetToken, setResetToken] = useState(null);

  useEffect(() => {
    const loadStoredAuth = async () => {
      const storedToken = await storage.getToken();
      const storedUser = await storage.getUserData();

      if (storedToken && storedUser) {
        dispatch(setAuthData({ token: storedToken, user: storedUser }));
      }
    };
    
    const handleDeepLink = (url) => {
      if (url && isResetPasswordLink(url)) {
        const token = parseResetToken(url);
        if (token) {
          setResetToken(token);
          // Force logout to show login screen with reset password
          dispatch(logout());
        }
      }
    };

    // Handle initial URL if app was opened via deep link
    Linking.getInitialURL().then(handleDeepLink);

    // Handle deep links when app is already running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    loadStoredAuth();

    return () => subscription?.remove();
  }, [dispatch]);

  const handleLogin = (userData) => {
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    dispatch(logout());
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
    if (showSplash) {
      return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    if (!user) {
      return <LokSetuLogin onLoginSuccess={handleLogin} resetToken={resetToken} />;
    }

    // Handle sub-screens
    if (currentScreen !== 'dashboard') {
      const screenProps = { onBack: handleBack, onLogout: handleLogout, user };
      
      switch (currentScreen) {
        case 'createAdmin':
          return <CreateAdminScreen {...screenProps} />;
        case 'assignConstituency':
          return <ConstituencyAssignmentScreen {...screenProps} />;

        case 'systemReports':
          return <ReportScreen {...screenProps} />;
        case 'createBoothBoy':
          return <CreateBoothBoyScreen {...screenProps} />;
        case 'assignBooths':
          return <BoothAssignmentScreen {...screenProps} />;
        case 'reports':
          return <ReportScreen {...screenProps} />;
        case 'createdBoothBoys':
          return <CreatedBoothBoysScreen {...screenProps} />;
        case 'allAdmins':
          return <AllAdminsScreen {...screenProps} />;
        case 'allBoothBoys':
          return <AllBoothBoysScreen {...screenProps} />;
        case 'boothList':
          return <BoothListScreen {...screenProps} />;
        case 'boothSelection':
          return <BoothSelectionScreen {...screenProps} />;
        case 'constituenciesList':
          return <ConstituenciesListScreen {...screenProps} />;
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
    {console.log("User Role:", user.role)}
    switch (user.role) {
      case 'super_admin':
      case 'Admin':
        return <SuperAdminDashboardScreen {...navigationProps} />;
      case 'admin':
        return <AdminDashboardScreen {...navigationProps} />;
      case 'booth_boy':
      case 'boothboy':
        return <BoothBoyDashboard boothBoyInfo={user} onLogout={handleLogout} onMenuPress={() => setShowDrawer(true)} />;
      default:
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Unauthorized User Role: {user.role}</Text></View>;
    }
  };

  return (
    <>
      {renderScreen()}
      {user && showDrawer && 
        <SideDrawer
          visible={showDrawer}
          onClose={() => setShowDrawer(false)}
          user={user}
          onNavigate={handleNavigation}
          onLogout={handleLogout} 
        />
      }
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;