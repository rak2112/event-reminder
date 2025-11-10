import React, { useState } from 'react';
import { CheckCircle, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';

const ReminderCard = ({
  reminder,
  onToggleComplete,
  onDelete,
  getMemberName,
  getMemberColor,
  isCompleting,
  isDeleting,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityColors = {
    high: 'danger',
    medium: 'warning',
    low: 'success',
  };

  const hasLongDescription = reminder.description && reminder.description.length > 100;
  const displayDescription = hasLongDescription && !isExpanded
    ? reminder.description.substring(0, 100) + '...'
    : reminder.description;

  return (
    <Card
      hover
      className="transition-all duration-200 !bg-[#1a1a2e] border-[#2a2a3e] border-l-4 border-r-4"
      style={{ borderLeftColor: getMemberColor(reminder.member) }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Checkbox and Title */}
          <div className="flex items-center space-x-3 mb-3">
            <button
              onClick={() => onToggleComplete(reminder.id, 'reminder')}
              disabled={isCompleting}
              className="flex-shrink-0 transition-transform hover:scale-110 disabled:opacity-50"
            >
              <CheckCircle
                className={`w-7 h-7 transition-colors ${
                  reminder.completed
                    ? 'text-[#f4a261] fill-current'
                    : 'text-gray-600 hover:text-[#f4a261]'
                }`}
              />
            </button>
            <h3
              className={`text-lg font-semibold transition-all ${
                reminder.completed
                  ? 'line-through text-gray-500'
                  : 'text-white'
              }`}
            >
              {reminder.title}
            </h3>
          </div>

          {/* Description */}
          {reminder.description && (
            <div className="ml-10 mb-4">
              <p className="text-gray-300 leading-relaxed text-sm">
                {displayDescription}
              </p>
              {hasLongDescription && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#f4a261] hover:text-[#e76f51] text-sm mt-2 flex items-center space-x-1"
                >
                  {isExpanded ? (
                    <>
                      <span>Show less</span>
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Show more</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 ml-10">
            <Badge
              variant="custom"
              style={{
                backgroundColor: getMemberColor(reminder.member),
                color: '#ffffff',
              }}
              className="font-medium"
            >
              {getMemberName(reminder.member)}
            </Badge>

            <Badge variant={priorityColors[reminder.priority]} className="font-medium">
              {reminder.priority} priority
            </Badge>

            {reminder.date && (
              <Badge variant="secondary" className="flex items-center space-x-1 bg-[#2a2a3e] text-gray-300">
                <Clock className="w-4 h-4" />
                <span>{new Date(reminder.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                {reminder.time && <span>• {reminder.time}</span>}
              </Badge>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(reminder.id, 'reminder')}
          disabled={isDeleting}
          className="text-gray-500 hover:text-red-400 ml-4 p-2 rounded-lg hover:bg-[#2a2a3e] transition-all disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </Card>
  );
};

export default ReminderCard;
