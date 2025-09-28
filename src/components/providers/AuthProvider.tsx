'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getCurrentUser, setUser } from '@/store/slices/authSlice';
import { getCookieValue } from '@/lib/utils/helpers';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a stored token
        const accessToken = getCookieValue('access_token');
        
        if (accessToken && !isAuthenticated) {
          // Token exists but user is not authenticated in Redux
          // Try to verify token and get user data
          await dispatch(getCurrentUser()).unwrap();
        }
      } catch (error) {
        console.log('Token verification failed, user needs to login');
        // Token is invalid or expired, user will need to login again
      } finally {
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [dispatch, isAuthenticated, isInitialized]);

  // Show loading spinner while initializing auth
  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--lk-background)'
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '3px solid var(--lk-outline)',
          borderTop: '3px solid var(--lk-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;