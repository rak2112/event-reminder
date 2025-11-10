import React from 'react';
import { Loader } from './ui/Loader';

const LoadingScreen = ({ message = 'Loading Family Hub...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-3xl shadow-2xl animate-bounce-slow">
            <svg
              className="w-20 h-20 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>

          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-3xl bg-indigo-400 opacity-20 animate-ping" />
          <div className="absolute inset-0 rounded-3xl bg-purple-400 opacity-20 animate-ping animation-delay-150" />
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Family Hub
          </h2>
          <Loader size="lg" text={message} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
