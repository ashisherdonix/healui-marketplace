'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import ApiManager from '@/services/api';
import Header from '@/components/layout/Header';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Home as HomeIcon,
  Video,
  ExternalLink,
  ChevronRight,
  X,
  Activity,
  FileText,
  Heart,
  Target,
  Download
} from 'lucide-react';
import Link from 'next/link';

interface VitalSigns {
  temperature?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  respiratoryRate?: number;
  weight?: number;
  height?: number;
  oxygenSaturation?: number;
}

interface BookingReview {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

interface Exercise {
  id: string;
  treatment_protocol_id: string;
  exercise_id?: string | null;
  exercise_name: string;
  exercise_description: string;
  custom_reps: number;
  custom_sets: number;
  custom_duration_seconds: number;
  custom_notes: string;
  order_index: number;
  frequency: string;
}

interface AffectedArea {
  id: string;
  treatment_protocol_id: string;
  structure_id: string;
  structure_name: string;
  structure_type: string;
  structure_category: string;
  additional_metadata?: any;
}

interface Recommendations {
  id: string;
  treatment_protocol_id: string;
  blood_tests: string[];
  recommended_foods: string[];
  foods_to_avoid: string[];
  supplements: string[];
  general_advice: string[];
  precautions: string[];
  hydration_notes: string;
  general_guidelines: string[];
  additional_notes: string;
}

interface TreatmentProtocol {
  id: string;
  visit_id: string;
  patient_id?: string | null;
  clinic_id?: string | null;
  patient_user_id: string;
  physiotherapist_id: string;
  protocol_title: string;
  current_complaint: string;
  general_notes: string;
  additional_manual_notes: string;
  show_explanations: boolean;
  status: string;
  finalized_at?: string | null;
  sent_to_patient_at?: string | null;
  pdf_metadata?: any;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  exercises?: Exercise[];
  affectedAreas?: AffectedArea[];
  recommendations?: Recommendations[];
}

interface Booking {
  id: string;
  patient_id?: string | null;
  clinic_id?: string | null;
  physiotherapist_id: string;
  visit_type: 'INITIAL_CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY';
  visit_mode: 'HOME_VISIT' | 'ONLINE';
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
  chief_complaint?: string;
  check_in_time?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  cancellation_reason?: string | null;
  cancelled_by?: string | null;
  cancelled_at?: string | null;
  parent_visit_id?: string | null;
  vital_signs?: VitalSigns | null;
  video_link?: string;
  video_session_id?: string;
  visit_source: 'MARKETPLACE' | 'CLINIC';
  patient_user_id: string;
  consultation_fee: string;
  travel_fee: string;
  total_amount: string;
  patient_address?: string;
  payment_info: {
    method: string;
    status: string;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
  physiotherapist?: {
    id: string;
    phone: string;
    full_name: string;
    specializations?: string[];
    experience?: number;
    rating?: number;
  };
  patientUser?: {
    id: string;
    phone: string;
    full_name: string;
  };
  review?: BookingReview | null;
  treatmentProtocol?: TreatmentProtocol | null;
}

const BookingsPage: React.FC = () => {
  const { user, isAuthenticated, initializing } = useAppSelector((state) => state.auth);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState<TreatmentProtocol | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Redirect if not authenticated (but only after initialization is complete)
  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated, initializing]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadBookings();
    }
  }, [isAuthenticated, user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getMyBookings();
      if (response.success && response.data) {
        setBookings(response.data as Booking[]);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
      case 'COMPLETED':
        return <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#1e5f79' }} />;
      case 'CANCELLED':
        return <XCircle style={{ width: '1.25rem', height: '1.25rem', color: '#000000' }} />;
      case 'PENDING':
        return <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: '#1e5f79' }} />;
      case 'IN_PROGRESS':
        return <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#1e5f79' }} />;
      default:
        return <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#000000' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
      case 'COMPLETED':
      case 'IN_PROGRESS':
        return '#1e5f79';
      case 'CANCELLED':
        return '#000000';
      case 'PENDING':
        return '#1e5f79';
      default:
        return '#000000';
    }
  };

  const statusCounts = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    scheduled: bookings.filter(b => b.status === 'SCHEDULED').length,
    in_progress: bookings.filter(b => b.status === 'IN_PROGRESS').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  const exportToPDF = async () => {
    if (!selectedProtocol || !selectedBooking) return;
    
    setIsExportingPDF(true);
    try {
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Treatment Protocol - ${selectedProtocol.protocol_title}</title>
  <style>
    @media print {
      body { margin: 0; }
      .no-print { display: none !important; }
    }
    body { 
      font-family: Arial, sans-serif; 
      margin: 20px; 
      line-height: 1.6; 
      color: #333;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #1e5f79; 
      padding-bottom: 20px; 
      margin-bottom: 30px; 
    }
    .title { 
      color: #1e5f79; 
      font-size: 24px; 
      font-weight: bold; 
      margin-bottom: 10px; 
    }
    .section { 
      margin-bottom: 25px; 
      page-break-inside: avoid;
    }
    .section-title { 
      color: #1e5f79; 
      font-size: 18px; 
      font-weight: bold; 
      margin-bottom: 10px; 
      border-bottom: 1px solid #c8eaeb; 
      padding-bottom: 5px; 
    }
    .info-container {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    .info-box { 
      background: #f8f9fa; 
      padding: 15px; 
      border-radius: 8px; 
      margin-bottom: 15px;
      flex: 1;
    }
    .exercise { 
      background: #c8eaeb; 
      padding: 15px; 
      border-radius: 8px; 
      margin-bottom: 15px;
      page-break-inside: avoid;
    }
    .exercise-title { 
      font-weight: bold; 
      color: #000; 
      margin-bottom: 8px; 
    }
    .exercise-details { 
      display: flex; 
      gap: 15px; 
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .exercise-detail { 
      text-align: center; 
      background: white; 
      padding: 8px 12px; 
      border-radius: 4px;
      min-width: 80px;
    }
    .food-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 8px;
    }
    .food-tag { 
      background: #c8eaeb; 
      padding: 4px 8px; 
      border-radius: 12px; 
      font-size: 12px;
      white-space: nowrap;
    }
    ul { 
      margin: 10px 0; 
      padding-left: 20px; 
    }
    .affected-area { 
      background: #eff8ff; 
      padding: 10px; 
      border-radius: 6px; 
      margin-bottom: 8px; 
      border-left: 4px solid #1e5f79; 
    }
    .print-button {
      background: #1e5f79;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      margin: 20px 0;
    }
    .print-button:hover {
      background: #0f3a47;
    }
    @media (max-width: 768px) {
      .info-container { flex-direction: column; }
      .exercise-details { justify-content: center; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="print-button" onclick="window.print()">🖨️ Print / Save as PDF</button>
    <p><strong>Instructions:</strong> Click the print button above, then choose "Save as PDF" or "Microsoft Print to PDF" in the destination dropdown.</p>
    <hr style="margin: 20px 0;">
  </div>

  <div class="header">
    <div class="title">${selectedProtocol.protocol_title}</div>
    <p><strong>Status:</strong> ${selectedProtocol.status}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
  </div>

  <div class="section">
    <div class="info-container">
      <div class="info-box">
        <h3 style="color: #1e5f79; margin-top: 0;">👤 Patient Information</h3>
        <p><strong>Name:</strong> ${selectedBooking.patientUser?.full_name || 'N/A'}</p>
        <p><strong>Phone:</strong> ${selectedBooking.patientUser?.phone || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> ${selectedBooking.patientUser?.date_of_birth ? new Date(selectedBooking.patientUser.date_of_birth).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Appointment Date:</strong> ${new Date(selectedBooking.scheduled_date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${selectedBooking.scheduled_time}</p>
        <p><strong>Duration:</strong> ${selectedBooking.duration_minutes} minutes</p>
        <p><strong>Visit Type:</strong> ${selectedBooking.visit_type.replace(/_/g, ' ')}</p>
        <p><strong>Visit Mode:</strong> ${selectedBooking.visit_mode === 'HOME_VISIT' ? 'Home Visit' : 'Online'}</p>
        ${selectedBooking.chief_complaint ? `<p><strong>Chief Complaint:</strong> ${selectedBooking.chief_complaint}</p>` : ''}
        ${selectedBooking.patient_address ? `<p><strong>Address:</strong> ${selectedBooking.patient_address}</p>` : ''}
      </div>
      <div class="info-box">
        <h3 style="color: #1e5f79; margin-top: 0;">👨‍⚕️ Doctor Information</h3>
        <p><strong>Name:</strong> Dr. ${selectedBooking.physiotherapist?.full_name || 'N/A'}</p>
        <p><strong>Phone:</strong> ${selectedBooking.physiotherapist?.phone || 'N/A'}</p>
        <p><strong>Specializations:</strong> ${selectedBooking.physiotherapist?.specializations?.join(', ') || 'N/A'}</p>
        <p><strong>Experience:</strong> ${selectedBooking.physiotherapist?.experience || 'N/A'} years</p>
        <p><strong>Rating:</strong> ${selectedBooking.physiotherapist?.rating || 'N/A'}/5</p>
        <p><strong>Total Amount:</strong> ₹${selectedBooking.total_amount}</p>
        <p><strong>Consultation Fee:</strong> ₹${selectedBooking.consultation_fee}</p>
        ${selectedBooking.travel_fee && parseFloat(selectedBooking.travel_fee) > 0 ? `<p><strong>Travel Fee:</strong> ₹${selectedBooking.travel_fee}</p>` : ''}
      </div>
    </div>
  </div>

  ${selectedProtocol.general_notes ? `
  <div class="section">
    <div class="section-title">📝 General Notes</div>
    <div class="info-box">${selectedProtocol.general_notes}</div>
  </div>
  ` : ''}

  ${selectedProtocol.exercises && selectedProtocol.exercises.length > 0 ? `
  <div class="section">
    <div class="section-title">💪 Exercises (${selectedProtocol.exercises.length})</div>
    ${selectedProtocol.exercises
      .sort((a, b) => a.order_index - b.order_index)
      .map((exercise, index) => `
        <div class="exercise">
          <div class="exercise-title">${index + 1}. ${exercise.exercise_name}</div>
          <p style="margin: 8px 0;">${exercise.exercise_description}</p>
          <div class="exercise-details">
            <div class="exercise-detail">
              <strong>Sets</strong><br>
              ${exercise.custom_sets}
            </div>
            <div class="exercise-detail">
              <strong>Reps</strong><br>
              ${exercise.custom_reps}
            </div>
            <div class="exercise-detail">
              <strong>Duration</strong><br>
              ${exercise.custom_duration_seconds}s
            </div>
            <div class="exercise-detail">
              <strong>Frequency</strong><br>
              ${exercise.frequency}
            </div>
          </div>
          ${exercise.custom_notes ? `<p style="margin-top: 10px; font-style: italic;"><strong>Notes:</strong> ${exercise.custom_notes}</p>` : ''}
        </div>
      `).join('')}
  </div>
  ` : ''}

  ${selectedProtocol.affectedAreas && selectedProtocol.affectedAreas.length > 0 ? `
  <div class="section">
    <div class="section-title">🎯 Affected Areas</div>
    ${selectedProtocol.affectedAreas.map(area => `
      <div class="affected-area">
        <strong>${area.structure_name}</strong><br>
        <small>Type: ${area.structure_type} • Category: ${area.structure_category}</small>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${selectedProtocol.recommendations && selectedProtocol.recommendations.length > 0 ? `
  <div class="section">
    <div class="section-title">💡 Recommendations</div>
    ${selectedProtocol.recommendations.map(rec => `
      ${rec.recommended_foods && rec.recommended_foods.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="color: #1e5f79; margin-bottom: 8px;">🥗 Recommended Foods</h4>
          <div class="food-tags">
            ${rec.recommended_foods.map(food => `<span class="food-tag">${food}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      
      ${rec.supplements && rec.supplements.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="color: #1e5f79; margin-bottom: 8px;">💊 Supplements</h4>
          <ul style="margin: 0;">${rec.supplements.map(supplement => `<li>${supplement}</li>`).join('')}</ul>
        </div>
      ` : ''}
      
      ${rec.general_guidelines && rec.general_guidelines.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="color: #1e5f79; margin-bottom: 8px;">📋 General Guidelines</h4>
          <ul style="margin: 0;">${rec.general_guidelines.map(guideline => `<li>${guideline}</li>`).join('')}</ul>
        </div>
      ` : ''}
      
      ${rec.general_advice && rec.general_advice.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="color: #1e5f79; margin-bottom: 8px;">💬 General Advice</h4>
          <ul style="margin: 0;">${rec.general_advice.map(advice => `<li>${advice}</li>`).join('')}</ul>
        </div>
      ` : ''}
      
      ${rec.precautions && rec.precautions.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="color: #1e5f79; margin-bottom: 8px;">⚠️ Precautions</h4>
          <ul style="margin: 0;">${rec.precautions.map(precaution => `<li>${precaution}</li>`).join('')}</ul>
        </div>
      ` : ''}
      
      ${rec.hydration_notes ? `
        <div style="margin-bottom: 20px;">
          <h4 style="color: #1e5f79; margin-bottom: 8px;">💧 Hydration</h4>
          <div class="info-box" style="margin: 0;">${rec.hydration_notes}</div>
        </div>
      ` : ''}

      ${rec.blood_tests && rec.blood_tests.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="color: #1e5f79; margin-bottom: 8px;">🩸 Recommended Blood Tests</h4>
          <ul style="margin: 0;">${rec.blood_tests.map(test => `<li>${test}</li>`).join('')}</ul>
        </div>
      ` : ''}
    `).join('')}
  </div>
  ` : ''}

  <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ccc; padding-top: 20px;">
    <p><strong>Treatment Protocol Document</strong></p>
    <p>Generated on ${new Date().toLocaleString()}</p>
    <p style="font-style: italic;">This document contains confidential medical information.</p>
    <p style="font-size: 10px;">Protocol ID: ${selectedProtocol.id}</p>
  </div>
</body>
</html>`;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `Treatment_Protocol_${selectedProtocol.protocol_title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Show loading state during initialization
  if (initializing) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '100vh', backgroundColor: '#eff8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #c8eaeb',
              borderTop: '3px solid #1e5f79',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <div style={{ color: '#000000', fontSize: '1rem' }}>
              Loading your bookings...
            </div>
          </div>
        </div>
      </>
    );
  }

  // Redirect will happen in useEffect if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '100vh', backgroundColor: '#eff8ff', paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{
              textAlign: 'center',
              padding: '3rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #c8eaeb',
                borderTop: '3px solid #1e5f79',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <div style={{ color: '#000000', fontSize: '1rem' }}>
                Loading your bookings...
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', backgroundColor: '#eff8ff', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
          
          {/* Breadcrumbs */}
          <nav style={{ marginBottom: '2rem' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              padding: '1rem 1.5rem',
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}>
                <Link href="/" style={{ 
                  color: '#1e5f79', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <HomeIcon style={{ width: '1rem', height: '1rem' }} />
                  Home
                </Link>
                <ChevronRight style={{ width: '1rem', height: '1rem', color: '#c8eaeb' }} />
                <Link href="/profile" style={{ color: '#1e5f79', textDecoration: 'none' }}>
                  Profile
                </Link>
                <ChevronRight style={{ width: '1rem', height: '1rem', color: '#c8eaeb' }} />
                <span style={{ color: '#000000', fontWeight: '500' }}>My Bookings</span>
              </div>
            </div>
          </nav>
          
          {/* Page Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              color: '#000000',
              fontSize: '2rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              My Bookings
            </div>
            <div style={{ color: '#1e5f79', fontSize: '1rem' }}>
              Track your appointments and session history
            </div>
          </div>

          {/* Compact Stats */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '0.75rem',
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#c8eaeb',
            borderRadius: '0.75rem'
          }}>
            {[
              { label: 'Total', value: statusCounts.total, color: '#000000' },
              { label: 'Pending', value: statusCounts.pending, color: '#1e5f79' },
              { label: 'Scheduled', value: statusCounts.scheduled, color: '#1e5f79' },
              { label: 'In Progress', value: statusCounts.in_progress, color: '#1e5f79' },
              { label: 'Completed', value: statusCounts.completed, color: '#1e5f79' },
              { label: 'Cancelled', value: statusCounts.cancelled, color: '#000000' }
            ].map((stat) => (
              <div key={stat.label} style={{ 
                textAlign: 'center',
                padding: '0.75rem 0.5rem'
              }}>
                <div style={{ 
                  color: stat.color,
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '0.25rem'
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  color: stat.color,
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bookings List */}
          {bookings.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {bookings.map((booking) => (
                <div 
                  key={booking.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #c8eaeb',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    alignItems: 'start'
                  }}>
                    {/* Main Content */}
                    <div>
                      {/* Header with Status */}
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem'
                      }}>
                        {getStatusIcon(booking.status)}
                        <span 
                          style={{ 
                            padding: '0.125rem 0.5rem',
                            backgroundColor: getStatusColor(booking.status),
                            color: '#ffffff',
                            borderRadius: '0.75rem',
                            fontSize: '0.6875rem',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                          }}
                        >
                          {booking.status.toLowerCase()}
                        </span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {booking.visit_mode === 'HOME_VISIT' ? (
                            <HomeIcon style={{ width: '0.875rem', height: '0.875rem', color: '#1e5f79' }} />
                          ) : (
                            <Video style={{ width: '0.875rem', height: '0.875rem', color: '#1e5f79' }} />
                          )}
                          <span style={{ color: '#000000', fontSize: '0.75rem', fontWeight: '500' }}>
                            {booking.visit_mode === 'HOME_VISIT' ? 'Home Visit' : 'Online'}
                          </span>
                        </div>
                      </div>

                      {/* Patient and Doctor Info */}
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '0.5rem',
                        marginBottom: '0.75rem'
                      }}>
                        {/* Patient Info */}
                        {booking.patientUser && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: '#c8eaeb',
                            borderRadius: '0.5rem'
                          }}>
                            <div style={{
                              width: '1.5rem',
                              height: '1.5rem',
                              borderRadius: '50%',
                              backgroundColor: '#1e5f79',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <User style={{ width: '0.75rem', height: '0.75rem', color: '#ffffff' }} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ 
                                color: '#1e5f79',
                                fontSize: '0.625rem',
                                marginBottom: '0.125rem',
                                fontWeight: '500'
                              }}>
                                Patient
                              </div>
                              <div style={{ 
                                color: '#000000',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {booking.patientUser.full_name}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Doctor Info */}
                        {booking.physiotherapist && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: '#eff8ff',
                            borderRadius: '0.5rem'
                          }}>
                            <div style={{
                              width: '1.5rem',
                              height: '1.5rem',
                              borderRadius: '50%',
                              backgroundColor: '#1e5f79',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <User style={{ width: '0.75rem', height: '0.75rem', color: '#ffffff' }} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ 
                                color: '#1e5f79',
                                fontSize: '0.625rem',
                                marginBottom: '0.125rem',
                                fontWeight: '500'
                              }}>
                                Doctor
                              </div>
                              <div style={{ 
                                color: '#000000',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                Dr. {booking.physiotherapist.full_name}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Session Details */}
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <Calendar style={{ width: '0.875rem', height: '0.875rem', color: '#1e5f79' }} />
                          <span style={{ color: '#000000', fontSize: '0.75rem', fontWeight: '500' }}>
                            {new Date(booking.scheduled_date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <Clock style={{ width: '0.875rem', height: '0.875rem', color: '#1e5f79' }} />
                          <span style={{ color: '#000000', fontSize: '0.75rem', fontWeight: '500' }}>
                            {booking.scheduled_time} ({booking.duration_minutes}m)
                          </span>
                        </div>

                        {booking.patient_address && booking.visit_mode === 'HOME_VISIT' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', gridColumn: '1 / -1' }}>
                            <MapPin style={{ width: '0.875rem', height: '0.875rem', color: '#1e5f79' }} />
                            <span style={{ 
                              color: '#000000',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {booking.patient_address}
                            </span>
                          </div>
                        )}
                      </div>

                      {booking.chief_complaint && (
                        <div style={{ 
                          marginTop: '0.75rem',
                          padding: '0.5rem',
                          backgroundColor: '#c8eaeb',
                          borderRadius: '0.375rem'
                        }}>
                          <div style={{ 
                            color: '#1e5f79',
                            fontSize: '0.625rem',
                            fontWeight: '500',
                            marginBottom: '0.25rem'
                          }}>
                            Complaint:
                          </div>
                          <div style={{ 
                            color: '#000000',
                            fontSize: '0.75rem',
                            lineHeight: '1.3'
                          }}>
                            {booking.chief_complaint}
                          </div>
                        </div>
                      )}

                      {/* Join Link for Online Appointments */}
                      {booking.visit_mode === 'ONLINE' && booking.video_link && (booking.status === 'SCHEDULED' || booking.status === 'IN_PROGRESS') && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <button
                            onClick={() => {
                              if (booking.video_link) {
                                window.open(booking.video_link, '_blank');
                              }
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.375rem',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#1e5f79',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '0.5rem',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#0f3a47';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#1e5f79';
                            }}
                          >
                            <Video style={{ width: '0.875rem', height: '0.875rem' }} />
                            Join Session
                            <ExternalLink style={{ width: '0.75rem', height: '0.75rem' }} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                      <div style={{ 
                        color: '#1e5f79',
                        fontSize: '1.125rem',
                        fontWeight: '700'
                      }}>
                        ₹{parseFloat(booking.total_amount).toFixed(0)}
                      </div>
                    </div>
                  </div>

                  {/* Prominent Action Button */}
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #c8eaeb' }}>
                    {booking.treatmentProtocol ? (
                      <button 
                        onClick={() => {
                          setSelectedProtocol(booking.treatmentProtocol!);
                          setSelectedBooking(booking);
                          setShowProtocolModal(true);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.75rem',
                          padding: '1rem',
                          backgroundColor: '#1e5f79',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 8px rgba(30, 95, 121, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0f3a47';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(30, 95, 121, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#1e5f79';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(30, 95, 121, 0.3)';
                        }}
                      >
                        <FileText style={{ width: '1.25rem', height: '1.25rem' }} />
                        View Treatment Protocol
                        <ChevronRight style={{ width: '1.25rem', height: '1.25rem' }} />
                      </button>
                    ) : (
                      <Link href={`/bookings/${booking.id}`} style={{ textDecoration: 'none' }}>
                        <button style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.75rem',
                          padding: '1rem',
                          backgroundColor: '#1e5f79',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 8px rgba(30, 95, 121, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0f3a47';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 12px rgba(30, 95, 121, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#1e5f79';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(30, 95, 121, 0.3)';
                        }}>
                          <User style={{ width: '1.25rem', height: '1.25rem' }} />
                          View Booking Details
                          <ChevronRight style={{ width: '1.25rem', height: '1.25rem' }} />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <Calendar style={{ 
                width: '4rem', 
                height: '4rem', 
                color: '#c8eaeb',
                margin: '0 auto 1rem'
              }} />
              <div style={{ 
                color: '#000000',
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                No bookings yet
              </div>
              <div style={{ 
                color: '#1e5f79',
                fontSize: '1rem',
                marginBottom: '2rem'
              }}>
                Book your first physiotherapy session to get started
              </div>
            </div>
          )}

          {/* Protocol Modal */}
          {showProtocolModal && selectedProtocol && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '0.5rem'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '1rem',
                maxWidth: '95vw',
                width: '100%',
                maxHeight: '95vh',
                overflow: 'auto',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
              }}>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderBottom: '1px solid #c8eaeb',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <h2 style={{
                      fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                      fontWeight: '700',
                      color: '#000000',
                      margin: 0,
                      marginBottom: '0.25rem',
                      lineHeight: '1.2'
                    }}>
                      {selectedProtocol.protocol_title}
                    </h2>
                    <p style={{
                      color: '#1e5f79',
                      fontSize: '0.875rem',
                      margin: 0
                    }}>
                      Status: {selectedProtocol.status}
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    {/* Export PDF Button */}
                    <button
                      onClick={exportToPDF}
                      disabled={isExportingPDF}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: isExportingPDF ? '#c8eaeb' : '#1e5f79',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: isExportingPDF ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isExportingPDF) {
                          e.currentTarget.style.backgroundColor = '#0f3a47';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isExportingPDF) {
                          e.currentTarget.style.backgroundColor = '#1e5f79';
                        }
                      }}
                    >
                      <Download style={{ width: '1rem', height: '1rem' }} />
                      {isExportingPDF ? 'Exporting...' : 'Export PDF'}
                    </button>

                    {/* Close Button */}
                    <button
                      onClick={() => {
                        setShowProtocolModal(false);
                        setSelectedProtocol(null);
                        setSelectedBooking(null);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        color: '#000000'
                      }}
                    >
                      <X style={{ width: '1.5rem', height: '1.5rem' }} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  {/* General Notes */}
                  {selectedProtocol.general_notes && (
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <FileText style={{ width: '1.25rem', height: '1.25rem', color: '#1e5f79' }} />
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#000000',
                          margin: 0
                        }}>
                          General Notes
                        </h3>
                      </div>
                      <div style={{
                        backgroundColor: '#eff8ff',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        color: '#000000',
                        lineHeight: '1.5'
                      }}>
                        {selectedProtocol.general_notes}
                      </div>
                    </div>
                  )}

                  {/* Exercises */}
                  {selectedProtocol.exercises && selectedProtocol.exercises.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <Activity style={{ width: '1.25rem', height: '1.25rem', color: '#1e5f79' }} />
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#000000',
                          margin: 0
                        }}>
                          Exercises ({selectedProtocol.exercises?.length || 0})
                        </h3>
                      </div>
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {[...(selectedProtocol.exercises || [])]
                          .sort((a, b) => a.order_index - b.order_index)
                          .map((exercise, index) => (
                          <div key={exercise.id} style={{
                            backgroundColor: '#c8eaeb',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            border: '1px solid #1e5f79'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              marginBottom: '0.5rem'
                            }}>
                              <div style={{
                                backgroundColor: '#1e5f79',
                                color: '#ffffff',
                                borderRadius: '50%',
                                width: '1.5rem',
                                height: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                              }}>
                                {index + 1}
                              </div>
                              <h4 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#000000',
                                margin: 0
                              }}>
                                {exercise.exercise_name}
                              </h4>
                            </div>
                            <p style={{
                              color: '#000000',
                              fontSize: '0.875rem',
                              lineHeight: '1.4',
                              margin: '0 0 0.75rem 0'
                            }}>
                              {exercise.exercise_description}
                            </p>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                              gap: '0.5rem',
                              fontSize: 'clamp(0.625rem, 2vw, 0.75rem)'
                            }}>
                              <div style={{
                                backgroundColor: '#ffffff',
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                textAlign: 'center'
                              }}>
                                <div style={{ color: '#1e5f79', fontWeight: '500' }}>Sets</div>
                                <div style={{ color: '#000000', fontWeight: '600' }}>{exercise.custom_sets}</div>
                              </div>
                              <div style={{
                                backgroundColor: '#ffffff',
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                textAlign: 'center'
                              }}>
                                <div style={{ color: '#1e5f79', fontWeight: '500' }}>Reps</div>
                                <div style={{ color: '#000000', fontWeight: '600' }}>{exercise.custom_reps}</div>
                              </div>
                              <div style={{
                                backgroundColor: '#ffffff',
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                textAlign: 'center'
                              }}>
                                <div style={{ color: '#1e5f79', fontWeight: '500' }}>Duration</div>
                                <div style={{ color: '#000000', fontWeight: '600' }}>{exercise.custom_duration_seconds}s</div>
                              </div>
                              <div style={{
                                backgroundColor: '#ffffff',
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                textAlign: 'center'
                              }}>
                                <div style={{ color: '#1e5f79', fontWeight: '500' }}>Frequency</div>
                                <div style={{ color: '#000000', fontWeight: '600' }}>{exercise.frequency}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Affected Areas */}
                  {selectedProtocol.affectedAreas && selectedProtocol.affectedAreas.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <Target style={{ width: '1.25rem', height: '1.25rem', color: '#1e5f79' }} />
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#000000',
                          margin: 0
                        }}>
                          Affected Areas
                        </h3>
                      </div>
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {selectedProtocol.affectedAreas.map((area) => (
                          <div key={area.id} style={{
                            backgroundColor: '#eff8ff',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #c8eaeb'
                          }}>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#000000',
                              marginBottom: '0.25rem'
                            }}>
                              {area.structure_name}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#1e5f79',
                              textTransform: 'capitalize'
                            }}>
                              Type: {area.structure_type} • Category: {area.structure_category}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {selectedProtocol.recommendations && selectedProtocol.recommendations.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <Heart style={{ width: '1.25rem', height: '1.25rem', color: '#1e5f79' }} />
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#000000',
                          margin: 0
                        }}>
                          Recommendations
                        </h3>
                      </div>
                      {selectedProtocol.recommendations.map((rec) => (
                        <div key={rec.id} style={{
                          backgroundColor: '#eff8ff',
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          marginBottom: '1rem'
                        }}>
                          {/* Recommended Foods */}
                          {rec.recommended_foods && rec.recommended_foods.length > 0 && (
                            <div style={{ marginBottom: '1rem' }}>
                              <h4 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#000000',
                                margin: '0 0 0.5rem 0'
                              }}>
                                Recommended Foods
                              </h4>
                              <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem'
                              }}>
                                {rec.recommended_foods.map((food, index) => (
                                  <span key={index} style={{
                                    backgroundColor: '#c8eaeb',
                                    color: '#000000',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.75rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '500'
                                  }}>
                                    {food}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Supplements */}
                          {rec.supplements && rec.supplements.length > 0 && (
                            <div style={{ marginBottom: '1rem' }}>
                              <h4 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#000000',
                                margin: '0 0 0.5rem 0'
                              }}>
                                Supplements
                              </h4>
                              <ul style={{
                                margin: 0,
                                paddingLeft: '1.25rem',
                                color: '#000000',
                                fontSize: '0.875rem'
                              }}>
                                {rec.supplements.map((supplement, index) => (
                                  <li key={index} style={{ marginBottom: '0.25rem' }}>
                                    {supplement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* General Guidelines */}
                          {rec.general_guidelines && rec.general_guidelines.length > 0 && (
                            <div style={{ marginBottom: '1rem' }}>
                              <h4 style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#000000',
                                margin: '0 0 0.5rem 0'
                              }}>
                                General Guidelines
                              </h4>
                              <ul style={{
                                margin: 0,
                                paddingLeft: '1.25rem',
                                color: '#000000',
                                fontSize: '0.875rem'
                              }}>
                                {rec.general_guidelines.map((guideline, index) => (
                                  <li key={index} style={{ marginBottom: '0.25rem' }}>
                                    {guideline}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Hydration Notes */}
                          {rec.hydration_notes && (
                            <div style={{
                              backgroundColor: '#c8eaeb',
                              padding: '0.75rem',
                              borderRadius: '0.5rem',
                              marginTop: '1rem'
                            }}>
                              <h4 style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#1e5f79',
                                margin: '0 0 0.25rem 0'
                              }}>
                                Hydration
                              </h4>
                              <p style={{
                                color: '#000000',
                                fontSize: '0.875rem',
                                margin: 0
                              }}>
                                {rec.hydration_notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingsPage;