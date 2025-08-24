import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { Linking } from 'react-native';
import { store } from './src/store';
import { logout, setAuthData } from './src/store/authSlice';
import { storage } from './src/utils/storage';
import { loadCachedDashboardData } from './src/store/slices/dashboardSlice';
import { parseResetToken, isResetPasswordLink } from './src/utils/deepLinking';
import { AppNavigator } from './src/navigation';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadStoredAuth = async () => {
      const storedToken = await storage.getToken();
      const storedUser = await storage.getUserData();

      if (storedToken && storedUser) {
        dispatch(setAuthData({ token: storedToken, user: storedUser }));
        dispatch(loadCachedDashboardData());
      }
    };
    
    const handleDeepLink = (url) => {
      if (url && isResetPasswordLink(url)) {
        const token = parseResetToken(url);
        if (token) {
          dispatch(logout());
        }
      }
    };

    Linking.getInitialURL().then(handleDeepLink);
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    loadStoredAuth();
    return () => subscription?.remove();
  }, [dispatch]);

  return <AppNavigator />;
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;