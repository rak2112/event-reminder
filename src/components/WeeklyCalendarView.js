import React, { useMemo, useState } from 'react';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

const WeeklyCalendarView = ({ events }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const currentWeek = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }, []);

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];

  const getEventsForDay = (day) => {
    return events.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  const getEventColor = (event) => {
    const colors = ['#a8dadc', '#8ecae6', '#f4a261', '#e76f51', '#2dd4bf', '#38bdf8'];
    const index = event.assignedTo ? event.assignedTo % colors.length : 0;
    return colors[index];
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-[#1a1a2e] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold">Weekly View</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[#2a2a3e] rounded-lg"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="grid grid-cols-[60px_1fr] gap-4">
          {/* Time column */}
          <div className="flex flex-col justify-around pt-8">
            {timeSlots.map((time) => (
              <div key={time} className="text-gray-400 text-xs">
                {time}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="space-y-2">
            {currentWeek.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);

              return (
                <div key={dayIndex} className="flex items-center space-x-3">
                  <div className="w-12 text-gray-300 text-sm font-medium">
                    {dayNames[dayIndex]}
                  </div>

                  <div className="flex-1 flex items-center space-x-2">
                    {dayEvents.length > 0 ? (
                      dayEvents.map((event, eventIndex) => (
                        <div
                          key={event.id || eventIndex}
                          className="px-4 py-2 rounded-full flex items-center space-x-2 min-w-[140px]"
                          style={{ backgroundColor: getEventColor(event) }}
                        >
                          <span className="text-gray-900 text-sm font-medium truncate flex-1">
                            {event.title}
                          </span>
                          <span className="text-gray-900 text-xs font-bold">
                            {event.assignedTo !== undefined ?
                              String.fromCharCode(72 + (event.assignedTo % 4)) : 'H'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="h-10"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendarView;
