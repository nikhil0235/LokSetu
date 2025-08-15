import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  BarChart3,
  Edit,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from 'lucide-react-native';

const BoothBoyDetailsScreen = ({ navigation, route }) => {
  const { boothBoy } = route.params;
  const [activeTab, setActiveTab] = useState('overview');

  const handleDeleteBoothBoy = () => {
    Alert.alert(
      'Delete Booth Boy',
      `Are you sure you want to delete ${boothBoy.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle delete logic here
            navigation.goBack();
            Alert.alert('Success', `${boothBoy.name} has been deleted.`);
          }
        }
      ]
    );
  };

  const toggleStatus = () => {
    const newStatus = boothBoy.status === 'active' ? 'inactive' : 'active';
    Alert.alert(
      'Change Status',
      `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} ${boothBoy.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // Handle status change logic here
            Alert.alert('Success', `${boothBoy.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`);
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#10B981' : '#EF4444';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const InfoCard = ({ icon: Icon, label, value, color = '#6B7280' }) => (
    <View style={styles.infoCard}>
      <Icon size={20} color={color} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <InfoCard icon={User} label="Full Name" value={boothBoy.name} />
        <InfoCard icon={Mail} label="Email" value={boothBoy.email} />
        <InfoCard icon={Phone} label="Phone" value={boothBoy.phone} />
        <InfoCard icon={MapPin} label="Address" value={boothBoy.address} />
        <InfoCard icon={Calendar} label="Joined Date" value={boothBoy.joinedDate} />
        <InfoCard icon={Activity} label="Last Active" value={boothBoy.lastActive} />
      </View>

      {/* Performance Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon={MapPin}
            label="Assigned Booths"
            value={`${boothBoy.assignedBooths}/${boothBoy.maxBooths}`}
            color="#3B82F6"
            subtitle="booths assigned"
          />
          <StatCard
            icon={Users}
            label="Completed Voters"
            value={boothBoy.completedVoters.toLocaleString()}
            color="#10B981"
            subtitle="voters processed"
          />
          <StatCard
            icon={BarChart3}
            label="Progress"
            value={`${boothBoy.progress.toFixed(1)}%`}
            color={getProgressColor(boothBoy.progress)}
            subtitle="completion rate"
          />
          <StatCard
            icon={Clock}
            label="Efficiency"
            value="High"
            color="#8B5CF6"
            subtitle="performance rating"
          />
        </View>
      </View>

      {/* Progress Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Collection Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Overall Progress</Text>
            <Text style={[styles.progressPercentage, { color: getProgressColor(boothBoy.progress) }]}>
              {boothBoy.progress.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${boothBoy.progress}%`,
                  backgroundColor: getProgressColor(boothBoy.progress)
                }
              ]} 
            />
          </View>
          <View style={styles.progressStats}>
            <Text style={styles.progressStat}>
              {boothBoy.completedVoters} of {boothBoy.totalVoters} voters completed
            </Text>
            <Text style={styles.progressStat}>
              {boothBoy.assignedBooths} booths assigned
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderActivity = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <CheckCircle size={16} color="#10B981" />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Completed voter data for Booth #145</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Clock size={16} color="#F59E0B" />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Started data collection for Booth #146</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <CheckCircle size={16} color="#10B981" />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Synced offline data successfully</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <User size={16} color="#3B82F6" />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Profile updated</Text>
              <Text style={styles.activityTime}>2 days ago</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booth Boy Details</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditBoothBoy', { boothBoy })}
        >
          <Edit size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Profile Summary */}
      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{boothBoy.name}</Text>
          <Text style={styles.profileArea}>{boothBoy.area}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(boothBoy.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(boothBoy.status) }]}>
              {boothBoy.status.charAt(0).toUpperCase() + boothBoy.status.slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.profileActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: getStatusColor(boothBoy.status) + '20' }]}
            onPress={toggleStatus}
          >
            {boothBoy.status === 'active' ? (
              <XCircle size={16} color={getStatusColor(boothBoy.status)} />
            ) : (
              <CheckCircle size={16} color={getStatusColor(boothBoy.status)} />
            )}
            <Text style={[styles.actionButtonText, { color: getStatusColor(boothBoy.status) }]}>
              {boothBoy.status === 'active' ? 'Deactivate' : 'Activate'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#EF444420' }]}
            onPress={handleDeleteBoothBoy}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TabButton
          title="Overview"
          isActive={activeTab === 'overview'}
          onPress={() => setActiveTab('overview')}
        />
        <TabButton
          title="Activity"
          isActive={activeTab === 'activity'}
          onPress={() => setActiveTab('activity')}
        />
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' ? renderOverview() : renderActivity()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  editButton: {
    padding: 4,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileInfo: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileArea: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 20,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabButtonText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default BoothBoyDetailsScreen;