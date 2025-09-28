'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ReactNode } from 'react';
import AuthInitializer from '@/components/auth/AuthInitializer';

interface ReduxProviderProps {
  children: ReactNode;
}

// Redux Provider component following clinic-web pattern
export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}