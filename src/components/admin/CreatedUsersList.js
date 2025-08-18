import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const CreatedUsersList = ({ onUserPress }) => {
  const { createdUsers, admins, boothBoys, stats } = useSelector(state => state.adminDashboard);

  const renderUser = ({ item }) => (
    <TouchableOpacity 
      style={styles.userCard} 
      onPress={() => onUserPress?.(item)}
    >
      <View style={styles.userHeader}>
        <Text style={styles.userName}>{item.FullName || item.Username}</Text>
        <Text style={[styles.userRole, { 
          backgroundColor: item.Role === 'admin' ? '#007bff' : '#28a745' 
        }]}>
          {item.Role}
        </Text>
      </View>
      
      <Text style={styles.userDetail}>Username: {item.Username}</Text>
      <Text style={styles.userDetail}>Phone: {item.Phone}</Text>
      <Text style={styles.userDetail}>Email: {item.Email}</Text>
      <Text style={styles.userDetail}>Created by: {item.Created_by}</Text>
      
      {item.AssignedBoothIDs && (
        <Text style={styles.userDetail}>
          Assigned Booths: {item.AssignedBoothIDs.replace(/[{}]/g, '')}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalCreatedUsers}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalAdmins}</Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalBoothBoys}</Text>
          <Text style={styles.statLabel}>Booth Boys</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Created Users ({createdUsers.length})</Text>
      
      <FlatList
        data={createdUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.UserID?.toString() || item.Username}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  userRole: {
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  userDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
});

export default CreatedUsersList;