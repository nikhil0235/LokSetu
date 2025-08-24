import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { ReusableList } from '../components/common';
import { getListConfig, hasPermission } from '../config/userRoleConfig';

const UnifiedListScreen = ({ 
  listType = 'USERS', // 'USERS', 'VOTERS', 'BOOTHS'
  onBack, 
  onLogout,
  onNavigate,
  data = [],
  onRefresh,
  refreshing = false
}) => {
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);

  // Get list configuration based on type
  const listConfig = getListConfig(listType);

  if (!listConfig) {
    Alert.alert('Error', 'Invalid list type configuration');
    return null;
  }

  // Check permissions
  const resourceMap = {
    'USERS': 'users',
    'VOTERS': 'voters',
    'BOOTHS': 'booths'
  };

  const resource = resourceMap[listType];
  if (!hasPermission(user?.role, resource, 'read')) {
    Alert.alert('Access Denied', `You do not have permission to view ${listType.toLowerCase()}`);
    onBack();
    return null;
  }

  // Handle item press
  const handleItemPress = (item) => {
    console.log(`Pressed item:`, item);
    // Handle based on list type and user permissions
    if (listType === 'USERS' && hasPermission(user?.role, 'users', 'read')) {
      // Navigate to user details
      onNavigate && onNavigate('userDetails', { userId: item.id });
    } else if (listType === 'VOTERS' && hasPermission(user?.role, 'voters', 'read')) {
      // Navigate to voter details
      onNavigate && onNavigate('voterDetails', { voterId: item.id });
    } else if (listType === 'BOOTHS' && hasPermission(user?.role, 'booths', 'read')) {
      // Navigate to booth details
      onNavigate && onNavigate('boothDetails', { boothId: item.id });
    }
  };

  // Process actions with permission checks
  const processedActions = listConfig.actions.filter(action => {
    switch (action.onPress) {
      case 'createUser':
        return hasPermission(user?.role, 'users', 'create');
      case 'exportVoters':
        return hasPermission(user?.role, 'voters', 'export');
      case 'importVoters':
        return hasPermission(user?.role, 'voters', 'import');
      case 'assignBooths':
        return hasPermission(user?.role, 'booths', 'assign');
      default:
        return true;
    }
  }).map(action => ({
    ...action,
    onPress: () => {
      if (action.onPress && onNavigate) {
        onNavigate(action.onPress);
      }
    }
  }));

  // Process item actions with permission checks
  const processedItemActions = listConfig.itemActions.filter(action => {
    const actionType = action.onPress.replace(/^(edit|delete|view|assign).*/, '$1');
    const permissionMap = {
      edit: 'update',
      delete: 'delete',
      view: 'read',
      assign: 'assign'
    };
    
    const permission = permissionMap[actionType] || 'read';
    return hasPermission(user?.role, resource, permission);
  }).map(action => ({
    ...action,
    onPress: (item) => {
      console.log(`${action.onPress} for item:`, item);
      
      if (action.onPress.includes('delete')) {
        Alert.alert(
          'Confirm Delete',
          `Are you sure you want to delete this ${listType.slice(0, -1).toLowerCase()}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              style: 'destructive',
              onPress: () => {
                // Handle delete logic here
                console.log(`Deleting ${listType} item:`, item);
              }
            }
          ]
        );
      } else if (action.onPress.includes('edit')) {
        // Navigate to edit screen
        const editScreen = `edit${listType.slice(0, -1)}`;
        onNavigate && onNavigate(editScreen, { itemId: item.id, item });
      } else if (action.onPress.includes('view')) {
        // Navigate to details screen
        const detailScreen = `${listType.slice(0, -1).toLowerCase()}Details`;
        onNavigate && onNavigate(detailScreen, { itemId: item.id, item });
      } else if (action.onPress.includes('assign')) {
        // Navigate to assign screen
        onNavigate && onNavigate('assignBooth', { boothId: item.id, booth: item });
      }
    }
  }));

  return (
    <ReusableList
      title={listConfig.title}
      data={data}
      columns={listConfig.columns}
      onBack={onBack}
      onLogout={onLogout}
      onRefresh={onRefresh}
      refreshing={refreshing}
      searchable={true}
      filterable={listConfig.filters && listConfig.filters.length > 0}
      filters={listConfig.filters || []}
      actions={processedActions}
      itemActions={processedItemActions}
      onItemPress={handleItemPress}
      pagination={data.length > 50} // Enable pagination for large datasets
      itemsPerPage={20}
      loading={loading}
    />
  );
};

export default UnifiedListScreen;