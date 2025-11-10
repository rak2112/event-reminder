import React from 'react';
import Card from './ui/Card';

const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <Card className="text-center py-16" shadow="lg">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-full">
          <Icon className="w-16 h-16 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EmptyState;
