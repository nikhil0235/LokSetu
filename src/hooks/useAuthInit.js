import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../store/authSlice';
import { storage } from '../utils/storage';

export const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await storage.getToken();
        const userData = await storage.getUserData();
        
        if (token && userData) {
          dispatch(setAuthData({ token, user: userData }));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      }
    };

    initializeAuth();
  }, [dispatch]);
};