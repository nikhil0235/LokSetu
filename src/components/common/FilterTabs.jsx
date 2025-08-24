import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FilterTabs = ({ activeTab, tabs, onTabChange, style }) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onTabChange(tab.key)}
        >
          <View style={styles.tabContent}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
            <Text style={[
              styles.tabCount, 
              activeTab === tab.key && styles.activeTabCount,
              tab.count === undefined && styles.tabCountEmpty
            ]}>
              {tab.count !== undefined ? tab.count : ''}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    padding: 2,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    minHeight: 36,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '700',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabCount: {
    fontSize: 8,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 1,
    lineHeight: 10,
  },
  tabCountEmpty: {
    height: 0,
    marginTop: 0,
    lineHeight: 0,
  },
  activeTabCount: {
    color: '#3B82F6',
  },
});

export default FilterTabs;