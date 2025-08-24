import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AppIcon } from './index';

const HorizontalScrollCards = ({ 
  title, 
  data = [], 
  onCardPress, 
  cardStyle = 'default',
  showIcon = true,
  iconName = 'group',
  emptyMessage = 'No data available',
  showTabs = false
}) => {
  const [activeTab, setActiveTab] = useState('party');
  
  // Alliance data mapping
  const allianceData = [
    { name: 'NDA', count: 1617, percentage: 56.8, color: '#FF6B35', parties: ['BJP', 'JDU', 'Janswag'] },
    { name: 'INDIA', count: 1124, percentage: 39.5, color: '#00A86B', parties: ['RJD', 'Congress'] },
    { name: 'Janaswaraj', count: 85, percentage: 3.0, color: '#8B5CF6', parties: ['Janaswaraj'] },
    { name: 'Others', count: 21, percentage: 0.7, color: '#9CA3AF', parties: ['Others'] }
  ];
  
  const displayData = showTabs && cardStyle === 'party' 
    ? (activeTab === 'alliance' ? allianceData : data)
    : data;
  const renderCard = (item, index) => {
    switch (cardStyle) {
      case 'party':
        return (
          <TouchableOpacity
            key={index}
            style={[styles.partyCircle, { borderColor: item.color || '#3B82F6' }]}
            onPress={() => onCardPress?.(item)}
          >
            <Text style={[styles.partyCount, { color: item.color || '#3B82F6' }]}>{item.count}</Text>
            <Text style={styles.partyName}>{item.name}</Text>
            <Text style={styles.partyPercentage}>{item.percentage}%</Text>
          </TouchableOpacity>
        );
      
      case 'family':
        return (
          <TouchableOpacity
            key={index}
            style={[styles.card, styles.familyCard]}
            onPress={() => onCardPress?.(item)}
          >
            <View style={styles.familyHeader}>
              <AppIcon name="home" size={20} color="#3B82F6" />
              <Text style={styles.familyName}>{item.familyName}</Text>
            </View>
            <Text style={styles.familyMembers}>{item.members} members</Text>
            <Text style={styles.familyVoters}>{item.voters} voters</Text>
            <View style={styles.familyInfluence}>
              <Text style={styles.influenceText}>Influence: {item.influence}</Text>
            </View>
          </TouchableOpacity>
        );
      
      default:
        return (
          <TouchableOpacity
            key={index}
            style={[styles.card, styles.defaultCard]}
            onPress={() => onCardPress?.(item)}
          >
            {showIcon && <AppIcon name={iconName} size={24} color="#3B82F6" />}
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardValue}>{item.value}</Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <AppIcon name="poll" size={20} color="#111827" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      
      {showTabs && cardStyle === 'party' && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'party' && styles.activeTab]}
            onPress={() => setActiveTab('party')}
          >
            <Text style={[styles.tabText, activeTab === 'party' && styles.activeTabText]}>
              Party
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'alliance' && styles.activeTab]}
            onPress={() => setActiveTab('alliance')}
          >
            <Text style={[styles.tabText, activeTab === 'alliance' && styles.activeTabText]}>
              Alliance
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {displayData.length > 0 ? (
          displayData.map(renderCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  card: {
    marginRight: 12,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  defaultCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    minWidth: 80,
  },

  familyCard: {
    marginTop:-8,
    backgroundColor: '#FFFFFF',
    minWidth: 120,
  },
  cardTitle: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 2,
    textAlign: 'center',
  },
  partyCircle: {
    width: 85,
    height: 85,
    borderRadius: 50,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  partyName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 1,
    letterSpacing: 0.3,
  },
  partyCount: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 1,
  },
  partyPercentage: {
    fontSize: 8,
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '600',
    opacity: 0.8,
  },
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  familyName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 6,
    flex: 1,
  },
  familyMembers: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 1,
  },
  familyVoters: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 6,
  },
  familyInfluence: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  influenceText: {
    fontSize: 8,
    color: '#374151',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 2,
    marginHorizontal: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '700',
  },
});

export default HorizontalScrollCards;