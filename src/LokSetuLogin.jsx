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
import UnifiedLoginScreen from './screens/auth/UnifiedLoginScreen';
import ForgotPasswordScreen from './screens/auth/LoginScreen/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/auth/LoginScreen/ResetPasswordScreen';


const LokSetuLogin = ({ onLoginSuccess, resetToken }) => {
  const [currentScreen, setCurrentScreen] = useState(resetToken ? 'resetPassword' : 'main'); // 'main', 'password', 'otp', 'resetPassword'
  const [showHeader, setShowHeader] = useState(true);
  const [selectedRole, setSelectedRole] = useState('super_admin');

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
      onLoginSuccess,
      selectedRole,
      setSelectedRole,
    };

    switch (currentScreen) {
      case 'login':
      case 'password':
      case 'otp':
        return <UnifiedLoginScreen {...screenProps} />;
      case 'forgotPassword' :
        return <ForgotPasswordScreen {...screenProps} />;
      case 'resetPassword':
        return <ResetPasswordScreen {...screenProps} resetToken={resetToken} />;
      default:
        return <MainLoginScreen {...screenProps} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      



      {/* Main Content */}
      <View style={styles.mainContent}>
        {renderCurrentScreen()}
      </View>


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
