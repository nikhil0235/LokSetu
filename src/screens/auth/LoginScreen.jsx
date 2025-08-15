import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/base';
import { loginUser } from '../../store/slices/authSlice';

const LoginScreen = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState('super_admin');
  const [loginMethod, setLoginMethod] = useState('password');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, errors } = useAppSelector(state => state.auth);

  const roles = [
    {
      id: 'super_admin',
      name: 'Super Admin',
      icon: '🛡️',
      color: '#8B5CF6',
      description: 'Full system access and admin management',
      credentials: 'super_admin / super123',
      permissions: ['Create Admins', 'Assign Constituencies', 'System Reports', 'Data Management']
    },
    {
      id: 'admin',
      name: 'Admin',
      icon: '👥',
      color: '#3B82F6',
      description: 'Constituency management and booth boy creation',
      credentials: 'admin1 / admin123',
      permissions: ['Create Booth Boys', 'Assign Booths', 'Data Collection', 'Reports']
    },
    {
      id: 'booth_boy',
      name: 'Booth Boy',
      icon: '👤',
      color: '#10B981',
      description: 'Voter data collection and booth management',
      credentials: 'booth1 / booth123',
      permissions: ['Filter Voters', 'Edit Voter Details', 'Booth Management', 'Data Collection']
    }
  ];

  const selectedRoleData = roles.find(role => role.id === selectedRole);

  const handleLogin = async () => {
    if (loginMethod === 'password') {
      if (!username || !password) {
        Alert.alert('Error', 'Please enter username and password');
        return;
      }
      // Mock login success with booth boy specific data
      const userData = {
        username,
        role: selectedRole,
        name: selectedRoleData?.name,
        // Add booth boy specific info if role is booth_boy
        ...(selectedRole === 'booth_boy' && {
          id: 'BB001',
          phone: '+91 9876543210',
          assignedBooths: ['B001', 'B002', 'B003'],
          constituency: 'Constituency-1',
          area: 'North Zone',
          totalVoters: 2847
        })
      };
      onLoginSuccess(userData);
    } else {
      if (!otpSent) {
        if (!phone) {
          Alert.alert('Error', 'Please enter phone number');
          return;
        }
        setOtpSent(true);
        Alert.alert('OTP Sent', 'OTP: 123456 has been sent to your phone');
      } else {
        if (!otp) {
          Alert.alert('Error', 'Please enter OTP');
          return;
        }
        if (otp === '123456') {
          const userData = {
            username: phone,
            role: selectedRole,
            name: selectedRoleData?.name,
            // Add booth boy specific info if role is booth_boy
            ...(selectedRole === 'booth_boy' && {
              id: 'BB001',
              phone: phone,
              assignedBooths: ['B001', 'B002', 'B003'],
              constituency: 'Constituency-1',
              area: 'North Zone',
              totalVoters: 2847
            })
          };
          onLoginSuccess(userData);
        } else {
          Alert.alert('Invalid OTP', 'Please enter correct OTP (123456)');
        }
      }
    }
  };

  const sendOTP = () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }
    setOtpSent(true);
    Alert.alert('OTP Sent', 'OTP: 123456 has been sent to your phone');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>LokSetu</Text>
        <Text style={styles.subtitle}>Political Data Management System</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select User Type</Text>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={styles.roleSelector}
            onPress={() => setShowRoleDropdown(!showRoleDropdown)}
          >
            <View style={styles.roleDisplay}>
              <View style={[styles.roleIcon, { backgroundColor: selectedRoleData?.color + '20' }]}>
                <Text style={[styles.iconText, { color: selectedRoleData?.color }]}>{selectedRoleData?.icon}</Text>
              </View>
              <View style={styles.roleText}>
                <Text style={styles.roleName}>{selectedRoleData?.name}</Text>
                <Text style={styles.roleDesc}>{selectedRoleData?.description}</Text>
              </View>
            </View>
            <Text style={[styles.chevronIcon, showRoleDropdown && styles.chevronUp]}>▼</Text>
          </TouchableOpacity>
          {showRoleDropdown && (
            <>
              <TouchableOpacity 
                style={styles.dropdownOverlay} 
                onPress={() => setShowRoleDropdown(false)}
                activeOpacity={1}
              />
              <View style={styles.dropdownContainer}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.id}
                    style={[styles.roleOption, selectedRole === role.id && styles.selectedRoleOption]}
                    onPress={() => {
                      setSelectedRole(role.id);
                      setShowRoleDropdown(false);
                      setUsername('');
                      setPassword('');
                      setPhone('');
                      setOtp('');
                      setOtpSent(false);
                    }}
                  >
                    <View style={[styles.roleIcon, { backgroundColor: role.color + '20' }]}>
                      <Text style={[styles.iconText, { color: role.color }]}>{role.icon}</Text>
                    </View>
                    <View style={styles.roleDetails}>
                      <Text style={styles.roleOptionName}>{role.name}</Text>
                      <Text style={styles.roleOptionDesc}>{role.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.roleInfo}>
        <Text style={styles.infoTitle}>Access Permissions:</Text>
        {selectedRoleData?.permissions.map((permission, index) => (
          <Text key={index} style={styles.permissionItem}>• {permission}</Text>
        ))}
        <View style={styles.credentialsBox}>
          <Text style={styles.credentialsTitle}>Demo Credentials:</Text>
          <Text style={styles.credentialsText}>{selectedRoleData?.credentials}</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, loginMethod === 'password' && styles.activeTab]}
          onPress={() => {
            setLoginMethod('password');
            setOtpSent(false);
          }}
        >
          <Text style={[styles.tabIcon, { color: loginMethod === 'password' ? '#FFFFFF' : '#6B7280' }]}>🔒</Text>
          <Text style={[styles.tabText, loginMethod === 'password' && styles.activeTabText]}>Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, loginMethod === 'otp' && styles.activeTab]}
          onPress={() => {
            setLoginMethod('otp');
            setOtpSent(false);
          }}
        >
          <Text style={[styles.tabIcon, { color: loginMethod === 'otp' ? '#FFFFFF' : '#6B7280' }]}>📱</Text>
          <Text style={[styles.tabText, loginMethod === 'otp' && styles.activeTabText]}>OTP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.loginForm}>
        {loginMethod === 'password' ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📱</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
                editable={!otpSent}
              />
              {!otpSent && (
                <TouchableOpacity style={styles.sendOtpButton} onPress={sendOTP}>
                  <Text style={styles.sendOtpText}>Send OTP</Text>
                </TouchableOpacity>
              )}
            </View>
            {otpSent && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP (123456)"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity onPress={() => setOtpSent(false)}>
                  <Text style={styles.resendText}>Resend</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {errors.login && (
          <Text style={styles.errorText}>{errors.login}</Text>
        )}

        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: selectedRoleData?.color }]} 
          onPress={handleLogin}
          disabled={loading.login}
        >
          {loading.login ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>
              {loginMethod === 'otp' && !otpSent ? 'Send OTP' : 'Login'}
            </Text>
          )}
        </TouchableOpacity>
      </View>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  roleText: {
    flex: 1,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  roleDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  chevronIcon: {
    fontSize: 16,
    color: '#6B7280',
  },
  roleInfo: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  permissionItem: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 16,
  },
  credentialsBox: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  credentialsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  credentialsText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  loginForm: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  sendOtpButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sendOtpText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  resendText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '500',
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: -20,
    right: -20,
    bottom: -1000,
    zIndex: 999,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedRoleOption: {
    backgroundColor: '#EBF4FF',
  },
  roleDetails: {
    flex: 1,
    marginLeft: 8,
  },
  roleOptionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  roleOptionDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
});

export default LoginScreen;