import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const SideDrawer = ({ visible, onClose, user, onNavigate, onLogout }) => {
  const getMenuItems = () => {
    if (user?.role === 'super_admin') {
      return [
        { id: 'createAdmin', title: 'Create Admin', icon: '👥' },
        { id: 'assignConstituency', title: 'Assign Constituency', icon: '📍' },
        { id: 'dataScraper', title: 'Data Scraper', icon: '📥' },
        { id: 'systemReports', title: 'System Reports', icon: '📊' },
      ];
    }
    if (user?.role === 'admin') {
      return [
        { id: 'createBoothBoy', title: 'Create Booth Boy', icon: '👤' },
        { id: 'assignBooths', title: 'Assign Booths', icon: '🗳️' },
        { id: 'reports', title: 'Reports', icon: '📈' },
      ];
    }
    return [];
  };

  const handleItemPress = (itemId) => {
    onNavigate(itemId);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.drawer}>
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
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={styles.menuTitle}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#fff',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
    fontSize: 18,
    marginRight: 15,
    width: 25,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
});

export default SideDrawer;