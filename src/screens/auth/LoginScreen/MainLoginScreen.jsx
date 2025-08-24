import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
  const [showWelcome, setShowWelcome] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!showWelcome) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ]).start();
      
      // Start pulse animation for button
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [showWelcome]);

  const roles = [
    { 
      id: 'super_admin', 
      name: 'Super Admin', 
      icon: '🛡️', 
      color: '#8B5CF6',
      description: 'Complete system control & management',
      permissions: ['System Management', 'User Creation', 'Data Analytics']
    },
    { 
      id: 'admin', 
      name: 'Admin', 
      icon: '👥', 
      color: '#3B82F6',
      description: 'Constituency & booth management',
      permissions: ['Booth Management', 'Voter Data', 'Reports']
    },
    { 
      id: 'booth_boy', 
      name: 'Booth Boy', 
      icon: '👤', 
      color: '#10B981',
      description: 'Booth operations & voter assistance',
      permissions: ['Voter Registration', 'Data Collection', 'Field Operations']
    }
  ];

  const selectedRoleData = roles.find(role => role.id === selectedRole);

  if (showWelcome) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.welcomeContainer}>
        <View style={styles.welcomeContent}>
          <View style={styles.heroSection}>
            <Text style={styles.heroEmoji}>🏛️</Text>
            <Text style={styles.heroTitle}>Digital Democracy</Text>
            <Text style={styles.heroSubtitle}>Powering India's Elections</Text>
          </View>
          
          <View style={styles.trustSection}>
            <View style={styles.trustBadgeContainer}>
              <Text style={styles.trustBadge}>🛡️ Government Certified</Text>
            </View>
            <Text style={styles.trustText}>
              Secure platform for democratic processes across India
            </Text>
            <View style={styles.securityFeatures}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🔒</Text>
                <Text style={styles.featureText}>End-to-End Encryption</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📱</Text>
                <Text style={styles.featureText}>Biometric Authentication</Text>
              </View>
            </View>
          </View>

          <View style={styles.quickStats}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statValue}>500+</Text>
              <Text style={styles.statDesc}>Constituencies</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>👥</Text>
              <Text style={styles.statValue}>10K+</Text>
              <Text style={styles.statDesc}>Officials</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.continueBtn}
            onPress={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setShowWelcome(false);
                setIsTransitioning(false);
              }, 300);
            }}
            disabled={isTransitioning}
          >
            <LinearGradient colors={['#FF6B35', '#F7931E']} style={styles.btnGradient}>
              <Text style={styles.btnText}>{isTransitioning ? 'Loading...' : 'Start Secure Login'}</Text>
              {!isTransitioning && <Text style={styles.btnArrow}>→</Text>}
              {isTransitioning && <Text style={styles.btnArrow}>⏳</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }
  return (
    <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} style={styles.container}>
      <View style={styles.safeArea}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoBox}>
            <Text style={styles.flagEmoji}>🇮🇳</Text>
          </View>
          <Text style={styles.brandName}>LokSetu</Text>
          <Text style={styles.brandTagline}>Digital Election Platform</Text>
        </View>

        {/* Login Card */}
        <Animated.View style={[styles.loginCard, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <View style={styles.glassOverlay} />
          <View style={styles.cardHeader}>
            <View style={styles.titleRow}>
              <Text style={styles.cardTitle}>Welcome Back</Text>
              <View style={styles.securityIcon}>
                <Text style={styles.shieldIcon}>🛡️</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>Choose your access level to continue</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.fieldLabel}>Select Role</Text>
            <TouchableOpacity
              style={[
                styles.roleButton,
                { borderColor: selectedRoleData?.color + '40' }
              ]}
              onPress={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.roleGradient}
              >
                <View style={styles.roleContent}>
                  <View style={[styles.roleIconBox, { 
                    backgroundColor: selectedRoleData?.color + '15',
                    borderColor: selectedRoleData?.color + '30',
                    borderWidth: 1
                  }]}>
                    <Text style={[styles.roleIconText, { color: selectedRoleData?.color }]}>
                      {selectedRoleData?.icon}
                    </Text>
                  </View>
                  <View style={styles.roleTextBox}>
                    <Text style={styles.roleTitle}>{selectedRoleData?.name}</Text>
                    <Text style={styles.roleSubtitle}>{selectedRoleData?.description}</Text>
                  </View>
                </View>
                <Text style={[styles.dropdownIcon, { color: selectedRoleData?.color }]}>▼</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {showRoleDropdown && (
              <View style={styles.dropdownOverlay}>
                <ScrollView style={styles.dropdown} showsVerticalScrollIndicator={false}>
                  {roles.map((role, index) => (
                    <TouchableOpacity
                      key={role.id}
                      style={[
                        styles.dropdownItem,
                        index === roles.length - 1 && styles.lastDropdownItem,
                        selectedRole === role.id && {
                          backgroundColor: role.color + '15'
                        }
                      ]}
                      onPress={() => {
                        setSelectedRole(role.id);
                        setShowRoleDropdown(false);
                      }}
                    >
                      <View style={[styles.dropdownIconBox, { 
                        backgroundColor: role.color + '20',
                        borderColor: role.color + '30',
                        borderWidth: 1
                      }]}>
                        <Text style={[styles.dropdownIconText, { color: role.color }]}>{role.icon}</Text>
                      </View>
                      <View style={styles.dropdownTextBox}>
                        <Text style={styles.dropdownTitle}>{role.name}</Text>
                        <Text style={styles.dropdownSubtitle}>{role.description}</Text>
                        <View style={styles.permissionsContainer}>
                          {role.permissions.slice(0, 2).map((permission, idx) => (
                            <Text key={idx} style={[styles.permissionTag, { backgroundColor: role.color + '15', color: role.color }]}>
                              {permission}
                            </Text>
                          ))}
                        </View>
                      </View>
                      {selectedRole === role.id && (
                        <Text style={[styles.checkIcon, { color: role.color }]}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

         { !showRoleDropdown && 
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => onNavigate('login')}
            >
            <LinearGradient 
              colors={[
                selectedRoleData?.color || '#667eea',
                selectedRoleData?.id === 'super_admin' ? '#8B5CF6' : 
                selectedRoleData?.id === 'admin' ? '#3B82F6' : '#10B981',
                '#667eea'
              ]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Continue as {selectedRoleData?.name}</Text>
            </LinearGradient>
            </TouchableOpacity>
          </Animated.View> }

          <View style={styles.securityBadge}>
            <Text style={styles.badgeText}>🇮🇳 Trusted by Indian Government</Text>
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: 60,
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  logoBox: {
    width: 75,
    height: 75,
    borderRadius: 37,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  flagEmoji: {
    fontSize: 35,
  },
  brandName: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 5,
    letterSpacing: -1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  brandTagline: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loginCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingTop: 35,
    elevation: 25,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: -15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    position: 'relative',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  cardHeader: {
    marginBottom: 35,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginRight: 12,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  securityIcon: {
    width: 35,
    height: 35,
    borderRadius: 17,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  shieldIcon: {
    fontSize: 16,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 15,
    marginBottom: 25,
    elevation: 10,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
  },
  buttonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  securityBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    marginHorizontal: -30,
    paddingHorizontal: 30,
    marginTop: 'auto',
  },
  badgeText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },

  formSection: {
    marginBottom: 25,
    position: 'relative',
    zIndex: 1,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  roleButton: {
    borderRadius: 16,
    borderWidth: 2,
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  roleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  roleIconText: {
    fontSize: 22,
  },
  roleTextBox: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 1,
  },
  roleSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  dropdownIcon: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: '#ffffffff',
    borderRadius: 16,
    marginTop: 4,
    maxHeight: 300,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dropdownIconText: {
    fontSize: 20,
  },
  dropdownTextBox: {
    flex: 1,
  },
  dropdownTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 1,
  },
  dropdownSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  // Welcome Screen Styles
  welcomeContainer: {
    flex: 1,
  },
  welcomeContent: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 70,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  trustSection: {
    alignItems: 'center',
  },
  trustBadgeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  trustBadge: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  trustText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 120,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statDesc: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  continueBtn: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  btnArrow: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  securityFeatures: {
    marginTop: 20,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.9,
  },
  permissionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 4,
  },
  permissionTag: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },

});

export default MainLoginScreen;