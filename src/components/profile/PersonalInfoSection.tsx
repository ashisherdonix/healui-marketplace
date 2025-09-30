'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import ApiManager from '@/services/api';
import Card from '@/components/card';
import Button from '@/components/button';
import { User } from '@/lib/types';
import { Edit3, Save, X, Phone, MapPin, Calendar, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';

interface PersonalInfoSectionProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

interface PersonalInfoFormData {
  full_name: string;
  email: string;
  address: string;
  pincode: string;
  date_of_birth: string;
  gender: string;
}

interface ProfileUpdateData {
  full_name: string;
  address: string;
  pincode: string;
  email?: string;
  date_of_birth?: string;
  gender?: string;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ user, onUpdate }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    email: user.email || '',
    address: user.address || '',
    pincode: user.pincode || '',
    date_of_birth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '',
    gender: user.gender === 'M' ? 'MALE' : user.gender === 'F' ? 'FEMALE' : user.gender || ''
  });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Prepare data with proper formatting
      const updateData: ProfileUpdateData = {
        full_name: formData.full_name,
        address: formData.address,
        pincode: formData.pincode
      };

      // Only include email if it's valid
      if (formData.email) {
        if (!formData.email.includes('@') || !formData.email.includes('.')) {
          setError('Please enter a valid email address');
          setLoading(false);
          return;
        }
        updateData.email = formData.email;
      }

      // Convert date to ISO format if provided
      if (formData.date_of_birth) {
        updateData.date_of_birth = new Date(formData.date_of_birth).toISOString();
      }

      // Convert gender to M/F format
      if (formData.gender) {
        if (formData.gender === 'MALE') {
          updateData.gender = 'M';
        } else if (formData.gender === 'FEMALE') {
          updateData.gender = 'F';
        } else if (formData.gender === 'OTHER') {
          updateData.gender = 'O';
        } else {
          updateData.gender = formData.gender;
        }
      }

      console.log('Sending update data:', updateData);

      const response = await ApiManager.updateMyProfile(updateData);
      if (response.success && response.data) {
        onUpdate(response.data);
        setSuccessMessage('Profile updated successfully!');
        
        // Update Redux store manually since API no longer does it
        const { setUser } = await import('@/store/slices/authSlice');
        dispatch(setUser(response.data));
        
        setTimeout(() => {
          setIsEditing(false);
          setSuccessMessage(null);
        }, 1500);
      } else {
        // Handle validation errors from API
        if (Array.isArray(response.message)) {
          setError(response.message.join(', '));
        } else {
          setError(response.message || 'Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      address: user.address || '',
      pincode: user.pincode || '',
      date_of_birth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '',
      gender: user.gender === 'M' ? 'MALE' : user.gender === 'F' ? 'FEMALE' : user.gender || ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card variant="fill" scaleFactor="headline">
      <div className="p-lg">
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div className="lk-typography-title-medium" style={{ 
              color: 'var(--lk-onsurface)',
              marginBottom: '0.25rem'
            }}>
              Personal Information
            </div>
            <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
              Manage your personal details and contact information
            </div>
          </div>
          
          {!isEditing ? (
            <Button
              variant="text"
              size="md"
              label="Edit"
              color="primary"
              onClick={() => setIsEditing(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Edit3 style={{ width: '1rem', height: '1rem' }} />
              Edit
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="fill"
                size="md"
                label="Save"
                color="primary"
                onClick={handleSave}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Save style={{ width: '1rem', height: '1rem' }} />
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="text"
                size="md"
                label="Cancel"
                color="primary"
                onClick={handleCancel}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <X style={{ width: '1rem', height: '1rem' }} />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: 'var(--lk-errorcontainer)',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-error)' }} />
            <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onerrorcontainer)' }}>
              {error}
            </div>
          </div>
        )}
        
        {successMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: 'var(--lk-primarycontainer)',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-primary)' }} />
            <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onprimarycontainer)' }}>
              {successMessage}
            </div>
          </div>
        )}

        {/* Profile Avatar Section - Compact */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: 'var(--lk-primarycontainer)',
          borderRadius: '0.75rem'
        }}>
          <div className="bg-primary" style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="lk-typography-title-medium" style={{ color: 'var(--lk-onprimary)' }}>
              {user.full_name?.charAt(0) || 'U'}
            </span>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="lk-typography-body-large" style={{ 
              color: 'var(--lk-onprimarycontainer)',
              marginBottom: '0.125rem',
              fontWeight: '500'
            }}>
              {user.full_name || 'User'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
              <Phone style={{ width: '0.875rem', height: '0.875rem', color: 'var(--lk-primary)' }} />
              <span className="lk-typography-body-small" style={{ color: 'var(--lk-onprimarycontainer)' }}>
                {user.phone}
              </span>
            </div>
            <div className="lk-typography-body-small" style={{ 
              color: 'var(--lk-onprimarycontainer)',
              opacity: 0.75
            }}>
              Member since {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }) : 'Unknown'}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {/* Full Name */}
          <div>
            <div className="lk-typography-body-medium" style={{ 
              color: 'var(--lk-onsurface)',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              Full Name
            </div>
            {isEditing ? (
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--lk-outline)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'var(--lk-surface)',
                  color: 'var(--lk-onsurface)'
                }}
                placeholder="Enter your full name"
              />
            ) : (
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 0'
              }}>
                <UserIcon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-onsurfacevariant)' }} />
                <span className="lk-typography-body-large" style={{ color: 'var(--lk-onsurface)' }}>
                  {user.full_name || 'Not provided'}
                </span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="lk-typography-body-medium" style={{ 
              color: 'var(--lk-onsurface)',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              Email Address
            </div>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--lk-outline)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'var(--lk-surface)',
                  color: 'var(--lk-onsurface)'
                }}
                placeholder="Enter your email address"
              />
            ) : (
              <div className="lk-typography-body-large" style={{ 
                color: 'var(--lk-onsurface)',
                padding: '0.75rem 0'
              }}>
                {user.email || 'Not provided'}
              </div>
            )}
          </div>

          {/* Personal Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {/* Date of Birth */}
            <div>
              <div className="lk-typography-body-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Date of Birth
              </div>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                />
              ) : (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 0'
                }}>
                  <Calendar style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-onsurfacevariant)' }} />
                  <span className="lk-typography-body-large" style={{ color: 'var(--lk-onsurface)' }}>
                    {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not provided'}
                  </span>
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <div className="lk-typography-body-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Gender
              </div>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              ) : (
                <div className="lk-typography-body-large" style={{ 
                  color: 'var(--lk-onsurface)',
                  padding: '0.75rem 0'
                }}>
                  {user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : user.gender || 'Not provided'}
                </div>
              )}
            </div>

            {/* Pincode */}
            <div>
              <div className="lk-typography-body-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Pincode
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--lk-outline)',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: 'var(--lk-surface)',
                    color: 'var(--lk-onsurface)'
                  }}
                  placeholder="Enter pincode"
                />
              ) : (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 0'
                }}>
                  <MapPin style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-onsurfacevariant)' }} />
                  <span className="lk-typography-body-large" style={{ color: 'var(--lk-onsurface)' }}>
                    {user.pincode || 'Not provided'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <div className="lk-typography-body-medium" style={{ 
              color: 'var(--lk-onsurface)',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              Address
            </div>
            {isEditing ? (
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--lk-outline)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: 'var(--lk-surface)',
                  color: 'var(--lk-onsurface)',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                placeholder="Enter your complete address"
              />
            ) : (
              <div className="lk-typography-body-large" style={{ 
                color: 'var(--lk-onsurface)',
                padding: '0.75rem 0',
                lineHeight: '1.5'
              }}>
                {user.address || 'Not provided'}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PersonalInfoSection;