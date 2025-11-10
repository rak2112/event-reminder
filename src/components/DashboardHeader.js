import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

const DashboardHeader = ({ events, onAddEvent }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const now = new Date();
  const dayNumber = now.getDate().toString().padStart(2, '0');
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

  const completedCount = events.filter(e => e.completed).length;
  const scheduledCount = events.filter(e => !e.completed).length;

  return (
    <div className="bg-[#1a1a2e] rounded-3xl p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-baseline space-x-4 mb-2">
            <h1 className="text-8xl font-bold text-white">{dayNumber}</h1>
            <div>
              <p className="text-gray-300 text-lg">{monthYear}</p>
              <p className="text-gray-400 text-md">{dayName}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onAddEvent}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-6 h-6 text-gray-900" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-[#2a2a3e] rounded-lg"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#16213e] rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Completed</p>
            <p className="text-6xl font-bold text-white">{completedCount.toString().padStart(2, '0')}</p>
          </div>

          <div className="bg-[#16213e] rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Scheduled</p>
            <p className="text-6xl font-bold text-white">{scheduledCount.toString().padStart(2, '0')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
