'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUserData, setCurrentLocation, setUserMode } from '@/store/slices/userSlice';
import { clearError as clearAuthError } from '@/store/slices/authSlice';
import Button from '@/components/button';
import Card from '@/components/card';

// Example component demonstrating Redux usage following clinic-web patterns
export default function ReduxExample() {
  const dispatch = useAppDispatch();
  
  // Select state from Redux store
  const { isAuthenticated, user: authUser, loading: authLoading } = useAppSelector(state => state.auth);
  const { userData, currentLocation, userMode, loading: userLoading } = useAppSelector(state => state.user);
  const { bookings, loading: bookingLoading } = useAppSelector(state => state.booking);
  const { therapists, loading: therapistLoading } = useAppSelector(state => state.therapist);

  // Example actions
  const handleSetMockUser = () => {
    const mockUser = {
      id: '1',
      email: 'patient@healui.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'patient' as const,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch(setUserData(mockUser));
  };

  const handleSetLocation = () => {
    dispatch(setCurrentLocation('Mumbai, India'));
  };

  const handleToggleUserMode = () => {
    dispatch(setUserMode(userMode === 'patient' ? 'therapist' : 'patient'));
  };

  const handleClearAuthError = () => {
    dispatch(clearAuthError());
  };

  return (
    <Card variant="fill">
      <div className="p-lg">
        <div className="lk-typography-headline-medium mb-md">Redux State Example</div>
        
        {/* Auth State */}
        <div className="mb-md">
          <div className="lk-typography-title-large mb-sm">Authentication State</div>
          <div className="lk-typography-body-medium mb-xs">
            Authenticated: <span style={{ color: isAuthenticated ? 'var(--lk-primary)' : 'var(--lk-error)' }}>
              {isAuthenticated ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="lk-typography-body-medium mb-xs">
            Loading: {authLoading ? 'Yes' : 'No'}
          </div>
          <div className="lk-typography-body-medium">
            User: {authUser ? `${authUser.firstName} ${authUser.lastName}` : 'None'}
          </div>
        </div>

        {/* User State */}
        <div className="mb-md">
          <div className="lk-typography-title-large mb-sm">User State</div>
          <div className="lk-typography-body-medium mb-xs">
            Current User: {userData ? `${userData.firstName} ${userData.lastName} (${userData.role})` : 'None'}
          </div>
          <div className="lk-typography-body-medium mb-xs">
            Location: {currentLocation || 'Not set'}
          </div>
          <div className="lk-typography-body-medium mb-xs">
            Mode: {userMode}
          </div>
          <div className="lk-typography-body-medium">
            Loading: {userLoading ? 'Yes' : 'No'}
          </div>
        </div>

        {/* Other States */}
        <div className="mb-md">
          <div className="lk-typography-title-large mb-sm">Other States</div>
          <div className="lk-typography-body-medium mb-xs">
            Bookings: {bookings.length} items (Loading: {bookingLoading.bookings ? 'Yes' : 'No'})
          </div>
          <div className="lk-typography-body-medium">
            Therapists: {therapists.length} items (Loading: {therapistLoading.therapists ? 'Yes' : 'No'})
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lk-typography-title-large mb-sm">Redux Actions</div>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <Button 
            variant="fill" 
            size="md" 
            label="Set Mock User" 
            onClick={handleSetMockUser}
          />
          <Button 
            variant="outline" 
            size="md" 
            label="Set Location" 
            onClick={handleSetLocation}
          />
          <Button 
            variant="text" 
            size="md" 
            label={`Switch to ${userMode === 'patient' ? 'Therapist' : 'Patient'} Mode`}
            onClick={handleToggleUserMode}
          />
          <Button 
            variant="text" 
            size="sm" 
            label="Clear Auth Error" 
            onClick={handleClearAuthError}
          />
        </div>

        {/* Example API Call (when implemented) */}
        <div className="mt-lg">
          <div className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
            💡 API calls will automatically dispatch Redux actions when implemented in services/api.ts
          </div>
        </div>
      </div>
    </Card>
  );
}