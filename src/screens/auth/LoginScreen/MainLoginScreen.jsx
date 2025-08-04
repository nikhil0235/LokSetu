import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import LoginCard from '../../../components/common/LoginCard';
import LoginOptionCard from '../../../components/Feature/LoginOptionCard';
import FeaturesSection from '../../../components/Feature/FeatureSection';
import IndianFlagDecoration from '../../../components/Feature/IndianFlagDecoration';

// const COLORS = {
//   PRIMARY: '#FF6B35',
//   SECONDARY: '#5856D6',
//   SUCCESS: '#34C759',
//   WARNING: '#FF9500',
//   ERROR: '#FF3B30',
//   BACKGROUND: '#F5F5F5',
//   WHITE: '#FFFFFF',
//   TEXT_PRIMARY: '#1C1C1E',
//   TEXT_SECONDARY: '#8E8E93',
// };

const MainLoginScreen = ({ onNavigate }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <LoginCard>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to LokSetu</Text>
          <Text style={styles.welcomeSubtitle}>
            Secure Digital Voting Platform
          </Text>
        </View>

        {/* Indian Flag Decoration */}
        <IndianFlagDecoration />

        {/* Login Options */}
        <View style={styles.loginOptionsContainer}>
          <Text style={styles.optionsTitle}>Select Login Method</Text>
          
          {/* Password Login Option */}
          <LoginOptionCard
            icon="🔐"
            title="User Login"
            subtitle="Use your username and password"
            colors={['#5856D6', '#a39621ff']}
            onPress={() => onNavigate('password')}
          />

             {/* Admin Login Option */}
          <LoginOptionCard
            icon="📱"
            title="Admin Login"
            subtitle="Access admin features"
            colors={['#ec5b21ff', '#ff2020ff']}
            onPress={() => onNavigate('adminlogin')}
          />
        </View>

        {/* Features Section */}
        <FeaturesSection />
      </LoginCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  loginOptionsContainer: {
    marginBottom: 30,
  },
  optionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default MainLoginScreen;