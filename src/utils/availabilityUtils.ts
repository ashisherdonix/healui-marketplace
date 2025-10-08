import { DayAvailability, AvailabilitySlot } from '@/lib/types';

export interface TodayAvailability {
  hasSlots: boolean;
  online: {
    slots: AvailabilitySlot[];
    timeRanges: string[];
    fullRange?: string; // e.g. "9:00 AM - 5:00 PM"
    nextSlot?: AvailabilitySlot;
  };
  home_visit: {
    slots: AvailabilitySlot[];
    timeRanges: string[];
    fullRange?: string; // e.g. "11:30 AM - 8:30 PM"
    nextSlot?: AvailabilitySlot;
  };
  earliestSlot?: {
    type: 'online' | 'home_visit';
    time: string;
    slot: AvailabilitySlot;
  };
}

export function getTodayAvailability(
  availability: Record<string, DayAvailability> | undefined
): TodayAvailability {
  const today = new Date().toISOString().split('T')[0];
  const todaySlots = availability?.[today];

  const result: TodayAvailability = {
    hasSlots: false,
    online: { slots: [], timeRanges: [] },
    home_visit: { slots: [], timeRanges: [] }
  };

  if (!todaySlots) {
    return result;
  }

  // Process online slots
  if (todaySlots.online && todaySlots.online.length > 0) {
    const availableOnlineSlots = todaySlots.online.filter(slot => slot.is_available);
    result.online.slots = availableOnlineSlots;
    result.online.timeRanges = groupConsecutiveSlots(availableOnlineSlots);
    result.online.nextSlot = availableOnlineSlots[0];
    
    // Get full range from first to last slot
    if (availableOnlineSlots.length > 0) {
      const firstSlot = availableOnlineSlots[0];
      const lastSlot = availableOnlineSlots[availableOnlineSlots.length - 1];
      result.online.fullRange = `${formatTime(firstSlot.start_time)} - ${formatTime(lastSlot.end_time)}`;
    }
  }

  // Process home visit slots
  if (todaySlots.home_visit && todaySlots.home_visit.length > 0) {
    const availableHomeSlots = todaySlots.home_visit.filter(slot => slot.is_available);
    result.home_visit.slots = availableHomeSlots;
    result.home_visit.timeRanges = groupConsecutiveSlots(availableHomeSlots);
    result.home_visit.nextSlot = availableHomeSlots[0];
    
    // Get full range from first to last slot
    if (availableHomeSlots.length > 0) {
      const firstSlot = availableHomeSlots[0];
      const lastSlot = availableHomeSlots[availableHomeSlots.length - 1];
      result.home_visit.fullRange = `${formatTime(firstSlot.start_time)} - ${formatTime(lastSlot.end_time)}`;
    }
  }

  // Determine earliest available slot
  const allSlots = [
    ...result.online.slots.map(slot => ({ type: 'online' as const, slot })),
    ...result.home_visit.slots.map(slot => ({ type: 'home_visit' as const, slot }))
  ];

  if (allSlots.length > 0) {
    // Sort by start time to find earliest
    allSlots.sort((a, b) => a.slot.start_time.localeCompare(b.slot.start_time));
    const earliest = allSlots[0];
    result.earliestSlot = {
      type: earliest.type,
      time: earliest.slot.start_time,
      slot: earliest.slot
    };
    result.hasSlots = true;
  }

  return result;
}

function groupConsecutiveSlots(slots: AvailabilitySlot[]): string[] {
  if (slots.length === 0) return [];

  // Sort slots by start time
  const sortedSlots = [...slots].sort((a, b) => a.start_time.localeCompare(b.start_time));
  
  const ranges: string[] = [];
  let currentRangeStart = sortedSlots[0];
  let currentRangeEnd = sortedSlots[0];

  for (let i = 1; i < sortedSlots.length; i++) {
    const currentSlot = sortedSlots[i];
    const prevSlotEndTime = currentRangeEnd.end_time;
    const currentSlotStartTime = currentSlot.start_time;

    // Check if slots are consecutive (end time of previous = start time of current)
    if (prevSlotEndTime === currentSlotStartTime) {
      currentRangeEnd = currentSlot;
    } else {
      // Add completed range
      if (currentRangeStart.start_time === currentRangeEnd.end_time) {
        ranges.push(formatTime(currentRangeStart.start_time));
      } else {
        ranges.push(`${formatTime(currentRangeStart.start_time)} - ${formatTime(currentRangeEnd.end_time)}`);
      }
      
      // Start new range
      currentRangeStart = currentSlot;
      currentRangeEnd = currentSlot;
    }
  }

  // Add final range
  if (currentRangeStart.start_time === currentRangeEnd.end_time) {
    ranges.push(formatTime(currentRangeStart.start_time));
  } else {
    ranges.push(`${formatTime(currentRangeStart.start_time)} - ${formatTime(currentRangeEnd.end_time)}`);
  }

  return ranges;
}

function formatTime(time: string): string {
  // Convert 24-hour format (HH:mm) to 12-hour format
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function getNextAvailableSlot(
  availability: Record<string, DayAvailability> | undefined
): { date: string; time: string; type: 'online' | 'home_visit' } | null {
  if (!availability) return null;

  const today = new Date();
  const dates = Object.keys(availability).sort();

  for (const date of dates) {
    const daySlots = availability[date];
    const allSlots = [
      ...(daySlots.online?.filter(slot => slot.is_available).map(slot => ({ ...slot, type: 'online' as const })) || []),
      ...(daySlots.home_visit?.filter(slot => slot.is_available).map(slot => ({ ...slot, type: 'home_visit' as const })) || [])
    ];

    if (allSlots.length > 0) {
      // Sort by start time
      allSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));
      const earliest = allSlots[0];
      
      return {
        date,
        time: formatTime(earliest.start_time),
        type: earliest.type
      };
    }
  }

  return null;
}

export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateString === today.toISOString().split('T')[0]) {
    return 'Today';
  } else if (dateString === tomorrow.toISOString().split('T')[0]) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  }
}

export interface AvailabilitySummary {
  lines: string[];
  hasAvailability: boolean;
  nextAvailable: {
    date: string;
    displayDate: string;
    type: 'online' | 'home_visit';
    time: string;
  } | null;
}

export function getSmartAvailabilitySummary(
  availability: Record<string, DayAvailability> | undefined
): AvailabilitySummary {
  if (!availability) {
    return { lines: [], hasAvailability: false, nextAvailable: null };
  }

  const lines: string[] = [];
  const today = new Date().toISOString().split('T')[0];
  const dates = Object.keys(availability).sort();
  
  let nextAvailable: AvailabilitySummary['nextAvailable'] = null;
  let foundTodayAvailability = false;

  // First check today's availability
  const todaySlots = availability[today];
  if (todaySlots) {
    // Check online availability today
    const onlineAvailable = todaySlots.online?.filter(slot => slot.is_available) || [];
    if (onlineAvailable.length > 0) {
      const firstOnline = onlineAvailable[0];
      const lastOnline = onlineAvailable[onlineAvailable.length - 1];
      lines.push(`Online available today from ${formatTime(firstOnline.start_time)} - ${formatTime(lastOnline.end_time)}`);
      foundTodayAvailability = true;
    }

    // Check home visit availability today
    const homeAvailable = todaySlots.home_visit?.filter(slot => slot.is_available) || [];
    if (homeAvailable.length > 0) {
      const firstHome = homeAvailable[0];
      const lastHome = homeAvailable[homeAvailable.length - 1];
      lines.push(`Home visit available today from ${formatTime(firstHome.start_time)} - ${formatTime(lastHome.end_time)}`);
      foundTodayAvailability = true;
    }
  }

  // If no availability today, check future dates
  if (!foundTodayAvailability) {
    for (const date of dates) {
      if (date <= today) continue; // Skip past and today
      
      const daySlots = availability[date];
      
      // Check online slots
      const onlineSlots = daySlots.online?.filter(slot => slot.is_available) || [];
      if (onlineSlots.length > 0 && lines.length === 0) {
        const firstSlot = onlineSlots[0];
        const lastSlot = onlineSlots[onlineSlots.length - 1];
        const displayDate = formatDateForDisplay(date);
        lines.push(`Online available ${displayDate.toLowerCase()} from ${formatTime(firstSlot.start_time)} - ${formatTime(lastSlot.end_time)}`);
        
        if (!nextAvailable) {
          nextAvailable = {
            date,
            displayDate,
            type: 'online',
            time: formatTime(firstSlot.start_time)
          };
        }
      }

      // Check home visit slots
      const homeSlots = daySlots.home_visit?.filter(slot => slot.is_available) || [];
      if (homeSlots.length > 0 && lines.length < 2) {
        const firstSlot = homeSlots[0];
        const lastSlot = homeSlots[homeSlots.length - 1];
        const displayDate = formatDateForDisplay(date);
        lines.push(`Home visit available ${displayDate.toLowerCase()} from ${formatTime(firstSlot.start_time)} - ${formatTime(lastSlot.end_time)}`);
        
        if (!nextAvailable) {
          nextAvailable = {
            date,
            displayDate,
            type: 'home_visit',
            time: formatTime(firstSlot.start_time)
          };
        }
      }

      // Stop after finding first available date
      if (lines.length > 0) break;
    }
  }

  return {
    lines,
    hasAvailability: lines.length > 0,
    nextAvailable: foundTodayAvailability ? null : nextAvailable
  };
}