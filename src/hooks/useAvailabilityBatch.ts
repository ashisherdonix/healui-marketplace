'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ApiManager from '@/services/api';
import { PhysiotherapistBatchAvailability, AvailabilityServiceType } from '@/lib/types';

interface UseAvailabilityBatchOptions {
  physiotherapistIds: string[];
  userLocation?: {
    pincode?: string;
    lat?: number;
    lng?: number;
  };
  serviceTypes?: AvailabilityServiceType[];
  days?: number;
  enabled?: boolean;
}

interface UseAvailabilityBatchReturn {
  availability: Record<string, PhysiotherapistBatchAvailability>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useAvailabilityBatch = ({
  physiotherapistIds,
  userLocation,
  serviceTypes = ['HOME_VISIT', 'ONLINE'],
  days = 3,
  enabled = true
}: UseAvailabilityBatchOptions): UseAvailabilityBatchReturn => {
  const [availability, setAvailability] = useState<Record<string, PhysiotherapistBatchAvailability>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [retryAttempts, setRetryAttempts] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const MAX_RETRY_ATTEMPTS = 3;

  const isStale = Date.now() - lastFetchTime > CACHE_DURATION;

  const fetchAvailability = useCallback(async () => {
    if (!enabled || physiotherapistIds.length === 0) {
      return;
    }

    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Get current date in Indian timezone (IST: UTC+5:30)
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
      const istDate = new Date(now.getTime() + istOffset);
      const today = istDate.toISOString().split('T')[0];
      
      console.log('🔄 Fetching batch availability for', physiotherapistIds.length, 'physiotherapists');
      
      const response = await ApiManager.getBatchAvailability({
        ids: physiotherapistIds,
        date: today,
        days,
        service_types: serviceTypes,
        patient_pincode: userLocation?.pincode,
        patient_lat: userLocation?.lat,
        patient_lng: userLocation?.lng,
        duration: 60
      });

      if (response.success && response.data) {
        setAvailability(response.data);
        setLastFetchTime(Date.now());
        setRetryAttempts(0); // Reset retry attempts on success
        console.log('✅ Batch availability loaded for', Object.keys(response.data).length, 'physiotherapists');
      } else {
        throw new Error(response.message || 'Failed to load availability');
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        console.log('🚫 Availability request aborted');
        return;
      }
      
      console.error('❌ Failed to fetch batch availability:', err);
      setError(err instanceof Error ? err.message : 'Failed to load availability');
      setRetryAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [physiotherapistIds.join(','), userLocation?.pincode, serviceTypes.join(','), days, enabled]);

  // Initial fetch
  useEffect(() => {
    fetchAvailability();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAvailability]);

  // Auto-refresh when data becomes stale (but not if we've hit retry limit due to errors)
  useEffect(() => {
    if (isStale && enabled && !loading && retryAttempts < MAX_RETRY_ATTEMPTS) {
      console.log('🔄 Auto-refreshing stale availability data');
      fetchAvailability();
    } else if (retryAttempts >= MAX_RETRY_ATTEMPTS) {
      console.log('⚠️ Max retry attempts reached, stopping auto-refresh');
    }
  }, [isStale, enabled, loading, retryAttempts, fetchAvailability]);

  const refetch = useCallback(async () => {
    await fetchAvailability();
  }, [fetchAvailability]);

  return {
    availability,
    loading,
    error,
    refetch,
    isStale
  };
};

// Helper functions for availability processing
export const getNextAvailableSlot = (
  availability: PhysiotherapistBatchAvailability | undefined,
  serviceType: 'HOME_VISIT' | 'ONLINE' | 'ALL'
) => {
  if (!availability?.availability) return null;

  const today = new Date();
  const dates = Object.keys(availability.availability).sort();

  for (const date of dates) {
    const dayAvailability = availability.availability[date];
    const dateObj = new Date(date);
    
    // Check service type availability
    const slots = serviceType === 'ALL' 
      ? [...(dayAvailability.online || []), ...(dayAvailability.home_visit || [])]
      : serviceType === 'ONLINE'
      ? (dayAvailability.online || [])
      : (dayAvailability.home_visit || []);

    const availableSlot = slots.find(slot => slot.is_available);
    
    if (availableSlot) {
      const isToday = dateObj.toDateString() === today.toDateString();
      const isTomorrow = dateObj.toDateString() === new Date(today.getTime() + 24*60*60*1000).toDateString();
      
      return {
        slot: availableSlot,
        date: dateObj,
        isToday,
        isTomorrow,
        time: availableSlot.start_time,
        day: isToday ? 'Today' : isTomorrow ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      };
    }
  }

  return null;
};

export const getPricingForService = (
  pricing: PhysiotherapistBatchAvailability['pricing'] | undefined,
  serviceType: 'HOME_VISIT' | 'ONLINE' | 'CLINIC' | 'ALL',
  userLocation?: { pincode?: string }
) => {
  if (!pricing) return null;

  switch (serviceType) {
    case 'HOME_VISIT':
      return pricing.home_visit ? {
        total: pricing.home_visit.total,
        consultationFee: pricing.home_visit.consultation_fee,
        travelFee: pricing.home_visit.travel_fee,
        extraCharge: pricing.home_visit.zone_extra_charge,
        breakdown: pricing.home_visit.zone_breakdown
      } : null;
    
    case 'ONLINE':
      return pricing.online ? {
        total: pricing.online.total,
        consultationFee: pricing.online.consultation_fee,
        platformFee: pricing.online.platform_fee,
        extraCharge: 0
      } : null;
    
    case 'CLINIC':
      return pricing.clinic ? {
        total: pricing.clinic.total,
        consultationFee: pricing.clinic.consultation_fee,
        extraCharge: 0
      } : null;
    
    default:
      // Return cheapest option for ALL
      const options = [];
      if (pricing.online) options.push({ ...pricing.online, type: 'ONLINE' });
      if (pricing.clinic) options.push({ ...pricing.clinic, type: 'CLINIC' });
      if (pricing.home_visit) options.push({ ...pricing.home_visit, type: 'HOME_VISIT' });
      
      return options.sort((a, b) => a.total - b.total)[0] || null;
  }
};