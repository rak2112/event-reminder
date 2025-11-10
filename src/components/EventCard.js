import React, { useState } from 'react';
import { CheckCircle, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';

const EventCard = ({
  event,
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

  const hasLongDescription = event.description && event.description.length > 100;
  const displayDescription = hasLongDescription && !isExpanded
    ? event.description.substring(0, 100) + '...'
    : event.description;

  return (
    <Card hover className="transition-all duration-200 !bg-[#1a1a2e] border-[#a8dadc] border-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Checkbox and Title */}
          <div className="flex items-center space-x-3 mb-3">
            <button
              onClick={() => onToggleComplete(event.id, 'event')}
              disabled={isCompleting}
              className="flex-shrink-0 transition-transform hover:scale-110 disabled:opacity-50"
            >
              <CheckCircle
                className={`w-7 h-7 transition-colors ${
                  event.completed
                    ? 'text-[#14b8a6] fill-current'
                    : 'text-gray-600 hover:text-[#14b8a6]'
                }`}
              />
            </button>
            <h3
              className={`text-lg font-semibold transition-all ${
                event.completed
                  ? 'line-through text-gray-500'
                  : 'text-white'
              }`}
            >
              {event.title}
            </h3>
          </div>

          {/* Description */}
          {event.description && (
            <div className="ml-10 mb-4">
              <p className="text-gray-300 leading-relaxed text-sm">
                {displayDescription}
              </p>
              {hasLongDescription && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#14b8a6] hover:text-[#0d9488] text-sm mt-2 flex items-center space-x-1"
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
                backgroundColor: getMemberColor(event.member),
                color: '#ffffff',
              }}
              className="font-medium"
            >
              {getMemberName(event.member)}
            </Badge>

            <Badge variant={priorityColors[event.priority]} className="font-medium">
              {event.priority} priority
            </Badge>

            {event.date && (
              <Badge variant="primary" className="flex items-center space-x-1 bg-[#2a2a3e] text-[#a8dadc]">
                <Clock className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                {event.time && <span>• {event.time}</span>}
              </Badge>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(event.id, 'event')}
          disabled={isDeleting}
          className="text-gray-500 hover:text-red-400 ml-4 p-2 rounded-lg hover:bg-[#2a2a3e] transition-all disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </Card>
  );
};

export default EventCard;
