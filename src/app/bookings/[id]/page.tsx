'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import ApiManager from '@/services/api';
import Header from '@/components/layout/Header';
import TreatmentProtocolView from '@/components/treatment/TreatmentProtocolView';
import { 
  ArrowLeft, User, Phone, Mail, Calendar, MapPin, Clock, 
  Activity, FileText, CheckCircle, XCircle, AlertCircle,
  Home as HomeIcon, Video, Star, Download, Eye, Edit
} from 'lucide-react';

interface PatientUser {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  account_type?: string;
  relationship?: string;
}

interface Physiotherapist {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
}

interface Booking {
  id: string;
  patient_id?: string;
  clinic_id?: string;
  physiotherapist_id: string;
  visit_type: string;
  visit_mode: 'HOME_VISIT' | 'ONLINE';
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: string;
  chief_complaint?: string;
  patient_address?: string;
  consultation_fee?: string;
  travel_fee?: string;
  total_amount?: string;
  visit_source?: string;
  patient_user_id?: string;
  physiotherapist?: Physiotherapist;
  patientUser?: PatientUser;
  created_at: string;
  updated_at: string;
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTreatmentProtocol, setShowTreatmentProtocol] = useState(false);
  const [protocolExists, setProtocolExists] = useState(false);
  const [checkingProtocol, setCheckingProtocol] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchBookingDetails();
      checkProtocolExists();
    }
  }, [params.id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getBooking(params.id as string);
      if (response.success && response.data) {
        setBooking(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkProtocolExists = async () => {
    try {
      setCheckingProtocol(true);
      const response = await ApiManager.checkTreatmentProtocolExists(params.id as string);
      if (response.success && response.data) {
        setProtocolExists(response.data.exists);
      }
    } catch (error) {
      console.error('Failed to check protocol existence:', error);
      setProtocolExists(false);
    } finally {
      setCheckingProtocol(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Clock className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Activity className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Booking Details
                </h1>
                <p className="text-sm text-gray-500">
                  {formatDate(booking.scheduled_date)} • {formatTime(booking.scheduled_time)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusIcon(booking.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                {booking.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Booking Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Appointment Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physiotherapist Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Physiotherapist</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{booking.physiotherapist?.full_name}</p>
                  <p className="text-sm text-gray-500">{booking.physiotherapist?.phone}</p>
                </div>
              </div>
            </div>

            {/* Visit Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Visit Details</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">Type:</span>
                  <span className="text-gray-900">{booking.visit_type.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">Mode:</span>
                  <div className="flex items-center space-x-1">
                    {booking.visit_mode === 'ONLINE' ? (
                      <Video className="h-4 w-4 text-blue-600" />
                    ) : (
                      <HomeIcon className="h-4 w-4 text-green-600" />
                    )}
                    <span className="text-gray-900">
                      {booking.visit_mode === 'ONLINE' ? 'Online Consultation' : 'Home Visit'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">Duration:</span>
                  <span className="text-gray-900">{booking.duration_minutes} minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          {booking.chief_complaint && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Chief Complaint</h3>
              <p className="text-gray-900">{booking.chief_complaint}</p>
            </div>
          )}

          {/* Address for Home Visits */}
          {booking.visit_mode === 'HOME_VISIT' && booking.patient_address && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Visit Address</h3>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <p className="text-gray-900">{booking.patient_address}</p>
              </div>
            </div>
          )}

          {/* Pricing */}
          {booking.total_amount && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Pricing</h3>
              <div className="space-y-2">
                {booking.consultation_fee && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Consultation Fee:</span>
                    <span className="text-gray-900">₹{booking.consultation_fee}</span>
                  </div>
                )}
                {booking.travel_fee && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Travel Fee:</span>
                    <span className="text-gray-900">₹{booking.travel_fee}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium pt-2 border-t">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-gray-900">₹{booking.total_amount}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Treatment Protocol Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Treatment Protocol</h2>
            {protocolExists && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowTreatmentProtocol(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Protocol
                </button>
              </div>
            )}
          </div>
          
          {checkingProtocol ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Checking for treatment protocol...</p>
            </div>
          ) : protocolExists ? (
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Treatment protocol available</p>
                <p className="text-sm text-green-600">Your physiotherapist has created a personalized treatment plan for you.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">No treatment protocol yet</p>
                <p className="text-sm text-gray-500">Your physiotherapist will create a treatment plan after your session.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Treatment Protocol Modal */}
      {showTreatmentProtocol && (
        <TreatmentProtocolView
          visitId={booking.id}
          isOpen={showTreatmentProtocol}
          onClose={() => setShowTreatmentProtocol(false)}
        />
      )}
    </div>
  );
}