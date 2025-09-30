'use client';

import React, { useState, useEffect } from 'react';
import ApiManager from '@/services/api';
import Card from '@/components/card';
import Button from '@/components/button';
import { User } from '@/lib/types';
import { Plus, Users, Phone, Calendar, MapPin, Edit3, Trash2, X, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface FamilyMember {
  id: string;
  full_name: string;
  relationship: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  pincode?: string;
  phone?: string;
  created_at: string;
}

interface FamilyMemberFormData {
  full_name: string;
  relationship: string;
  date_of_birth: string;
  gender: string;
  address: string;
  pincode: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string | string[];
  statusCode?: number;
}

const FamilyMembersSection: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    relationship: '',
    date_of_birth: '',
    gender: '',
    address: '',
    pincode: ''
  });

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getFamilyMembers();
      if (response.success && response.data) {
        setFamilyMembers(response.data);
      }
    } catch (error) {
      console.error('Failed to load family members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    setError(null);
    setSubmitting(true);
    
    // Check if this family member might already exist
    const existingMember = familyMembers.find(member => 
      member.full_name.toLowerCase() === formData.full_name.toLowerCase() &&
      member.relationship === formData.relationship
    );
    
    if (existingMember) {
      setError('A family member with this name and relationship already exists.');
      setSubmitting(false);
      return;
    }
    
    try {
      // Transform gender value from MALE/FEMALE/OTHER to M/F/O
      const transformedData = {
        ...formData,
        gender: formData.gender === 'MALE' ? 'M' : 
                formData.gender === 'FEMALE' ? 'F' : 
                formData.gender === 'OTHER' ? 'O' : 
                formData.gender // Keep empty if not selected
      };
      
      // Remove empty optional fields
      const cleanedData = Object.fromEntries(
        Object.entries(transformedData).filter(([_, value]) => value !== '')
      );
      
      const response = await ApiManager.addFamilyMember(cleanedData);
      
      if (response.success) {
        setSuccessMessage('Family member added successfully!');
        await loadFamilyMembers();
        setTimeout(() => {
          setShowAddForm(false);
          resetForm();
          setSuccessMessage(null);
        }, 1500);
      } else {
        // Handle validation errors from API
        if (Array.isArray(response.message)) {
          setError(response.message.join(', '));
        } else if (response.message?.includes('duplicate key') || response.message?.includes('unique constraint')) {
          // Handle duplicate family member error
          setError('This family member has already been added. Please check your family members list.');
        } else if (response.statusCode === 500) {
          // Handle server errors with user-friendly message
          setError('Unable to add family member at this time. This person may already exist in your family list.');
        } else {
          setError(response.message || 'Failed to add family member');
        }
      }
    } catch (error) {
      console.error('Failed to add family member:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      // Check for duplicate key errors in the error object
      if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
        setError('This family member has already been added. Please check your family members list.');
      } else {
        setError(errorMessage || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this family member?')) {
      setError(null);
      try {
        const response = await ApiManager.removeFamilyMember(memberId);
        if (response.success) {
          setSuccessMessage('Family member removed successfully');
          await loadFamilyMembers();
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          setError(response.message || 'Failed to remove family member');
        }
      } catch (error) {
        console.error('Failed to remove family member:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      relationship: '',
      date_of_birth: '',
      gender: '',
      address: '',
      pincode: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const relationshipOptions = [
    'Spouse',
    'Child',
    'Parent',
    'Sibling',
    'Grandparent',
    'Grandchild',
    'Other'
  ];

  if (loading) {
    return (
      <Card variant="fill" scaleFactor="headline">
        <div className="p-xl" style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--lk-outline)',
            borderTop: '3px solid var(--lk-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
            Loading family members...
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Header Card */}
      <Card variant="fill" scaleFactor="headline">
        <div className="p-xl">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div>
              <div className="lk-typography-title-medium" style={{ 
                color: 'var(--lk-onsurface)',
                marginBottom: '0.25rem'
              }}>
                Family Members
              </div>
              <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                Add and manage family members to book appointments for them
              </div>
            </div>
            
            <Button
              variant="fill"
              size="md"
              label="Add Member"
              color="primary"
              onClick={() => setShowAddForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus style={{ width: '1rem', height: '1rem' }} />
              Add Member
            </Button>
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

          {/* Stats */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--lk-primarycontainer)',
            borderRadius: '0.75rem'
          }}>
            <Users style={{ width: '1.5rem', height: '1.5rem', color: 'var(--lk-primary)' }} />
            <div>
              <div className="lk-typography-title-medium" style={{ color: 'var(--lk-onprimarycontainer)' }}>
                {familyMembers.length} family member{familyMembers.length !== 1 ? 's' : ''} added
              </div>
              <div className="lk-typography-body-small" style={{ 
                color: 'var(--lk-onprimarycontainer)',
                opacity: 0.8
              }}>
                You can book appointments for all your family members
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Add Member Form */}
      {showAddForm && (
        <Card variant="fill" scaleFactor="headline">
          <div className="p-xl">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '2rem'
            }}>
              <div className="lk-typography-title-medium" style={{ color: 'var(--lk-onsurface)' }}>
                Add Family Member
              </div>
              <Button
                variant="text"
                size="md"
                label="Cancel"
                color="primary"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <X style={{ width: '1rem', height: '1rem' }} />
                Cancel
              </Button>
            </div>

            {/* Error display in form */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem',
                backgroundColor: 'var(--lk-errorcontainer)',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem'
              }}>
                <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--lk-error)' }} />
                <div className="lk-typography-body-medium" style={{ color: 'var(--lk-onerrorcontainer)' }}>
                  {error}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <div className="lk-typography-label-large" style={{ 
                    color: 'var(--lk-onsurface)',
                    marginBottom: '0.5rem'
                  }}>
                    Full Name *
                  </div>
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
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <div className="lk-typography-label-large" style={{ 
                    color: 'var(--lk-onsurface)',
                    marginBottom: '0.5rem'
                  }}>
                    Relationship *
                  </div>
                  <select
                    value={formData.relationship}
                    onChange={(e) => handleInputChange('relationship', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid var(--lk-outline)',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'var(--lk-surface)',
                      color: 'var(--lk-onsurface)'
                    }}
                    required
                  >
                    <option value="">Select Relationship</option>
                    {relationshipOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Personal Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <div className="lk-typography-label-large" style={{ 
                    color: 'var(--lk-onsurface)',
                    marginBottom: '0.5rem'
                  }}>
                    Date of Birth
                  </div>
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
                </div>

                <div>
                  <div className="lk-typography-label-large" style={{ 
                    color: 'var(--lk-onsurface)',
                    marginBottom: '0.5rem'
                  }}>
                    Gender
                  </div>
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
                </div>

                <div>
                  <div className="lk-typography-label-large" style={{ 
                    color: 'var(--lk-onsurface)',
                    marginBottom: '0.5rem'
                  }}>
                    Pincode
                  </div>
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
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="lk-typography-label-large" style={{ 
                  color: 'var(--lk-onsurface)',
                  marginBottom: '0.5rem'
                }}>
                  Address
                </div>
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
                  placeholder="Enter complete address"
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button
                  variant="text"
                  size="md"
                  label="Cancel"
                  color="primary"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                />
                <Button
                  variant="fill"
                  size="md"
                  label={submitting ? "Adding..." : "Add Member"}
                  color="primary"
                  onClick={handleAddMember}
                  disabled={!formData.full_name || !formData.relationship || submitting}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Save style={{ width: '1rem', height: '1rem' }} />
                  {submitting ? "Adding..." : "Add Member"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Family Members List */}
      {familyMembers.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {familyMembers.map((member) => (
            <Card key={member.id} variant="fill" scaleFactor="headline">
              <div className="p-lg">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="bg-secondarycontainer" style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="lk-typography-title-medium" style={{ color: 'var(--lk-onsecondarycontainer)' }}>
                        {member.full_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="lk-typography-title-medium" style={{ 
                        color: 'var(--lk-onsurface)',
                        marginBottom: '0.25rem'
                      }}>
                        {member.full_name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="lk-typography-body-medium" style={{ 
                          color: 'var(--lk-primary)',
                          fontWeight: '500'
                        }}>
                          {member.relationship}
                        </span>
                        {member.date_of_birth && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar style={{ width: '0.875rem', height: '0.875rem', color: 'var(--lk-onsurfacevariant)' }} />
                            <span className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                              {new Date(member.date_of_birth).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {member.pincode && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin style={{ width: '0.875rem', height: '0.875rem', color: 'var(--lk-onsurfacevariant)' }} />
                            <span className="lk-typography-body-small" style={{ color: 'var(--lk-onsurfacevariant)' }}>
                              {member.pincode}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      variant="text"
                      size="sm"
                      label=""
                      color="primary"
                      onClick={() => handleDeleteMember(member.id)}
                      style={{ 
                        minWidth: 'auto',
                        padding: '0.5rem',
                        color: 'var(--lk-error)'
                      }}
                    >
                      <Trash2 style={{ width: '1rem', height: '1rem' }} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : !showAddForm ? (
        <Card variant="fill" scaleFactor="headline">
          <div className="p-xl" style={{ textAlign: 'center' }}>
            <Users style={{ 
              width: '4rem', 
              height: '4rem', 
              color: 'var(--lk-onsurfacevariant)',
              margin: '0 auto 1rem'
            }} />
            <div className="lk-typography-title-large" style={{ 
              color: 'var(--lk-onsurface)',
              marginBottom: '0.5rem'
            }}>
              No family members added yet
            </div>
            <div className="lk-typography-body-medium" style={{ 
              color: 'var(--lk-onsurfacevariant)',
              marginBottom: '2rem'
            }}>
              Add family members to book appointments for them
            </div>
            <Button
              variant="fill"
              size="lg"
              label="Add First Member"
              color="primary"
              onClick={() => setShowAddForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
            >
              <Plus style={{ width: '1rem', height: '1rem' }} />
              Add First Member
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default FamilyMembersSection;