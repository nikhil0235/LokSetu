import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

const SideDrawer = ({ visible, onClose, user, onNavigate, onLogout }) => {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in from left and fade in backdrop
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out to left and fade out backdrop
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getMenuItems = () => {
    if (user?.role === 'super_admin') {
      return [
        { id: 'createAdmin', title: 'Create Admin', iconName: 'admin-panel-settings' },
        { id: 'assignConstituency', title: 'Assign Constituency', iconName: 'assignment' },
        { id: 'dataScraper', title: 'Data Scraper', iconName: 'storage' },
        { id: 'systemReports', title: 'System Reports', iconName: 'assessment' },
      ];
    }
    if (user?.role === 'admin') {
      return [
        { id: 'createBoothBoy', title: 'Create Booth Boy', iconName: 'person-add' },
        { id: 'assignBooths', title: 'Assign Booths', iconName: 'assignment' },
        { id: 'reports', title: 'Reports', iconName: 'assessment' },
      ];
    }
    return [];
  };

  const handleItemPress = (itemId) => {
    onNavigate(itemId);
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.backdrop, 
          { opacity: backdropOpacity }
        ]}
      >
        <TouchableOpacity 
          style={styles.backdropTouchable} 
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.drawer, 
          {
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.name || user?.username}</Text>
            <Text style={styles.userRole}>{user?.role}</Text>
          </View>
        </View>

        <ScrollView style={styles.menu}>
          {getMenuItems().map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleItemPress(item.id)}
            >
              <Icon name={item.iconName} size={20} color="#6B7280" style={styles.menuIcon} />
              <Text style={styles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
            <View style={styles.logoutIconWrapper}>
              <Icon name="power-settings-new" size={18} color="#FFFFFF" />
            </View>
            <Text style={[styles.menuTitle, { color: '#EF4444', fontWeight: '600' }]}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1001,
  },
  header: {
    backgroundColor: '#00BCD4',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  userRole: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    marginRight: 15,
    width: 25,
  },
  logoutIconWrapper: {
    backgroundColor: '#EF4444',
    borderRadius: 15,
    padding: 6,
    marginRight: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
});

export default SideDrawer;