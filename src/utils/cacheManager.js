import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store/store';
import { clearDashboardData } from '../store/slices/dashboardSlice';

const CACHE_KEYS = [
  '@dashboard_data',
  '@user_data',
  '@saved_credentials',
  '@login_attempts',
  '@last_login',
  // Add other cache keys as needed
];

export const cacheManager = {
  async clearUserCache(newUserId) {
    try {
      const currentUserId = await AsyncStorage.getItem('@current_user_id');
      
      // Only clear cache if it's a different user
      if (currentUserId && currentUserId !== newUserId.toString()) {
        console.log('New user detected, clearing cache...');
        
        // Clear AsyncStorage cache
        await AsyncStorage.multiRemove(CACHE_KEYS);
        
        // Clear Redux store cache
        store.dispatch(clearDashboardData());
        
        console.log('Cache cleared successfully');
      }
      
      // Update current user ID
      await AsyncStorage.setItem('@current_user_id', newUserId.toString());
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },

  async clearAllCache() {
    try {
      await AsyncStorage.multiRemove([...CACHE_KEYS, '@current_user_id']);
      store.dispatch(clearDashboardData());
      console.log('All cache cleared');
    } catch (error) {
      console.error('Error clearing all cache:', error);
    }
  }
};