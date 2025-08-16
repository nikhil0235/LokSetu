import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
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

const MainLoginScreen = ({ onNavigate, selectedRole, setSelectedRole }) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles = [
    { id: 'super_admin', name: 'Super Admin', icon: '🛡️', color: '#8B5CF6' },
    { id: 'admin', name: 'Admin', icon: '👥', color: '#3B82F6' },
    { id: 'booth_boy', name: 'Booth Boy', icon: '👤', color: '#10B981' }
  ];

  const selectedRoleData = roles.find(role => role.id === selectedRole);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
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

        {/* Role Selection */}
        <View style={styles.roleSection}>
          <Text style={styles.sectionTitle}>Select User Type</Text>
          <TouchableOpacity
            style={styles.roleSelector}
            onPress={() => setShowRoleDropdown(!showRoleDropdown)}
          >
            <View style={styles.roleDisplay}>
              <Text style={[styles.roleIcon, { color: selectedRoleData?.color }]}>{selectedRoleData?.icon}</Text>
              <Text style={styles.roleName}>{selectedRoleData?.name}</Text>
            </View>
            <Text style={styles.chevron}>▼</Text>
          </TouchableOpacity>
          {showRoleDropdown && (
            <View style={styles.dropdownContainer}>
              <View style={styles.dropdown}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.id}
                    style={styles.roleOption}
                    onPress={() => {
                      setSelectedRole(role.id);
                      setShowRoleDropdown(false);
                    }}
                  >
                    <Text style={[styles.roleIcon, { color: role.color }]}>{role.icon}</Text>
                    <Text style={styles.roleOptionName}>{role.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Login Button */}
        <View style={styles.loginButtonContainer}>
          {selectedRole === 'super_admin' && (
            <LoginOptionCard
              icon="🛡️"
              title="Super Admin Login"
              subtitle="Full system access"
              colors={['#8B5CF6', '#7C3AED']}
              onPress={() => onNavigate('adminlogin')}
            />
          )}
          
          {selectedRole === 'admin' && (
            <LoginOptionCard
              icon="👥"
              title="Admin Login"
              subtitle="Administrative access"
              colors={['#3B82F6', '#2563EB']}
              onPress={() => onNavigate('adminlogin')}
            />
          )}
          
          {selectedRole === 'booth_boy' && (
            <LoginOptionCard
              icon="👤"
              title="Booth Boy Login"
              subtitle="Access booth management"
              colors={['#10B981', '#059669']}
              onPress={() => onNavigate('password')}
            />
          )}
        </View>

        {/* Features Section */}
        <FeaturesSection />
      </LoginCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 19,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  loginButtonContainer: {
    marginBottom: 30,
  },

  roleSection: {
    marginBottom: 25,
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  roleDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  roleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  chevron: {
    fontSize: 12,
    color: '#8E8E93',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 0,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  roleOptionName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1C1C1E',
  },
});

export default MainLoginScreen;