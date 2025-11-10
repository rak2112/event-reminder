import React, { useState } from 'react';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

const RemindersSection = ({ reminders, onReminderClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const colors = [
    { bg: '#a8dadc', text: '#0a0a0f' }, // mint
    { bg: '#1a1a2e', text: '#ffffff', border: '#2a2a3e' }, // dark
    { bg: '#f4a261', text: '#0a0a0f' }, // coral
    { bg: '#8ecae6', text: '#0a0a0f' }, // sky
  ];

  const todayReminders = reminders
    .filter(r => !r.completed)
    .slice(0, 6);

  return (
    <div className="bg-[#1a1a2e] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-bold">All Reminders</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[#2a2a3e] rounded-lg"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mb-4">
          <h3 className="text-gray-300 text-base font-semibold mb-1">About Today</h3>
          <p className="text-gray-500 text-sm">Your daily reminders are here</p>
        </div>

        <div className="space-y-3">
          {todayReminders.map((reminder, index) => {
            const colorScheme = colors[index % colors.length];
            const isDark = colorScheme.border;

            return (
              <div
                key={reminder.id}
                onClick={() => onReminderClick && onReminderClick(reminder)}
                className={`rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity ${
                  isDark ? 'border-2' : ''
                }`}
                style={{
                  backgroundColor: colorScheme.bg,
                  borderColor: colorScheme.border || 'transparent',
                }}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div
                    className="text-4xl font-bold"
                    style={{ color: colorScheme.text }}
                  >
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h4
                      className="font-semibold text-base"
                      style={{ color: colorScheme.text }}
                    >
                      {reminder.title}
                    </h4>
                    {reminder.description && (
                      <p
                        className="text-sm mt-1 opacity-80"
                        style={{ color: colorScheme.text }}
                      >
                        {reminder.description}
                      </p>
                    )}
                  </div>
                </div>

                <ChevronRight
                  className="w-6 h-6"
                  style={{ color: colorScheme.text }}
                />
              </div>
            );
          })}
        </div>

        {todayReminders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No reminders for today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersSection;
