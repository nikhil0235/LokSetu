// LokSetuLogin.js - Main Container Component
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Import components
import AppHeader from './components/common/AppHeader';
import AppFooter from './components/common/AppFooter';
import MainLoginScreen from './screens/auth/LoginScreen/MainLoginScreen';
import OTPLoginScreen from './screens/auth/LoginScreen/OTPLoginScreen';
import PasswordLoginScreen from './screens/auth/LoginScreen/PasswordLoginScreen';
import ForgotPasswordScreen from './screens/auth/LoginScreen/ForgotPasswordScreen';
import AdminLoginScreen from './screens/auth/LoginScreen/AdminLoginScreen';


const LokSetuLogin = () => {
  const [currentScreen, setCurrentScreen] = useState('main'); // 'main', 'password', 'otp'
  const [showHeader, setShowHeader] = useState(true);

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    phoneNumber: '',
    otp: '',
  });

  


  const updateLoginData = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const handleNavigation = (screenName) => {
    setCurrentScreen(screenName);
    setShowHeader(screenName === 'main');
  };

  // Render current screen based on state
  const renderCurrentScreen = () => {
    const screenProps = {
      onNavigate: handleNavigation,
      loginData,
      updateLoginData,
    };

    switch (currentScreen) {
      case 'password':
        return <PasswordLoginScreen {...screenProps} />;
      case 'otp':
        return <OTPLoginScreen {...screenProps} />;
      case 'forgotPassword' :
        return <ForgotPasswordScreen {...screenProps} />;
      case 'adminlogin':
        return <AdminLoginScreen {...screenProps} />;
      case 'voterList':
        const VoterList = require('./components/voter/VoterList').default;
        return <VoterList />;
      default:
        return <MainLoginScreen {...screenProps} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      
      {/* Header with Gradient */}
      {showHeader && <AppHeader />}


      {/* Main Content */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.mainContent}
      >
        {renderCurrentScreen()}
      </KeyboardAvoidingView>

      {/* Footer */}
      <AppFooter />
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 2,
    backgroundColor: '#F5F5F5',
  },
  mainContent: {
    flex: 1,
  },
});

export default LokSetuLogin;
