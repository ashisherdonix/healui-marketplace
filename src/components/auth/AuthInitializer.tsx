'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getCurrentUser, setInitializing } from '@/store/slices/authSlice';
import { getAccessToken } from '@/lib/utils/helpers';

const AuthInitializer = () => {
  const dispatch = useAppDispatch();
  const { initializing, isAuthenticated } = useAppSelector((state) => state.auth);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current || !initializing) {
      console.log('🔄 AuthInitializer - Skipping, already initialized or not needed');
      return;
    }

    const initializeAuth = async () => {
      console.log('🔄 AuthInitializer - Starting auth initialization...');
      hasInitialized.current = true;
      
      // Small delay to ensure page is fully loaded and avoid NS_BINDING_ABORTED
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if we have an access token in cookies
      const accessToken = getAccessToken();
      
      if (accessToken) {
        console.log('✅ AuthInitializer - Found access token, fetching user data...');
        
        try {
          // Dispatch getCurrentUser to restore auth state
          await dispatch(getCurrentUser()).unwrap();
          console.log('✅ AuthInitializer - Auth state restored successfully');
        } catch (error: any) {
          console.log('❌ AuthInitializer - Failed to restore auth state:', error);
          
          // For any error during initialization, just gracefully continue without auth
          // This ensures the app works without authentication
          console.log('ℹ️ AuthInitializer - Continuing without authentication, app will work in guest mode');
          dispatch(setInitializing(false));
        }
      } else {
        console.log('ℹ️ AuthInitializer - No access token found, user needs to login');
        // No token found, set initializing to false
        dispatch(setInitializing(false));
      }
    };

    initializeAuth();
  }, [dispatch, initializing]);

  // Reset initialization flag when user logs out
  useEffect(() => {
    if (!isAuthenticated && !initializing) {
      hasInitialized.current = false;
    }
  }, [isAuthenticated, initializing]);

  // This component doesn't render anything
  return null;
};

export default AuthInitializer;