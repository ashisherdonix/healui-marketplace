'use client';

import React from 'react';
import { Grid3x3, CalendarDays } from 'lucide-react';

interface DateSelectionProps {
  dateViewMode: 'quick' | 'calendar';
  setDateViewMode: (mode: 'quick' | 'calendar') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  dateSlotCounts: {[key: string]: {HOME_VISIT: number, ONLINE: number}};
  consultationType: 'HOME_VISIT' | 'ONLINE';
  findNextAvailableSlot: () => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({
  dateViewMode,
  setDateViewMode,
  selectedDate,
  setSelectedDate,
  dateSlotCounts,
  consultationType,
  findNextAvailableSlot
}) => {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getSlotCountForDate = (dateString: string) => {
    const slotData = dateSlotCounts[dateString];
    if (!slotData) return 0;
    return slotData[consultationType];
  };

  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const getDaysOfMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date: date,
        dateString: date.toISOString().split('T')[0],
        isPast: date < new Date(new Date().setHours(0,0,0,0))
      });
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    const today = new Date();
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (newMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(newMonth);
    }
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    if (newMonth <= sixMonthsLater) {
      setCurrentMonth(newMonth);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #E5E7EB',
      marginBottom: '8px'
    }}>
      <div style={{
        marginBottom: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1F2937',
            margin: 0
          }}>
            Select Date
          </h3>
          <div style={{
            display: 'flex',
            backgroundColor: '#F3F4F6',
            borderRadius: '8px',
            padding: '2px'
          }}>
            <button
              onClick={() => setDateViewMode('quick')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: dateViewMode === 'quick' ? '#2563EB' : 'transparent',
                color: dateViewMode === 'quick' ? 'white' : '#6B7280',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Grid3x3 style={{ width: '14px', height: '14px' }} />
              <span className="desktop-only">Quick</span>
            </button>
            <button
              onClick={() => setDateViewMode('calendar')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: dateViewMode === 'calendar' ? '#2563EB' : 'transparent',
                color: dateViewMode === 'calendar' ? 'white' : '#6B7280',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <CalendarDays style={{ width: '14px', height: '14px' }} />
              <span className="desktop-only">Calendar</span>
            </button>
          </div>
        </div>
      </div>
      
      {dateViewMode === 'quick' && (
        <>
          <style>{`
            @media (min-width: 769px) {
              .date-selection-mobile {
                display: none !important;
              }
            }
            @media (max-width: 768px) {
              .date-selection-desktop {
                display: none !important;
              }
            }
            .date-selection-mobile::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* Mobile: Horizontal scrollable */}
          <div className="date-selection-mobile" style={{
            overflowX: 'auto',
            paddingBottom: '4px',
            marginBottom: '8px',
            WebkitOverflowScrolling: 'touch'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              minWidth: 'max-content',
              paddingRight: '16px'
            }}>
              {[0, 1, 2, 3, 4, 5, 6].map((daysAhead) => {
                const date = new Date();
                date.setDate(date.getDate() + daysAhead);
                const dateString = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateString;
                const slotCount = getSlotCountForDate(dateString);
                
                return (
                  <button
                    key={dateString}
                    onClick={() => setSelectedDate(dateString)}
                    disabled={slotCount === 0}
                    style={{
                      position: 'relative',
                      padding: '10px 12px',
                      minWidth: '85px',
                      border: `2px solid ${isSelected ? '#2563EB' : '#E5E7EB'}`,
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#EFF6FF' : slotCount > 0 ? 'white' : '#F9FAFB',
                      color: slotCount > 0 ? (isSelected ? '#1E40AF' : '#1F2937') : '#9CA3AF',
                      cursor: slotCount > 0 ? 'pointer' : 'not-allowed',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      opacity: slotCount === 0 ? 0.6 : 1,
                      minHeight: '65px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '12px', lineHeight: '1.2' }}>
                      {daysAhead === 0 ? 'Today' : daysAhead === 1 ? 'Tomorrow' : formatDate(date)}
                    </div>
                    <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>
                      {slotCount > 0 ? `${slotCount} slots` : 'No slots'}
                    </div>
                    {isSelected && slotCount > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '18px',
                        height: '18px',
                        backgroundColor: '#2563EB',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}>
                        <span style={{ fontSize: '10px', color: 'white' }}>✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Desktop: Grid layout */}
          <div className="date-selection-desktop" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px'
          }}>
            {[0, 1, 2, 3, 4, 5, 6].map((daysAhead) => {
              const date = new Date();
              date.setDate(date.getDate() + daysAhead);
              const dateString = date.toISOString().split('T')[0];
              const isSelected = selectedDate === dateString;
              const slotCount = getSlotCountForDate(dateString);
              
              return (
                <button
                  key={dateString}
                  onClick={() => setSelectedDate(dateString)}
                  disabled={slotCount === 0}
                  style={{
                    position: 'relative',
                    padding: '12px 8px',
                    border: `2px solid ${isSelected ? '#2563EB' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#EFF6FF' : slotCount > 0 ? 'white' : '#F9FAFB',
                    color: slotCount > 0 ? (isSelected ? '#1E40AF' : '#1F2937') : '#9CA3AF',
                    cursor: slotCount > 0 ? 'pointer' : 'not-allowed',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    opacity: slotCount === 0 ? 0.6 : 1,
                    minHeight: '70px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (slotCount > 0 && !isSelected) {
                      e.currentTarget.style.borderColor = '#93BBFB';
                      e.currentTarget.style.backgroundColor = '#F0F9FF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (slotCount > 0 && !isSelected) {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ fontWeight: '600', fontSize: '14px', lineHeight: '1.2' }}>
                    {daysAhead === 0 ? 'Today' : daysAhead === 1 ? 'Tomorrow' : formatDate(date)}
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>
                    {slotCount > 0 ? `${slotCount} slots` : 'No slots'}
                  </div>
                  {isSelected && slotCount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#2563EB',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}>
                      <span style={{ fontSize: '12px', color: 'white' }}>✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
      
      {dateViewMode === 'calendar' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#1e5f79',
            textAlign: 'center',
            fontWeight: '600',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={goToPreviousMonth}
              disabled={currentMonth <= new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                opacity: currentMonth <= new Date(new Date().getFullYear(), new Date().getMonth(), 1) ? 0.5 : 1,
                transition: 'opacity 0.2s ease'
              }}
            >
              ←
            </button>
            <span>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={goToNextMonth}
              disabled={currentMonth >= new Date(new Date().getFullYear(), new Date().getMonth() + 6, 1)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                opacity: currentMonth >= new Date(new Date().getFullYear(), new Date().getMonth() + 6, 1) ? 0.5 : 1,
                transition: 'opacity 0.2s ease'
              }}
            >
              →
            </button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            backgroundColor: '#E5E7EB',
            padding: '1px'
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{
                padding: '8px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6B7280',
                backgroundColor: '#F9FAFB'
              }}>
                {day}
              </div>
            ))}
          </div>
          
          <div className="calendar-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            backgroundColor: '#E5E7EB',
            padding: '1px'
          }}>
            {getDaysOfMonth().map((dayInfo, i) => {
              if (!dayInfo) {
                return <div key={`empty-${i}`} style={{ padding: '12px' }}></div>;
              }
              
              const isSelected = selectedDate === dayInfo.dateString;
              const slotCount = getSlotCountForDate(dayInfo.dateString);
              const today = new Date();
              const todayString = today.toISOString().split('T')[0];
              const isToday = dayInfo.dateString === todayString;
              
              return (
                <button
                  key={dayInfo.dateString}
                  onClick={() => !dayInfo.isPast && slotCount > 0 && setSelectedDate(dayInfo.dateString)}
                  disabled={dayInfo.isPast || slotCount === 0}
                  style={{
                    padding: '14px 8px',
                    minHeight: '50px',
                    backgroundColor: isSelected ? '#1e5f79' : isToday ? '#c8eaeb' : 'white',
                    border: 'none',
                    cursor: dayInfo.isPast || slotCount === 0 ? 'not-allowed' : 'pointer',
                    opacity: dayInfo.isPast ? 0.4 : 1,
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!dayInfo.isPast && slotCount > 0 && !isSelected) {
                      e.currentTarget.style.backgroundColor = '#eff8ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!dayInfo.isPast && slotCount > 0 && !isSelected) {
                      e.currentTarget.style.backgroundColor = isToday ? '#c8eaeb' : 'white';
                    }
                  }}
                >
                  <div style={{
                    fontSize: '14px',
                    fontWeight: isToday || isSelected ? '700' : '400',
                    color: isSelected ? 'white' : dayInfo.isPast ? '#9CA3AF' : '#1F2937'
                  }}>
                    {dayInfo.date.getDate()}
                  </div>
                  {slotCount > 0 && !dayInfo.isPast && (
                    <div style={{
                      fontSize: '10px',
                      marginTop: '2px',
                      color: isSelected ? 'white' : '#1e5f79',
                      fontWeight: '600'
                    }}>
                      {slotCount} slots
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelection;