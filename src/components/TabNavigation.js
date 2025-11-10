import React from 'react';
import { Calendar, Bell } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange, eventCount, reminderCount }) => {
  const tabs = [
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      count: eventCount,
      activeColor: '#14b8a6',
      inactiveColor: '#6b7280',
    },
    {
      id: 'reminders',
      label: 'Reminders',
      icon: Bell,
      count: reminderCount,
      activeColor: '#f4a261',
      inactiveColor: '#6b7280',
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl transition-all font-semibold relative ${
                isActive
                  ? 'bg-[#2a2a3e] text-white'
                  : 'bg-[#1a1a2e] text-gray-400 hover:text-gray-300 hover:bg-[#2a2a3e]'
              }`}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: isActive ? tab.activeColor : tab.inactiveColor }}
              />
              <span>{tab.label}</span>
              <span
                className="px-2.5 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: isActive ? tab.activeColor : '#374151',
                  color: '#ffffff',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
