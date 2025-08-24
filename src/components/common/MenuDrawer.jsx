import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  PanResponder,
} from 'react-native';
import { AppIcon } from './index';

const MenuDrawer = ({ visible, onClose, user, menuItems, onNavigate, onLogout }) => {
  const slideAnim = useRef(new Animated.Value(-260)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => visible,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return visible && Math.abs(gestureState.dx) > 5;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < 0) {
        slideAnim.setValue(Math.max(-260, gestureState.dx));
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -30 || gestureState.vx < -0.3) {
        onClose();
      } else {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(-260);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -260,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay} {...panResponder.panHandlers}>
        <Animated.View 
          style={[styles.modalBackground, { opacity: visible ? 0.6 : 0 }]} 
        >
          <TouchableOpacity 
            style={{ flex: 1 }}
            onPress={onClose}
          />
        </Animated.View>
        
        <Animated.View 
          style={[styles.menuDrawer, { transform: [{ translateX: slideAnim }] }]}
        >
          <View style={styles.drawerHeader}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0) || 'U'}
                </Text>
                <View style={styles.onlineIndicator} />
              </View>
              
              <View style={styles.userDetails}>
                <Text style={styles.displayName}>{user?.name || 'User Name'}</Text>
                <Text style={styles.roleText}>{user?.role?.replace('_', ' ') || 'Role'}</Text>
              </View>
            </View>
          </View>

          <ScrollView style={styles.navigationMenu} showsVerticalScrollIndicator={false}>
            <View style={styles.menuSection}>
              {menuItems.map((item, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.navItem}
                  onPress={() => {
                    onClose();
                    item.onPress ? item.onPress() : onNavigate(item.screen);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.navItemContent}>
                    <View style={[styles.iconWrapper, { backgroundColor: (item.color || '#3B82F6') + '15' }]}>
                      <AppIcon name={item.icon} size={18} color={item.color || '#3B82F6'} />
                    </View>
                    <Text style={styles.navTitle}>{item.title}</Text>
                    <View style={styles.navArrow}>
                      <AppIcon name="chevron-right" size={16} color="#9CA3AF" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              <View style={styles.divider} />
              
              <TouchableOpacity 
                style={styles.navItem}
                onPress={() => {
                  onClose();
                  onLogout();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.navItemContent}>
                  <View style={[styles.iconWrapper, { backgroundColor: '#EF444415' }]}>
                    <AppIcon name="power-settings-new" size={18} color="#EF4444" />
                  </View>
                  <Text style={[styles.navTitle, { color: '#EF4444' }]}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  menuDrawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 260,
    backgroundColor: '#FFFFFF',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  drawerHeader: {
    backgroundColor: '#3B82F6',
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarText: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
    lineHeight: 50,
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  roleText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'capitalize',
  },
  navigationMenu: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  menuSection: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  navItem: {
    marginHorizontal: 0,
    marginVertical: 1,
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  navArrow: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
    marginHorizontal: 20,
  },
});

export default MenuDrawer;